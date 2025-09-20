import { useState, useEffect, useRef } from "react";
import { Preferences } from "@capacitor/preferences";
import { Network } from "@capacitor/network";
import { getImageUrl, getReverseGeocode, sendScanResult } from "@/lib/helper";

export interface OfflineScanResult {
  id: string;
  timestamp: number;
  imageData: string; // Base64 encoded image
  percentage: number;
  resultArr: any[];
  result: string;
  locationData: {
    latitude: number;
    longitude: number;
  };
  synced: boolean;
  retryCount: number;
  lastSyncAttempt?: number;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAttempt?: number;
  syncErrors: string[];
}

const OFFLINE_SCANS_KEY = "offline_scans";
const MAX_RETRY_COUNT = 3;

function useOfflineStorage() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    isSyncing: false,
    pendingCount: 0,
    syncErrors: [],
  });

  // Check network status
  const checkNetworkStatus = async () => {
    try {
      const status = await Network.getStatus();
      setSyncStatus((prev) => ({ ...prev, isOnline: status.connected }));
      return status.connected;
    } catch (error) {
      console.error("Error checking network status:", error);
      return false;
    }
  };

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Save scan result offline
  const saveScanOffline = async (
    file: File,
    percentage: number,
    resultArr: any[],
    result: string,
    locationData: { latitude: number; longitude: number },
  ): Promise<string> => {
    try {
      const imageData = await fileToBase64(file);
      const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const offlineScan: OfflineScanResult = {
        id: scanId,
        timestamp: Date.now(),
        imageData,
        percentage,
        resultArr,
        result,
        locationData,
        synced: false,
        retryCount: 0,
      };

      // Get existing offline scans
      const existingScans = await getOfflineScans();
      const updatedScans = [...existingScans, offlineScan];

      // Save to preferences
      await Preferences.set({
        key: OFFLINE_SCANS_KEY,
        value: JSON.stringify(updatedScans),
      });

      // Update pending count
      setSyncStatus((prev) => ({
        ...prev,
        pendingCount: updatedScans.filter((scan) => !scan.synced).length,
      }));

      return scanId;
    } catch (error) {
      console.error("Error saving scan offline:", error);
      throw error;
    }
  };

  // Get all offline scans
  const getOfflineScans = async (): Promise<OfflineScanResult[]> => {
    try {
      const result = await Preferences.get({ key: OFFLINE_SCANS_KEY });
      return result.value ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error("Error getting offline scans:", error);
      return [];
    }
  };

  // Get pending (unsynced) scans
  const getPendingScans = async (): Promise<OfflineScanResult[]> => {
    const scans = await getOfflineScans();
    return scans.filter(
      (scan) => !scan.synced && scan.retryCount < MAX_RETRY_COUNT,
    );
  };

  // Update scan status
  const updateScanStatus = async (
    scanId: string,
    updates: Partial<OfflineScanResult>,
  ) => {
    try {
      const scans = await getOfflineScans();
      const updatedScans = scans.map((scan) =>
        scan.id === scanId ? { ...scan, ...updates } : scan,
      );

      // ✅ VERIFY the update actually happened
      const updatedScan = updatedScans.find((s) => s.id === scanId);
      console.log(`📝 Updated scan ${scanId}:`, {
        synced: updatedScan?.synced,
        retryCount: updatedScan?.retryCount,
      });

      await Preferences.set({
        key: OFFLINE_SCANS_KEY,
        value: JSON.stringify(updatedScans),
      });

      // Update pending count
      setSyncStatus((prev) => ({
        ...prev,
        pendingCount: updatedScans.filter((scan) => !scan.synced).length,
      }));
    } catch (error) {
      console.error("Error updating scan status:", error);
    }
  };

  // Sync single scan result
  const syncSingleScan = async (scan: OfflineScanResult): Promise<boolean> => {
    try {
      // Convert base64 back to File
      const response = await fetch(scan.imageData);
      const blob = await response.blob();
      const file = new File([blob], `scan_${scan.id}.jpg`, {
        type: "image/jpeg",
      });

      // Create FormData for image upload
      const formData = new FormData();
      formData.append("file", file);

      // Try to get image URL from Cloudinary
      let imgUrl: string | null = null;
      try {
        // const { getImageUrl } = await import("@/lib/helper");
        imgUrl = await getImageUrl(formData);
      } catch (error) {
        console.warn("Failed to upload to Cloudinary:", error);
        // Continue without image URL for now
      }

      // Try to get reverse geocode
      let address = null;
      try {
        // const { getReverseGeocode } = await import("@/lib/helper");
        address = await getReverseGeocode(
          scan.locationData.latitude,
          scan.locationData.longitude,
        );
      } catch (error) {
        console.warn("Failed to get reverse geocode:", error);
        // Use basic location data
        address = {
          latitude: scan.locationData.latitude,
          longitude: scan.locationData.longitude,
        };
      }

      // Prepare payload
      const payload = {
        percentage: scan.percentage,
        resultArr: scan.resultArr,
        result: scan.result,
        imgUrl: imgUrl || "",
        address: address,
        timestamp: scan.timestamp, // Include original timestamp
      };

      // Send to backend
      //   const { sendScanResult } = await import("@/lib/helper");
      await sendScanResult(payload);

      // ✅ FIXED: Mark as synced AND remove from pending list immediately
      await updateScanStatus(scan.id, {
        synced: true,
        lastSyncAttempt: Date.now(),
      });

      await clearSyncedScans();

      console.log(`✅ Scan ${scan.id} successfully synced and marked`);
      return true;
    } catch (error) {
      console.error("Failed to sync scan:", error);

      // ✅ FIXED: Only increment retry count, don't mark as synced
      await updateScanStatus(scan.id, {
        retryCount: scan.retryCount + 1,
        lastSyncAttempt: Date.now(),
      });

      return false;
    }
  };

  // Sync all pending scans
  const syncingRef = useRef(false);

  const syncAllPendingScans = async () => {
    if (syncingRef.current) {
      console.log("⏸️ Sync already running, skipping...");
      return;
    }
    if (!syncStatus.isOnline) {
      console.log("📴 Offline, skipping sync...");
      return;
    }

    syncingRef.current = true;
    setSyncStatus((prev) => ({
      ...prev,
      isSyncing: true,
      lastSyncAttempt: Date.now(),
      syncErrors: [],
    }));

    try {
      const pendingScans = await getPendingScans();
      const errors: string[] = [];

      for (const scan of pendingScans) {
        const success = await syncSingleScan(scan);
        if (!success) {
          errors.push(
            `Failed to sync scan from ${new Date(scan.timestamp).toLocaleString()}`,
          );
        }
        await new Promise((res) => setTimeout(res, 1000));
      }

      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        syncErrors: errors,
      }));
    } catch (error) {
      console.error("Error during sync:", error);
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        syncErrors: ["Sync process failed"],
      }));
    } finally {
      syncingRef.current = false; // 🔑 release lock
    }
  };

  // Clear synced scans (cleanup)
  const clearSyncedScans = async (): Promise<void> => {
    try {
      const scans = await getOfflineScans();
      const unsyncedScans = scans.filter((scan) => !scan.synced);

      await Preferences.set({
        key: OFFLINE_SCANS_KEY,
        value: JSON.stringify(unsyncedScans),
      });

      setSyncStatus((prev) => ({
        ...prev,
        pendingCount: unsyncedScans.length,
      }));
    } catch (error) {
      console.error("Error clearing synced scans:", error);
    }
  };

  // Initialize and set up network listener
  useEffect(() => {
    let networkListener: any;

    const setupNetworkListener = async () => {
      // Check initial status
      await checkNetworkStatus();

      // Update pending count
      const pendingScans = await getPendingScans();
      setSyncStatus((prev) => ({ ...prev, pendingCount: pendingScans.length }));

      networkListener = await Network.addListener(
        "networkStatusChange",
        async (status) => {
          setSyncStatus((prev) => ({ ...prev, isOnline: status.connected }));

          if (status.connected) {
            setTimeout(async () => {
              if (!syncingRef.current) {
                console.log("🔄 Auto-sync triggered by network reconnection");
                await syncAllPendingScans();
              } else {
                console.log("⏸️ Auto-sync skipped - sync already running");
              }
            }, 2000);
          }
        },
      );
    };

    setupNetworkListener();

    return () => {
      if (networkListener) {
        networkListener.remove();
      }
    };
  }, []);

  return {
    syncStatus,
    saveScanOffline,
    syncAllPendingScans,
    getPendingScans,
    getOfflineScans,
    clearSyncedScans,
    checkNetworkStatus,
  };
}

export default useOfflineStorage;

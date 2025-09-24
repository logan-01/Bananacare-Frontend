"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  ChevronDown,
  ChevronUp,
  Trash2,
  MapPin,
} from "lucide-react";
import useOfflineStorage from "@/hooks/useOfflineStorage";
import { OfflineScanResult, SyncStatus } from "@/hooks/useOfflineStorage";
// // Mock types to match your real hook
// interface OfflineScanResult {
//   id: string;
//   timestamp: number;
//   imageData: string;
//   percentage: number;
//   resultArr: any[];
//   result: string;
//   locationData: {
//     latitude: number;
//     longitude: number;
//   };
//   synced: boolean;
//   retryCount: number;
//   lastSyncAttempt?: number;
// }

// interface SyncStatus {
//   isOnline: boolean;
//   isSyncing: boolean;
//   pendingCount: number;
//   lastSyncAttempt?: number;
//   syncErrors: string[];
// }

// Mock hook for development
const mockUseOfflineStorage = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    isSyncing: false,
    pendingCount: 3,
    lastSyncAttempt: Date.now() - 120000,
    syncErrors: [],
  });

  const [pendingScans] = useState<OfflineScanResult[]>([
    {
      id: "scan_1",
      timestamp: Date.now() - 300000,
      imageData:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
      percentage: 85,
      resultArr: [],
      result: "Plastic Bottle",
      locationData: { latitude: 14.4713, longitude: 120.9794 },
      synced: false,
      retryCount: 1,
    },
    {
      id: "scan_2",
      timestamp: Date.now() - 600000,
      imageData:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
      percentage: 92,
      resultArr: [],
      result: "Aluminum Can",
      locationData: { latitude: 14.4713, longitude: 120.9794 },
      synced: false,
      retryCount: 0,
    },
    {
      id: "scan_3",
      timestamp: Date.now() - 900000,
      imageData:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
      percentage: 78,
      resultArr: [],
      result: "Glass Container",
      locationData: { latitude: 14.4713, longitude: 120.9794 },
      synced: false,
      retryCount: 2,
    },
  ]);

  const syncAllPendingScans = async (): Promise<void> => {
    setSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setSyncStatus((prev) => ({
      ...prev,
      isSyncing: false,
      pendingCount: Math.max(0, prev.pendingCount - 2),
      lastSyncAttempt: Date.now(),
    }));
  };

  const checkNetworkStatus = async (): Promise<void> => {
    setSyncStatus((prev) => ({ ...prev, isOnline: !prev.isOnline }));
  };

  const getPendingScans = async (): Promise<OfflineScanResult[]> => {
    return pendingScans.filter((scan) => !scan.synced);
  };

  const clearSyncedScans = async (): Promise<void> => {
    // Mock implementation
    console.log("Clearing synced scans...");
  };

  return {
    syncStatus,
    syncAllPendingScans,
    checkNetworkStatus,
    getPendingScans,
    clearSyncedScans,
  };
};

const SynDashboard = () => {
  const {
    syncStatus,
    syncAllPendingScans,
    checkNetworkStatus,
    getPendingScans,
    clearSyncedScans,
  } = useOfflineStorage();

  const [showDetails, setShowDetails] = useState(true);
  const [pendingScans, setPendingScans] = useState<OfflineScanResult[]>([]);

  useEffect(() => {
    const loadPendingScans = async () => {
      const scans = await getPendingScans();
      setPendingScans(scans);
    };
    loadPendingScans();
  }, [syncStatus.pendingCount]);

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getStatusColor = (): string => {
    if (!syncStatus.isOnline) return "text-danger";
    if (syncStatus.isSyncing) return "text-secondary";
    if (syncStatus.pendingCount === 0) return "text-primary";
    return "text-orange-500";
  };

  const getStatusIcon = (): React.ReactElement => {
    if (!syncStatus.isOnline) return <WifiOff className="h-5 w-5" />;
    if (syncStatus.isSyncing)
      return <RefreshCw className="h-5 w-5 animate-spin" />;
    if (syncStatus.pendingCount === 0)
      return <CheckCircle className="h-5 w-5" />;
    return <Clock className="text-primary h-5 w-5" />;
  };

  const getStatusText = (): string => {
    if (!syncStatus.isOnline) return "Offline";
    if (syncStatus.isSyncing) return "Syncing...";
    if (syncStatus.pendingCount === 0) return "All synced";
    return `${syncStatus.pendingCount} pending`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Status Card */}
      <div className="">
        <div className="mb-4 rounded-lg border border-gray-300 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${getStatusColor()}`}>{getStatusIcon()}</div>
              <div>
                <div className="font-medium text-gray-900">
                  {getStatusText()}
                </div>
                {syncStatus.lastSyncAttempt && (
                  <div className="text-sm text-gray-500">
                    Last sync: {getTimeAgo(syncStatus.lastSyncAttempt)}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={checkNetworkStatus}
              className="p-2 text-gray-400 transition-colors hover:text-gray-600"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mb-3 flex gap-2">
            <button
              onClick={syncAllPendingScans}
              disabled={
                syncStatus.isSyncing ||
                !syncStatus.isOnline ||
                syncStatus.pendingCount === 0
              }
              className="bg-primary flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 font-medium text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
            >
              {syncStatus.isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Sync Now
                </>
              )}
            </button>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="rounded-md border border-gray-300 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
            >
              {showDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {syncStatus.isSyncing && (
            <div className="mb-3">
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="bg-secondary h-full animate-pulse rounded-full"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          )}

          {/* Sync Errors */}
          {syncStatus.syncErrors.length > 0 && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-800">
                  Sync Errors
                </span>
              </div>
              {syncStatus.syncErrors.map((error, index) => (
                <div key={index} className="text-sm text-red-700">
                  {error}
                </div>
              ))}
            </div>
          )}

          {/* Network Status Alert */}
          {!syncStatus.isOnline && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-800">
                No internet connection. Scans will sync when online.
              </span>
            </div>
          )}
        </div>

        {/* Pending Scans Details */}
        {showDetails && (
          <div className="space-y-3">
            <h2 className="mb-3 font-medium text-gray-900">Pending Scans</h2>

            {pendingScans.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
                <p>All scans are synced!</p>
              </div>
            ) : (
              pendingScans.map((scan) => (
                <div
                  key={scan.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="flex gap-3 p-4">
                    {/* Image Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        <img
                          src={scan.imageData}
                          alt={scan.result}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden",
                            );
                          }}
                        />
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* Header Row */}
                      <div className="mb-2 flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-gray-900">
                            {scan.result}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-blue-800">
                              {scan.percentage}% confident
                            </span>
                            {scan.retryCount > 0 && (
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                                  scan.retryCount >= 2
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                Retry {scan.retryCount}/3
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="ml-3 flex flex-col items-end text-right">
                          <span className="mb-1 text-xs text-gray-400">
                            {getTimeAgo(scan.timestamp)}
                          </span>
                          {scan.retryCount >= 2 && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      {/* Details Row */}
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="mr-1.5 h-3 w-3" />
                          {formatTimestamp(scan.timestamp)}
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="mr-1.5 h-3 w-3" />
                          <span className="truncate">
                            {scan.locationData.latitude.toFixed(4)},{" "}
                            {scan.locationData.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      {/* Error State */}
                      {scan.retryCount >= 2 && (
                        <div className="mt-3 flex items-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-2 py-1.5 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          <span>Multiple sync failures - check connection</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {pendingScans.length > 0 && (
              <button
                onClick={clearSyncedScans}
                className="bg-danger text-light flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors hover:bg-gray-200"
              >
                <Trash2 className="h-4 w-4" />
                Clear Offline Scans
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Spacer for mobile navigation */}
      <div className="h-20" />
    </div>
  );
};

export default SynDashboard;

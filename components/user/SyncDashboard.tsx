// components/SyncDashboard.tsx
"use client";

import { useState, useEffect } from "react";

import useOfflineStorage, {
  OfflineScanResult,
} from "@/hooks/useOfflineStorage";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CloudUpload,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Activity,
  Database,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Calendar,
  Zap,
  TrendingUp,
} from "lucide-react";

function SyncDashboard() {
  const [offlineScans, setOfflineScans] = useState<OfflineScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<string | null>(null);

  const {
    syncStatus,
    syncAllPendingScans,
    getOfflineScans,
    clearSyncedScans,
    checkNetworkStatus,
  } = useOfflineStorage();

  // Load offline scans
  const loadOfflineScans = async () => {
    setLoading(true);
    try {
      const scans = await getOfflineScans();
      setOfflineScans(scans);
    } catch (error) {
      console.error("Error loading offline scans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfflineScans();
  }, [syncStatus.pendingCount, syncStatus.isSyncing]);

  const handleSync = async () => {
    await syncAllPendingScans();
    await loadOfflineScans();
  };

  const handleClearSynced = async () => {
    await clearSyncedScans();
    await loadOfflineScans();
  };

  const handleRefreshNetwork = async () => {
    await checkNetworkStatus();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-8 rounded bg-gray-200"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-16 rounded bg-gray-200"></div>
                  <div className="h-16 rounded bg-gray-200"></div>
                  <div className="h-16 rounded bg-gray-200"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const syncedScans = offlineScans.filter((scan) => scan.synced);
  const pendingScans = offlineScans.filter((scan) => !scan.synced);
  const failedScans = offlineScans.filter((scan) => scan.retryCount >= 3);
  const syncProgress =
    offlineScans.length > 0
      ? (syncedScans.length / offlineScans.length) * 100
      : 0;

  return (
    <div className="min-h-screen space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header Section */}
      <div className="py-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <Database className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Sync Dashboard
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Monitor your offline scans and synchronization status. Keep your data
          in sync across all devices.
        </p>
      </div>

      {/* Network Status Hero Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90"></div>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full bg-white/5"></div>

        <CardContent className="relative z-10 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {syncStatus.isOnline ? (
                <div className="rounded-lg bg-green-500/20 p-2">
                  <Wifi className="h-6 w-6 text-green-100" />
                </div>
              ) : (
                <div className="rounded-lg bg-orange-500/20 p-2">
                  <WifiOff className="h-6 w-6 text-orange-100" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">Network Status</h3>
                <p className="text-sm text-blue-100">
                  {syncStatus.isOnline
                    ? "Connected and ready to sync"
                    : "Offline mode active"}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshNetwork}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{pendingScans.length}</div>
              <div className="text-sm text-blue-100">Pending Sync</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{syncedScans.length}</div>
              <div className="text-sm text-blue-100">Synced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{failedScans.length}</div>
              <div className="text-sm text-blue-100">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(syncProgress)}%
              </div>
              <div className="text-sm text-blue-100">Complete</div>
            </div>
          </div>

          {syncStatus.lastSyncAttempt && (
            <div className="mt-4 border-t border-white/20 pt-4">
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <Clock className="h-4 w-4" />
                Last sync attempt:{" "}
                {new Date(syncStatus.lastSyncAttempt).toLocaleString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Controls */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Sync Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sync Progress */}
          {syncStatus.isSyncing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Synchronizing...
                </span>
                <span className="text-sm text-gray-500">
                  {syncedScans.length} of {offlineScans.length}
                </span>
              </div>
              <Progress value={syncProgress} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing your offline scans...
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Button
              onClick={handleSync}
              disabled={
                !syncStatus.isOnline ||
                syncStatus.isSyncing ||
                pendingScans.length === 0
              }
              className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <CloudUpload className="mr-2 h-4 w-4" />
              {syncStatus.isSyncing
                ? "Syncing..."
                : `Sync ${pendingScans.length} Items`}
            </Button>

            <Button
              variant="outline"
              onClick={handleClearSynced}
              disabled={syncStatus.isSyncing || syncedScans.length === 0}
              className="h-12 border-gray-300 hover:bg-gray-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear {syncedScans.length} Synced Items
            </Button>
          </div>

          {/* Sync Errors */}
          {syncStatus.syncErrors.length > 0 && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">
                    Synchronization Issues Detected
                  </div>
                  <div className="space-y-1">
                    {syncStatus.syncErrors.slice(0, 3).map((error, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <XCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                        {error}
                      </div>
                    ))}
                    {syncStatus.syncErrors.length > 3 && (
                      <div className="text-sm font-medium text-red-600">
                        +{syncStatus.syncErrors.length - 3} more errors
                      </div>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Offline Notice */}
          {!syncStatus.isOnline && (
            <Alert className="border-orange-200 bg-orange-50">
              <WifiOff className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="mb-1 font-medium">Working in Offline Mode</div>
                Your scans are being saved locally and will sync automatically
                when you're back online.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Scan History */}
      {offlineScans.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recent Scans
              <Badge variant="secondary" className="ml-auto">
                {offlineScans.length} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {offlineScans
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 8)
                .map((scan, index) => (
                  <div
                    key={scan.id}
                    className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                      selectedScan === scan.id
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setSelectedScan(selectedScan === scan.id ? null : scan.id)
                    }
                  >
                    <div className="flex items-center gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative">
                        <div className="h-16 w-16 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                          {scan.imageData && (
                            <img
                              src={scan.imageData}
                              alt="Scan"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        {/* Status Indicator */}
                        <div
                          className={`absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-white shadow-sm ${
                            scan.synced
                              ? "bg-green-500"
                              : scan.retryCount >= 3
                                ? "bg-red-500"
                                : "bg-orange-500"
                          }`}
                        >
                          {scan.synced ? (
                            <CheckCircle2 className="m-0.5 h-3 w-3 text-white" />
                          ) : scan.retryCount >= 3 ? (
                            <XCircle className="m-0.5 h-3 w-3 text-white" />
                          ) : (
                            <Clock className="m-0.5 h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Scan Info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h4 className="truncate font-semibold text-gray-900 capitalize">
                            {scan.result.replace("-", " ").replace("_", " ")}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              scan.synced
                                ? "border-green-300 bg-green-50 text-green-700"
                                : scan.retryCount >= 3
                                  ? "border-red-300 bg-red-50 text-red-700"
                                  : "border-orange-300 bg-orange-50 text-orange-700"
                            }`}
                          >
                            {scan.synced
                              ? "Synced"
                              : scan.retryCount >= 3
                                ? "Failed"
                                : "Pending"}
                            {scan.retryCount > 0 &&
                              !scan.synced &&
                              ` (${scan.retryCount})`}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(scan.timestamp).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {(scan.percentage * 100).toFixed(1)}% confidence
                          </div>
                        </div>
                      </div>

                      {/* Expand Arrow */}
                      <ChevronRight
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          selectedScan === scan.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    {/* Expanded Details */}
                    {selectedScan === scan.id && (
                      <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                          <div>
                            <div className="mb-1 font-medium text-gray-700">
                              Location
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="h-3 w-3" />
                              {scan.locationData.latitude.toFixed(6)},{" "}
                              {scan.locationData.longitude.toFixed(6)}
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 font-medium text-gray-700">
                              Scan Time
                            </div>
                            <div className="text-gray-600">
                              {new Date(scan.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {scan.resultArr.length > 1 && (
                          <div>
                            <div className="mb-2 font-medium text-gray-700">
                              Alternative Results
                            </div>
                            <div className="space-y-1">
                              {scan.resultArr.slice(1, 4).map((result, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-gray-600 capitalize">
                                    {result.id
                                      .replace("-", " ")
                                      .replace("_", " ")}
                                  </span>
                                  <span className="text-gray-500">
                                    {(result.percentage * 100).toFixed(1)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

              {offlineScans.length > 8 && (
                <div className="py-4 text-center">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-500">
                    <Database className="h-4 w-4" />
                    {offlineScans.length - 8} more scans in storage
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {offlineScans.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-12 pb-12">
            <div className="mx-auto max-w-md text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                <CloudUpload className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                No Offline Scans Yet
              </h3>
              <p className="mb-6 text-gray-600">
                When you scan bananas while offline, they'll appear here and
                sync automatically when you're back online.
              </p>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-800">
                  <Zap className="h-4 w-4" />
                  Pro Tip
                </div>
                <p className="text-sm text-blue-700">
                  The app works seamlessly offline using local AI models. Your
                  scans will be enhanced with cloud data once synced.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Stats */}
      <div className="py-6 text-center">
        <div className="inline-flex items-center gap-6 rounded-full border bg-white px-6 py-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">{syncedScans.length} Synced</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">{pendingScans.length} Pending</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">{failedScans.length} Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyncDashboard;

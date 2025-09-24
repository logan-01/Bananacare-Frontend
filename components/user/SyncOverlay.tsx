import React from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface SyncOverlayProps {
  syncStatus: {
    isOnline: boolean;
    isSyncing: boolean;
    pendingCount: number;
    lastSyncAttempt?: number;
    syncErrors: string[];
  };
}

function SyncOverlay({ syncStatus }: SyncOverlayProps) {
  const { isOnline, isSyncing, pendingCount, syncErrors } = syncStatus;

  // Don't show anything if everything is synced and online
  if (isOnline && !isSyncing && pendingCount === 0 && syncErrors.length === 0) {
    return null;
  }

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-4 w-4" />,
        text: `Offline (${pendingCount} pending)`,
        bgColor: "bg-orange-500",
        textColor: "text-white",
      };
    }

    if (isSyncing) {
      return {
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        text: "Syncing...",
        bgColor: "bg-blue-500",
        textColor: "text-white",
      };
    }

    if (syncErrors.length > 0) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: `Sync failed (${pendingCount} pending)`,
        bgColor: "bg-red-500",
        textColor: "text-white",
      };
    }

    if (pendingCount > 0) {
      return {
        icon: <Wifi className="h-4 w-4" />,
        text: `${pendingCount} pending sync`,
        bgColor: "bg-yellow-500",
        textColor: "text-white",
      };
    }

    return {
      icon: <CheckCircle className="h-4 w-4" />,
      text: "All synced",
      bgColor: "bg-green-500",
      textColor: "text-white",
    };
  };

  const config = getStatusConfig();

  return (
    <div className="animate-in slide-in-from-top-2 fixed top-4 right-4 z-50 duration-300">
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 shadow-lg ${config.bgColor} ${config.textColor} border border-white/20 backdrop-blur-sm`}
      >
        {config.icon}
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    </div>
  );
}

export default SyncOverlay;

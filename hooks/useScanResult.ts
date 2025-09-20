"use client";
import { useState, useEffect } from "react";
import { getScanResult } from "@/lib/helper";
import { ScanResultType } from "@/lib/constant";

function useScanResult(pollingInterval = 5000) {
  const [scanResult, setScanResult] = useState<ScanResultType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const scans = await getScanResult();
        setScanResult(scans);
      } catch (err) {
        console.error("Failed to load scan results", err);
      }
    }

    loadData(); // initial fetch
    const interval = setInterval(loadData, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  return scanResult;
}

export default useScanResult;

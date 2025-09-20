"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ScanTable from "@/components/admin/ScanTable";
import useScanResult from "@/hooks/useScanResult";
import { deleteScanResult } from "@/lib/helper";

function page() {
  const scanResult = useScanResult();
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <p className="font-clash-grotesk text-2xl font-semibold">
            Scan Results{" "}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mb-10 flex flex-col gap-4">
        <ScanTable data={scanResult} onDelete={deleteScanResult} />
      </div>
    </div>
  );
}

export default page;

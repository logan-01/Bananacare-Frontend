"use client";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  ScanLine,
  Check,
  ShieldAlert,
  MapPin,
  Calendar,
  ShieldPlus,
  AlertTriangle,
  Eye,
} from "lucide-react";

import RecentActivity from "@/components/admin/RecentActivity";
import TopConditions from "@/components/admin/TopConditions";
import StatCard from "@/components/admin/StatCard";
import ScanTrends from "@/components/admin/ScanTrends";
import DiseaseDistribution from "@/components/admin/DiseaseDistribution";

import useScanResult from "@/hooks/useScanResult";
import {
  getScanStat,
  getWeeklyTrends,
  getDiseaseDistribution,
} from "@/lib/helper";
// import { ScanResultType } from "@/components/admin/Admin_DataTable/columns";
// import { ScanResult } from "../generated/prisma";
// import { ScanResultType } from "@/backup/admin_components/Admin_DataTable/columns";

function page() {
  const scanResult = useScanResult();

  // Configuration for Stat Cards
  const {
    totalScans,
    totalHealthy,
    totalDiseased,
    totalLocations,
    latestScanDate,
  } = getScanStat(scanResult);
  const totalHealthyPercentage = totalScans
    ? ((totalHealthy / totalScans) * 100).toFixed(1)
    : 0;

  const statsConfig = [
    {
      icon: ScanLine,
      title: "Total Scans",
      value: totalScans,
      subtitle: `${latestScanDate}`,
      subtitleIcon: Calendar,
      borderColor: "border-l-neutral",
      iconBgColor: "bg-neutral/20",
      iconColor: "text-neutral",
      subtitleColor: "text-neutral",
    },
    {
      icon: Check,
      title: "Healthy Bananas",
      value: totalHealthy,
      subtitle: `${totalHealthyPercentage}% of total scans`,
      subtitleIcon: ShieldPlus,
      borderColor: "border-l-primary",
      iconBgColor: "bg-primary/20",
      iconColor: "text-primary",
      subtitleColor: "text-primary",
    },
    {
      icon: AlertTriangle,
      title: "Disease Bananas",
      value: totalDiseased,
      subtitle: "Requires attention",
      subtitleIcon: ShieldAlert,
      borderColor: "border-l-danger",
      iconBgColor: "bg-danger/20",
      iconColor: "text-danger",
      subtitleColor: "text-danger",
    },
    {
      icon: MapPin,
      title: "Active Locations",
      value: totalLocations,
      subtitle: "Monitoring sites",
      subtitleIcon: Eye,
      borderColor: "border-l-normal",
      iconBgColor: "bg-normal/20",
      iconColor: "text-normal",
      subtitleColor: "text-normal",
    },
  ];

  // Configuration for Scan Trends
  const {
    weeklyTrends,
    weeklyTotalHealthy,
    weeklyTotalDiseased,
    weeklyTotalScans,
  } = getWeeklyTrends(scanResult);

  const scanTrendsConfig = [
    { color: "#187498", label: "Scans", count: weeklyTotalScans ?? 0 },
    { color: "#22b123", label: "Healthy", count: weeklyTotalHealthy ?? 0 },
    { color: "#F93827", label: "Diseased", count: weeklyTotalDiseased ?? 0 },
  ];

  // Configuration for Disease Distribution
  const diseaseDistribution = getDiseaseDistribution(scanResult);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <p className="font-clash-grotesk text-2xl font-semibold">Overview</p>
        </div>
      </div>

      {/* Body */}
      <div className="mb-10 flex flex-col gap-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {statsConfig.map((config, index) => (
            <StatCard key={index} {...config} />
          ))}
        </div>

        {/* Graphs */}
        <div className="flex flex-col gap-4 md:flex-row">
          <ScanTrends data={weeklyTrends} config={scanTrendsConfig} />
          <DiseaseDistribution data={diseaseDistribution} />
        </div>

        <TopConditions data={diseaseDistribution} />
        <RecentActivity data={scanResult} />
      </div>
    </div>
  );
}

export default page;

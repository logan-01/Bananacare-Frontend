"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, LineChart } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import DiseaseCard from "@/components/admin/DiseaseCard";
import DiseaseTrends from "@/components/admin/DiseaseTrends";
import DiseaseSeverity from "@/components/admin/DiseaseSeverity";

import {
  getDiseaseTrends,
  getDiseaseTrendsConfig,
  getSeverityDistribution,
  getDiseaseStat,
} from "@/lib/helper";
import useScanResult from "@/hooks/useScanResult";

type TrendFilter = "weekly" | "monthly" | "hourly";

const page = () => {
  const [timeframe, setTimeframe] = useState<TrendFilter>("hourly");

  const scanResult = useScanResult();
  const diseaseStats = getDiseaseStat(scanResult);

  // Timeframes
  const timeframes: TrendFilter[] = ["monthly", "weekly", "hourly"];
  const diseaseTrendsConfig = getDiseaseTrendsConfig(scanResult, timeframe);

  // All Disease Trends Data
  const trendResults = Object.fromEntries(
    timeframes.map((tf) => [tf, getDiseaseTrends(scanResult, tf)]),
  ) as Record<TrendFilter, { data: any[]; uniquePeriods: number }>;

  // Disease Trend Data with specific timeframe
  const diseaseTrendsData = trendResults[timeframe].data;

  // Disable Options
  const disableOptions = Object.fromEntries(
    timeframes.map((tf) => [tf, (trendResults[tf].uniquePeriods ?? 0) < 2]),
  ) as Record<TrendFilter, boolean>;

  const severityDistributionData = getSeverityDistribution(scanResult);

  // Auto Switch Option
  useEffect(() => {
    if (disableOptions[timeframe]) {
      const fallbackOrder: TrendFilter[] = ["monthly", "weekly", "hourly"];
      const fallback = fallbackOrder.find((t) => !disableOptions[t]);
      if (fallback) setTimeframe(fallback);
    }
  }, [disableOptions, timeframe]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <p className="font-clash-grotesk text-2xl font-semibold">
            Disease Analytics
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mb-10 flex flex-col gap-4">
        {/* Trends and Analysis */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Monthly Disease Trends */}
          <DiseaseTrends
            data={diseaseTrendsData}
            config={diseaseTrendsConfig}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            disableOptions={disableOptions}
          />

          {/* Severity Distribution */}
          <DiseaseSeverity data={severityDistributionData} />
        </div>

        {/* Disease Distribution */}
        <Card className="border-2 border-gray-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/30 rounded-lg p-2">
                <LineChart className="text-primary h-6 w-6" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  Disease Statistics
                  <CheckCircle className="text-primary h-5 w-5" />
                </CardTitle>
                <CardDescription>
                  Monthly progression of major diseases
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {diseaseStats.slice(0, 6).map((disease) => (
                <DiseaseCard key={disease.id} data={disease} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;

"use client";

import React, { useState } from "react";
import { Activity, CheckCircle, Eye, TrendingDown, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";

// Risk level calculation
const getRiskLevel = (value: number) => {
  if (value === 0)
    return { level: "None", color: "bg-gray-500", textColor: "text-gray-600" };
  if (value < 2)
    return { level: "Low", color: "bg-green-500", textColor: "text-green-600" };
  if (value < 5)
    return {
      level: "Medium",
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    };
  return { level: "High", color: "bg-red-500", textColor: "text-red-600" };
};

type DiseaseDistributionType = {
  id?: string;
  name: string;
  value: number;
  count: number;
  color?: string;
};

interface TopConditionsProps {
  data: DiseaseDistributionType[];
}

function TopConditions({ data }: TopConditionsProps) {
  const [showAllResults, setShowAllResults] = useState(false);

  // Get top results (excluding 0% diseases for main display)
  const topResults = data
    .filter((result) => result.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  // Count diseases at 0% risk
  const zeroRiskCount = data.filter(
    (r) => r.value === 0 && r.id !== "healthy",
  ).length;

  const totalScanned = data.length;

  return (
    <div className="w-full overflow-hidden">
      <Card className="border-2 border-gray-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/30 rounded-lg p-2">
              <Trophy className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Top Detected Conditions
                <CheckCircle className="text-primary h-5 w-5" />
              </CardTitle>
              <CardDescription>
                Ranked by highest occurrence in the latest scan
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {topResults.map((result, index) => {
              // const risk = getRiskLevel(result.value);
              // const isHealthy = result.id === "healthy";

              return (
                <div
                  key={result.id}
                  className="flex flex-col justify-between gap-2 rounded-lg border-2 border-gray-200 bg-gray-50/50 p-4 transition-all duration-200 hover:border-gray-200 hover:shadow-sm md:flex-row"
                >
                  {/* Name and Rank Number */}
                  <div className="flex items-center gap-2">
                    <div>
                      <div
                        className="text-light flex h-8 w-8 items-center justify-center rounded-full border-2 border-white font-medium shadow-sm"
                        style={{ backgroundColor: result.color }}
                      >
                        <p>{index + 1}</p>
                      </div>
                    </div>

                    <div className="truncate">
                      <p className="truncate font-semibold text-gray-900">
                        {result.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.count}{" "}
                        {`Banana${result.count !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar and Percentage */}
                  <div className="flex basis-[20%] items-center gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      {result.value}%
                    </p>
                    <Progress value={result.value} className="h-2.5" />
                    <p className="mt-1 hidden text-center text-xs text-gray-500">
                      {result.count} {`Banana${result.count !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary and action section */}
          <div className="mt-6 hidden border-t border-gray-200 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {zeroRiskCount}
                  </span>{" "}
                  diseases detected at 0% risk
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllResults(!showAllResults)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showAllResults ? "Hide Details" : "View All Disease Results"}
                </Button>
              </div>
            </div>

            {/* Additional stats */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-xs font-medium text-green-700">
                    Healthy Samples
                  </p>
                </div>
                <p className="mt-1 text-lg font-bold text-green-800">
                  {data.find((d) => d.id === "healthy")?.count || 0}
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <p className="text-xs font-medium text-amber-700">
                    Diseases Detected
                  </p>
                </div>
                <p className="mt-1 text-lg font-bold text-amber-800">
                  {data.filter((d) => d.value > 0 && d.id !== "healthy").length}
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <p className="text-xs font-medium text-blue-700">
                    Total Analyzed
                  </p>
                </div>
                <p className="mt-1 text-lg font-bold text-blue-800">
                  {data.reduce((sum, d) => sum + d.count, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Expandable detailed results */}
          {showAllResults && (
            <div className="mt-6 hidden border-t border-gray-200 pt-6">
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                <Activity className="h-4 w-4" />
                All Disease Results
              </h4>
              <div className="grid gap-2">
                {data
                  .filter((d) => d.value === 0)
                  .map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between rounded-md border bg-gray-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: result.color }}
                        />
                        <span className="text-sm text-gray-700">
                          {result.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">
                          0%
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-xs text-gray-600"
                        >
                          No Risk
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TopConditions;

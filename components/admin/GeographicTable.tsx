import React from "react";
import { Activity, Table, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GeographicsDataType } from "@/lib/helper";
import { Progress } from "../ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface GeographicTableProps {
  data: GeographicsDataType[];
  colors: Record<string, string>;
}

function GeographicTable({ data, colors }: GeographicTableProps) {
  const getHealthPercentage = (location: any) => {
    return ((location.healthyScans / location.totalScans) * 100).toFixed(1);
  };

  return (
    <Card className="border-2 border-gray-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-primary/30 rounded-lg p-2">
              <Table className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Detailed Location Analytics
                <CheckCircle className="text-primary h-5 w-5" />
              </CardTitle>
              <CardDescription>
                Monthly progression of major diseases
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Total Scans
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Healthy Banana
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Diseased Banana
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Top Disease
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Confidence
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Last Scan
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((location) => {
                const topDisease = location.topDisease;
                const color = topDisease
                  ? colors[topDisease] || "gray"
                  : "gray";

                return (
                  <tr
                    key={location.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {location.location.split(",")[0]}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.location.split(",")[1]}
                      </div>
                    </td>
                    <td className="px-4 py-3">{location.totalScans}</td>
                    {/* Healthy Banana */}
                    <td className="px-4 py-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Progress
                                className="w-[110px] [&>div]:bg-[var(--progress-color)]"
                                value={location.healthPercentage}
                                style={{
                                  ["--progress-color" as any]: "#22b123",
                                }}
                              />
                              <p className="text-sm">
                                {location.healthPercentage}%
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            style={{ backgroundColor: "#22b123" }}
                            arrowStyle={{
                              backgroundColor: "#22b123",
                              fill: "#22b123",
                            }}
                          >
                            <p className="text-light">
                              {location.healthyScans} Healthy Banana
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    {/* Disease Banana */}
                    <td className="px-4 py-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Progress
                                className="w-[110px] [&>div]:bg-[var(--progress-color)]"
                                value={location.diseasedPercentage}
                                style={{
                                  ["--progress-color" as any]: "#F93827",
                                }}
                              />
                              <p className="text-sm">
                                {location.diseasedPercentage}%
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            style={{ backgroundColor: "#F93827" }}
                            arrowStyle={{
                              backgroundColor: "#F93827",
                              fill: "#F93827",
                            }}
                          >
                            <p className="text-light">
                              {location.diseasedScans} Diseased Banana
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="text-light w-fit rounded-lg px-4 py-1 text-center text-sm"
                        style={{ backgroundColor: color }}
                      >
                        {topDisease || "None"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {location.avgConfidence.toFixed(1)}%
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {location.lastScan}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default GeographicTable;

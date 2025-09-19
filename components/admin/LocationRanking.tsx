import React from "react";
import { BarChart3, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GeographicsDataType } from "@/lib/helper";
import { Progress } from "../ui/progress";

interface LocationRankingProps {
  data: GeographicsDataType[];
  colors: Record<string, string>;
}

function LocationRanking({ data, colors }: LocationRankingProps) {
  return (
    <Card className="border-2 border-gray-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-primary/30 rounded-lg p-2">
              <BarChart3 className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Location Ranking
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
        {" "}
        <div className="space-y-4">
          {data
            .sort(
              (a, b) =>
                b.healthyScans / b.totalScans - a.healthyScans / a.totalScans,
            )
            .map((location, index) => {
              const topDisease = location.topDisease;
              const color = topDisease ? colors[topDisease] || "gray" : "gray";

              return (
                <div
                  key={location.id}
                  className="flex items-center justify-between rounded-lg border-2 border-gray-200 p-3"
                >
                  {/* Title and Total Scan */}
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="cursor-pointer text-sm font-medium">
                              {location.location.split(",")[0]}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-primary-var text-light z-[1000]"
                            arrowClassName="bg-primary-var fill-primary-var"
                          >
                            <p className="text-center break-words">
                              {location.displayName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <p className="text-xs text-gray-500">
                        {location.totalScans} scans
                      </p>
                    </div>
                  </div>

                  {/* Top Disease */}
                  <div>
                    <p
                      className="text-light rounded-lg px-4 py-1 text-xs"
                      style={{ backgroundColor: color }}
                    >
                      {topDisease || "Unknown"}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

export default LocationRanking;

"use client";

import React, { useState } from "react";
import { Calendar, MapPin, Eye, Logs, CheckCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ResultModal from "../modals/ResultModal";

import { ScanResultType } from "@/lib/constant";

// Main component
interface RecentActivityProps {
  data: ScanResultType[];
}

function RecentActivity({ data }: RecentActivityProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<ScanResultType | null>(
    null,
  );

  console.log("data", data);

  // Helper Functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // parse ISO string
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString); // parse ISO string
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // ensures AM/PM format
    });
  };

  const truncateLocation = (location: string, maxLength = 10) => {
    return location.length > maxLength
      ? `${location.substring(0, maxLength)}...`
      : location;
  };

  const getResultBadgeVariant = (result: string) => {
    switch (result.toLowerCase()) {
      case "healthy":
        return "secondary";
      case "warning":
        return "outline";
      case "diseased":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <>
      <Card className="border-2 border-gray-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/30 rounded-lg p-2">
              <Logs className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Recent Activity
                <CheckCircle className="text-primary h-5 w-5" />
              </CardTitle>
              <CardDescription>
                Latest scan records and analysis results
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Table Container */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Confidence
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Result
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <TooltipProvider>
                    {data.slice(0, 4).map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors duration-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={item.imgUrl}
                            alt="Field analysis"
                            className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            {formatDate(item.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="mr-2 h-4 w-4 text-gray-400" />
                            {formatTime(item.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex cursor-help items-center text-sm text-gray-900">
                                <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                <span className="truncate">
                                  {truncateLocation(item.address.display_name)}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              className="x-3 bg-primary-var py-2 text-sm whitespace-nowrap text-white shadow-lg"
                              arrowClassName="bg-primary-var fill-primary-var"
                            >
                              <p>{item.address.display_name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <span className="min-w-[3rem] text-sm font-medium text-gray-900">
                              {item.percentage}%
                            </span>
                            <div className="w-20">
                              <Progress
                                className="[&>div]:bg-primary"
                                value={item.percentage}
                                style={{
                                  // dynamically inject the color
                                  ["--progress-color" as any]:
                                    item.resultArr[0].color,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            style={{
                              backgroundColor: item.resultArr[0].color,
                              color: item.resultArr[0].textColor,
                            }}
                          >
                            {item.result}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-primary text-light flex items-center space-x-1 hover:cursor-pointer hover:opacity-70"
                            onClick={() => {
                              setShowModal(true);
                              setSelectedResult(item);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </TooltipProvider>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <ResultModal
        open={showModal}
        onClose={() => setShowModal(false)}
        rankedResults={selectedResult?.resultArr || []}
        previewImg={selectedResult?.imgUrl || null}
      />
    </>
  );
}

export default RecentActivity;

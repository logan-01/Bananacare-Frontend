"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Activity,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Map,
} from "lucide-react";
import Image from "next/image";

import { BananaDiseaseType } from "@/lib/constant";

interface DiseaseStats extends BananaDiseaseType {
  count: number;
  countPercentage: number;
  avgConfidence: number;
  uniqueLocations: number;
}

interface DiseaseCardProps {
  data: DiseaseStats;
}

function DiseaseCard({ data }: DiseaseCardProps) {
  return (
    <Card
      className={`bg-light group border-2 border-gray-200 transition-all duration-150 hover:scale-105`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle
              className="text-primary text-lg font-bold transition-colors group-hover:text-[var(--hover-color)]"
              style={
                {
                  "--hover-color": data.color,
                } as React.CSSProperties
              }
            >
              {data.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600">
              {data.shortDescription}
            </CardDescription>
          </div>

          <div className="flex aspect-square items-center justify-center rounded-full bg-gray-100 p-2">
            <Image
              src={data.iconUrl || ""}
              width={30}
              height={30}
              alt={data.name}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div
              className="text-primary text-2xl font-bold group-hover:text-[var(--hover-color)]"
              style={
                {
                  "--hover-color": data.color,
                } as React.CSSProperties
              }
            >
              {data.count}
            </div>
            <div className="text-xs text-gray-600">Scan Result</div>
          </div>
          <div className="text-center">
            <div
              className="text-primary text-2xl font-bold group-hover:text-[var(--hover-color)]"
              style={
                {
                  "--hover-color": data.color,
                } as React.CSSProperties
              }
            >
              {data.countPercentage}%
            </div>
            <div className="text-xs text-gray-600">Of Total Scans</div>
          </div>
          <div className="text-center">
            <div
              className="text-primary text-2xl font-bold group-hover:text-[var(--hover-color)]"
              style={
                {
                  "--hover-color": data.color,
                } as React.CSSProperties
              }
            >
              {data.avgConfidence}%
            </div>
            <div className="text-xs text-gray-600">Avg. Confidence</div>
          </div>
        </div>

        {/* Treatment Success Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              Average Confidence
            </span>
            <span className="font-bold text-gray-900">
              {data.avgConfidence}%
            </span>
          </div>
          <Progress
            value={data.avgConfidence}
            className="h-2 group-hover:[&>div]:bg-[var(--hover-color)]"
            style={
              {
                "--hover-color": data.color,
              } as React.CSSProperties
            }
          />
        </div>

        {/* Symptoms */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Key Symptoms:</div>
          <div className="flex flex-wrap gap-1">
            {data.symptoms?.slice(0, 3).map((symptom, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-light bg-primary border-none text-xs group-hover:bg-[var(--hover-color)]"
                style={
                  {
                    "--hover-color": data.color,
                  } as React.CSSProperties
                }
              >
                {symptom}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Map className="h-3 w-3" />
            {data.uniqueLocations}{" "}
            {data.uniqueLocations >= 2 ? "locations" : "location"}
          </span>
          {/* <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Peak: {disease.peak_season}
          </span> */}
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {data.severity}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default DiseaseCard;

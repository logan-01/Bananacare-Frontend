"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, CheckCircle } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScanResultType } from "@/lib/constant";

type TrendFilter = "weekly" | "monthly" | "hourly";

interface DiseaseTrendsConfig {
  label: string;
  name: string;
  color: string;
  type: string;
  severity: string;
  count: number;
}

interface DiseaseTrendsProps {
  data: ScanResultType[];
  config: DiseaseTrendsConfig[];
  timeframe: TrendFilter;
  setTimeframe: React.Dispatch<React.SetStateAction<TrendFilter>>;
  disableOptions: Record<TrendFilter, boolean>;
}

function DiseaseTrends({
  data,
  config,
  timeframe,
  setTimeframe,
  disableOptions,
}: DiseaseTrendsProps) {
  return (
    <Card className="border-2 border-gray-300">
      <CardHeader>
        <div className="flex flex-col gap-y-4 md:flex-row">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-primary/30 rounded-lg p-2">
              <LineChart className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Disease Trends Over Time
                <CheckCircle className="text-primary h-5 w-5" />
              </CardTitle>
              <CardDescription>
                Monthly progression of major diseases
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-2 md:ml-28">
            <Select
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as TrendFilter)}
            >
              <SelectTrigger className="bg-primary/20 text-primary w-full border-none py-4 font-medium outline-none">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>

              {/* Match trigger width dynamically */}
              <SelectContent
                className="bg-light border-primary w-[var(--radix-select-trigger-width)]"
                align="end"
                sideOffset={4}
              >
                <SelectItem value="hourly" disabled={disableOptions.hourly}>
                  Hourly
                </SelectItem>
                <SelectItem value="weekly" disabled={disableOptions.weekly}>
                  Weekly
                </SelectItem>
                <SelectItem value="monthly" disabled={disableOptions.monthly}>
                  Monthly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey={
                  timeframe.endsWith("ly") ? timeframe.slice(0, -2) : timeframe
                }
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  value,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />
              {config.map((item, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={item.label}
                  stroke={item.color}
                  strokeWidth={3}
                  dot={{ fill: item.color, r: 4 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-1 flex-wrap items-center justify-center gap-8">
          {config.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
              </span>
              <span className="text-xs text-gray-400">({item.count})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DiseaseTrends;

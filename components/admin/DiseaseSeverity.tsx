"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BarChart3, CheckCircle } from "lucide-react";
import {
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

import { SeverityDistributionType } from "@/lib/helper";

interface DiseaseSeverityProps {
  data: SeverityDistributionType[];
}

function DiseaseSeverity({ data }: DiseaseSeverityProps) {
  console.log("Severity", data);

  return (
    <Card className="border-2 border-gray-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/30 rounded-lg p-2">
            <BarChart3 className="text-primary h-6 w-6" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              Disease Severity Analysis
              <CheckCircle className="text-primary h-5 w-5" />
            </CardTitle>
            <CardDescription>Distribution by severity levels</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  // innerRadius={60}
                  dataKey="count"
                  labelLine={false} // remove connecting line
                  label={({ cx, cy, midAngle, outerRadius, payload }) => {
                    if (payload.count === 0) return null; // skip zero-count slices

                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 20; // distance from pie
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#333"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {payload.severity} ({payload.count})
                      </text>
                    );
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value}`,
                    props.payload.severity,
                  ]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 place-items-center gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.severity}</span>
                <span className="text-xs text-gray-400">({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DiseaseSeverity;

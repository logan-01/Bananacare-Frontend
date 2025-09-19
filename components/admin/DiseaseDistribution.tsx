import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartPie, CheckCircle } from "lucide-react";
import { ChartTooltip } from "../ui/chart";

type DiseaseDistributionType = {
  id?: string;
  name: string;
  value: number;
  count: number;
  color?: string;
};

interface DiseaseDistributionProps {
  data: DiseaseDistributionType[];
}

function DiseaseDistribution({ data }: DiseaseDistributionProps) {
  return (
    <Card className="flex-1 border-2 border-gray-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/30 rounded-lg p-2">
            <ChartPie className="text-primary h-6 w-6" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              Disease Distribution
              <CheckCircle className="text-primary h-5 w-5" />
            </CardTitle>
            <CardDescription>
              Daily scanning activity over the past week
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                dataKey="value"
                // label={({ name, percent }) =>
                //   `${name.replace(/\b(Banana|Disease)\b/g, "").trim()}`
                // }
                labelLine={false}
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
                      {payload.name}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, entry) => [
                  `${Number(value).toFixed(1)}%`,
                  entry.payload.name
                    .replace(/\b(Banana|Disease)\b/g, "")
                    .trim(),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.name.replace(/\b(Banana|Disease)\b/g, "").trim()}
              </span>
              <span className="text-xs text-gray-400">({item.count})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DiseaseDistribution;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle, ChartLine } from "lucide-react";

type ScanTrendConfig = {
  color: string;
  label: string;
  count: number;
};

type WeeklyTrend = {
  day: string;
  scans: number;
  healthy: number;
  diseased: number;
};

interface ScanTrendsProps {
  data: WeeklyTrend[];
  config: ScanTrendConfig[];
}

function ScanTrends({ data, config }: ScanTrendsProps) {
  return (
    <Card className="flex-1 border-2 border-gray-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/30 rounded-lg p-2">
            <ChartLine className="text-primary h-6 w-6" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              Scan Trends Over Time
              <CheckCircle className="text-primary h-5 w-5" />
            </CardTitle>
            <CardDescription>
              Daily scanning activity over the past week
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex grow-1 flex-col">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
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
                  dataKey={item.label.toLowerCase()} // make sure keys match your data
                  stroke={item.color}
                  strokeWidth={3}
                  dot={{ fill: item.color, strokeWidth: 2, r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-1 items-center justify-center gap-8">
          {config.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-xs text-gray-400">({item.count})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ScanTrends;

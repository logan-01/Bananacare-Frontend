"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// const chartData = [
//   {
//     key: "Alacadesma",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },

//   {
//     key: "Bato",
//     "black-sigatoka": 23,
//     cordana: 45,
//     "bract-mosaic-virus": 120,
//     moko: 43,
//     panama: 23,
//     weevil: 90,
//   },

//   {
//     key: "Conrazon",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },

//   {
//     key: "Malo",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },
//   {
//     key: "Manihala",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },
//   {
//     key: "Pag-asa",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },

//   {
//     key: "Poblacion",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },

//   {
//     key: "Proper Bansud",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },

//   {
//     key: "Rosacara",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },
//   {
//     key: "Salcedo",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },
//   {
//     key: "Sumagui",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },

//   {
//     key: "Proper Tiguisan",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },

//   {
//     key: "Villa Pag-asa",
//     "black-sigatoka": 186,
//     cordana: 80,
//     "bract-mosaic-virus": 90,
//     moko: 10,
//     panama: 40,
//     weevil: 40,
//   },
// ];

const chartConfig = {
  key: {
    label: "Alcadesma",
  },
  "black-sigatoka": {
    label: "Black Sigatoka",
  },
  cordana: {
    label: "Cordana",
  },
  "bract-mosaic-virus": {
    label: "Bract Mosaic Virus",
  },
  moko: {
    label: "Moko",
  },
  panama: {
    label: "Panama",
  },
  weevil: {
    label: "Weevil",
  },
  healthy: {
    label: "Healthy",
  },
} satisfies ChartConfig;

type ChartDataItem = {
  key: string;
  "black-sigatoka": number;
  cordana: number;
  "bract-mosaic-virus": number;
  moko: number;
  panama: number;
  weevil: number;
  healthy?: number;
};

export default function Admin_StackBarChart({
  chartData,
}: {
  chartData: ChartDataItem[];
}) {
  return (
    <Card className="bg-light flex-1 rounded-md border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-clash-grotesk text-lg font-medium">
          Banana Disease Count in each Barangay
        </CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const maxLength = 3;
                return value.length > maxLength
                  ? value.slice(0, maxLength) + "..."
                  : value;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="bg-light text-dark border-none"
                  // hideLabel
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="weevil"
              stackId="a"
              fill="var(--color-weevil)"
              radius={[0, 0, 4, 4]}
            />

            <Bar
              dataKey="panama"
              stackId="a"
              fill="var(--color-panama)"
              radius={[0, 0, 0, 0]}
            />

            <Bar
              dataKey="moko"
              stackId="a"
              fill="var(--color-moko)"
              radius={[0, 0, 0, 0]}
            />

            <Bar
              dataKey="cordana"
              stackId="a"
              fill="var(--color-cordana)"
              radius={[0, 0, 0, 0]}
            />

            <Bar
              dataKey="black-sigatoka"
              stackId="a"
              fill="var(--color-black-sigatoka)"
              radius={[0, 0, 0, 0]}
            />

            <Bar
              dataKey="bract-mosaic-virus"
              stackId="a"
              fill="var(--color-bmv)"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="healthy"
              stackId="a"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}

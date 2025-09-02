// lib/fetchDashboardData.ts

import prisma from "@/lib/prisma";

async function getDiseaseCount(key: string) {
  return prisma.scanResult.count({ where: { result: key } });
}

async function getResultPercentage(key: string): Promise<string> {
  const total = await prisma.scanResult.count();
  if (total === 0) return "0.00%";
  const count = await prisma.scanResult.count({ where: { result: key } });
  return `${((count / total) * 100).toFixed(2)}%`;
}

async function getScanResults() {
  return prisma.scanResult.findMany({
    select: {
      createdAt: true,
      address: true,
      percentage: true,
      result: true,
      resultArr: true,
      imgUrl: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getStackedChartData() {
  const grouped = await prisma.scanResult.groupBy({
    by: ["address", "result"],
    _count: { result: true },
  });

  const barangayMap: Record<string, any> = {};
  grouped.forEach(({ address, result, _count }) => {
    if (!barangayMap[address]) {
      barangayMap[address] = {
        key: address,
        "black-sigatoka": 0,
        cordana: 0,
        "bract-mosaic-virus": 0,
        moko: 0,
        panama: 0,
        weevil: 0,
        healthy: 0,
      };
    }

    const resultKey = result === "bmv" ? "bract-mosaic-virus" : result;
    barangayMap[address][resultKey] = _count.result;
  });

  return Object.values(barangayMap);
}

export async function fetchDashboardData() {
  const diseases = [
    "black-sigatoka",
    "cordana",
    "bmv",
    "moko",
    "panama",
    "weevil",
    "healthy",
  ];

  const [scanResults, stackedChartData, totalScanCount, ...diseaseData] =
    await Promise.all([
      getScanResults(),
      getStackedChartData(),
      prisma.scanResult.count(),
      ...diseases.map(getDiseaseCount),
      ...diseases.map(getResultPercentage),
    ]);

  const diseaseCounts = diseaseData.slice(0, diseases.length) as number[];
  const diseasePercents = diseaseData.slice(diseases.length) as string[];

  const diseaseStats = diseases.map((key, i) => ({
    key,
    count: diseaseCounts[i],
    percent: diseasePercents[i],
  }));

  return {
    scanResults,
    stackedChartData,
    totalScanCount,
    diseaseStats,
  };
}

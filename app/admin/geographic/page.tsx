"use client";

import React, { useState, useMemo } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import GeographicsMap from "@/components/admin/GeographicsMap";
import LocationRanking from "@/components/admin/LocationRanking";
import GeographicTable from "@/components/admin/GeographicTable";

import { getGeographicsData } from "@/lib/helper";
import useScanResult from "@/hooks/useScanResult";
import { bananaDiseases } from "@/lib/constant";
import { GeographicsDataType } from "@/lib/helper";

const GeographicInsights = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedDisease, setSelectedDisease] = useState("bmv");
  const [mapView, setMapView] = useState("density");

  //Contants
  const diseaseTypes = bananaDiseases
    .filter(
      (disease) => disease.id !== "not-banana" && disease.id !== "healthy",
    )
    .map((disease) => disease.id);

  const diseaseColors = bananaDiseases.reduce<Record<string, string>>(
    (acc, d) => {
      if (d.id !== "healthy" && d.id !== "not-banana") {
        acc[d.id] = d.color;
      }
      return acc;
    },
    {},
  );

  //Geographics Data
  const scanResult = useScanResult();
  const geographicsData = getGeographicsData(scanResult);

  const filteredData = useMemo(() => {
    return geographicsData.filter((location: GeographicsDataType) => {
      if (selectedDisease === "all") return true;
      return (location.diseases[selectedDisease?.toLowerCase()] ?? 0) > 0;
    });
  }, [geographicsData, selectedDisease]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <p className="font-clash-grotesk text-2xl font-semibold">
            Geographic Insights
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mb-10 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Interactive Map */}
          <GeographicsMap
            data={geographicsData}
            colors={diseaseColors}
            type={diseaseTypes}
          />

          {/* Location Rankings */}
          <LocationRanking data={filteredData} colors={diseaseColors} />
        </div>

        {/* Detailed Location Statistics */}
        <GeographicTable data={filteredData} colors={diseaseColors} />
      </div>
    </div>
  );
};

export default GeographicInsights;

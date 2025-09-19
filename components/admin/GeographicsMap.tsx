"use client";

import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";
import {
  MapPin,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Clock,
  Target,
  AlertTriangle,
  Shield,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GeographicsDataType } from "@/lib/helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../ui/select";

export interface GeographicsMapProps {
  data: GeographicsDataType[];
  colors: Record<string, string>;
  type: string[];
}

function GeographicsMap({ data, colors, type }: GeographicsMapProps) {
  const [selectedDisease, setSelectedDisease] = useState("all");
  const [legendVisible, setLegendVisible] = useState(true);
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [visibleDiseases, setVisibleDiseases] = useState<
    Record<string, boolean>
  >(
    Object.keys(colors).reduce(
      (acc, disease) => ({ ...acc, [disease]: true }),
      {},
    ),
  );

  const filteredData = useMemo(() => {
    return data.filter((location) => {
      // First filter by selected disease
      if (selectedDisease !== "all") {
        const hasSelectedDisease =
          (location.diseases[selectedDisease?.toLowerCase()] ?? 0) > 0;
        if (!hasSelectedDisease) return false;
      }

      // Then filter by visible diseases
      const topDisease = location.topDisease;
      if (topDisease && !visibleDiseases[topDisease]) {
        return false;
      }

      return true;
    });
  }, [data, selectedDisease, visibleDiseases]);

  // Toggle visibility of a specific disease
  const toggleDiseaseVisibility = (disease: string) => {
    setVisibleDiseases((prev) => ({
      ...prev,
      [disease]: !prev[disease],
    }));
  };

  // Custom Marker
  const customMarker = (color: string = "red") =>
    divIcon({
      className: "",
      html: renderToString(
        <div className="relative flex items-center justify-center">
          {/* Outer pulse ring - centered */}
          <div
            className="absolute h-10 w-10 animate-ping rounded-full opacity-10"
            style={{ backgroundColor: color }}
          ></div>

          {/* Inner pulse ring - centered */}
          <div
            className="absolute h-8 w-8 animate-pulse rounded-full opacity-20"
            style={{ backgroundColor: color }}
          ></div>

          {/* Main marker container - centered */}
          <div className="flex h-6 w-6 items-center justify-center rounded-full shadow-sm">
            <FaMapMarkerAlt size={16} style={{ color }} />
          </div>
        </div>,
      ),
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });

  const activeColors = Object.entries(colors).filter(([key, value]) => value);

  return (
    <Card className="border-2 border-gray-300 lg:col-span-2">
      <CardHeader>
        <div className="flex flex-col gap-y-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="bg-primary/30 rounded-lg p-2">
              <MapPin className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Geographic Distribution
                <CheckCircle className="text-primary h-5 w-5" />
              </CardTitle>
              <CardDescription>
                Real-time disease monitoring across
              </CardDescription>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-1 items-center gap-2 md:ml-28">
            {/* Disease Filter */}
            <Select value={selectedDisease} onValueChange={setSelectedDisease}>
              <SelectTrigger className="bg-primary/20 text-primary w-full border-none px-2 py-4 font-medium outline-none">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>

              {/* Match trigger width dynamically */}
              <SelectContent
                className="bg-light border-primary z-[1000] w-[var(--radix-select-trigger-width)]"
                align="end"
                sideOffset={4}
              >
                <SelectItem value="all">All Disease</SelectItem>
                {type.map((disease, index) => (
                  <SelectItem key={index} value={disease}>
                    {disease
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Container */}
        <div className="relative z-20 h-[400px] overflow-hidden rounded-lg border border-gray-200">
          <MapContainer
            center={[13.1, 121.1]}
            zoom={9}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
              maxZoom={19}
            />

            {filteredData.map((location) => {
              const topDisease = location.topDisease;
              const color = topDisease ? colors[topDisease] || "gray" : "gray";

              return (
                <Marker
                  key={location.id}
                  position={[
                    location.coordinates.lat,
                    location.coordinates.lng,
                  ]}
                  icon={customMarker(color)}
                >
                  <Popup minWidth={220} maxWidth={500}>
                    <div className="flex flex-col gap-2">
                      {/* Compact Header */}
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <h3
                          className="text-sm font-semibold text-gray-800"
                          style={{ color: color }}
                        >
                          {location.location}
                        </h3>
                      </div>

                      {/* Compact Stats Grid */}

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div
                          className="bg-primary/10 text-primary rounded-md border border-gray-200 font-medium"
                          style={{
                            backgroundColor: `${color}10`,
                            color: color,
                          }}
                        >
                          <p>Total: {location.totalScans}</p>
                        </div>
                        <div
                          className="bg-primary/10 text-primary rounded-md border border-gray-200 font-medium"
                          style={{
                            backgroundColor: `${color}10`,
                            color: color,
                          }}
                        >
                          <p className="">
                            Confidence: {location.avgConfidence}%
                          </p>
                        </div>
                        <div
                          className="bg-primary/10 text-primary flex-1 rounded-md border border-gray-200 font-medium"
                          style={{
                            backgroundColor: `${color}10`,
                            color: color,
                          }}
                        >
                          <p>Healthy: {location.healthyScans}</p>
                        </div>

                        <div
                          className="bg-danger/10 text-danger flex-1 rounded-md border border-gray-200 font-medium"
                          style={{
                            backgroundColor: `${color}10`,
                            color: color,
                          }}
                        >
                          <p>Disease: {location.diseasedScans}</p>
                        </div>
                      </div>

                      {/* Top Disease */}
                      {topDisease && (
                        <div
                          className="rounded-md border border-gray-200 px-2 py-0.5 text-center font-medium"
                          style={{
                            backgroundColor: `${color}10`,
                            color: color,
                          }}
                        >
                          <p>
                            Top Disease:{" "}
                            {topDisease.replace("-", " ").toUpperCase()}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="border-t border-gray-100 pt-1 text-center text-xs text-gray-500">
                        Last scan:{" "}
                        <span className="font-medium">{location.lastScan}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Enhanced Legend */}
          <div
            className="absolute right-2 bottom-2 z-[800] min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg hover:cursor-pointer"
            onClick={() => setLegendCollapsed(!legendCollapsed)}
          >
            {/* Legend Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Disease Color Code
              </h3>
              <div className="flex items-center gap-1">
                <button
                  className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  title={legendCollapsed ? "Expand" : "Collapse"}
                >
                  {legendCollapsed ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Legend Content */}
            {!legendCollapsed && (
              <div className="p-3">
                {/* Disease List */}
                <div className="grid grid-cols-2">
                  {activeColors.map(([disease, color]) => {
                    const isVisible = visibleDiseases[disease];
                    const diseaseCount = data.filter(
                      (location) => location.topDisease === disease,
                    ).length;

                    return (
                      <div
                        key={disease}
                        className={`flex items-center justify-between rounded-md p-2 transition-all duration-200`}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleDiseaseVisibility(disease)}
                            className="flex items-center gap-2 focus:outline-none"
                          >
                            <div
                              className={`h-3 w-3 rounded-full border-2 transition-all duration-200 ${
                                isVisible
                                  ? "border-transparent"
                                  : "border-gray-400 bg-white"
                              }`}
                              style={{
                                backgroundColor: isVisible
                                  ? color
                                  : "transparent",
                              }}
                            />
                            <span
                              className={`text-xs capitalize ${isVisible ? "text-gray-800" : "text-gray-500"}`}
                            >
                              {disease.replace("-", " ")}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Filter Info */}
                {selectedDisease !== "all" && (
                  <div className="mt-3 rounded-md bg-blue-50 p-2">
                    <p className="text-xs text-blue-700">
                      📌 Filtered by:{" "}
                      <span className="font-medium">{selectedDisease}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default GeographicsMap;

import {
  bananaDiseases,
  BananaDiseaseType,
  isNative,
  ScanResultType,
  severityColors,
} from "./constant";

//* Interfaces and Types
interface ScanPayload {
  percentage: number;
  resultArr: any[];
  result: string | number;
  imgUrl: string;
  address: string;
}

//* API Endpoints
// const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API;

const apiBaseUrl = isNative
  ? "http://192.168.1.205:5000"
  : "http://localhost:5000";

// const apiBaseUrl = "/api";
const osmBaseUrl = "https://nominatim.openstreetmap.org/reverse";
const hfBaseUrl = "https://api-inference.huggingface.co/models";

//* User Helper Functions
export async function getReverseGeocode(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `${osmBaseUrl}?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "User-Agent": "Bananacare/1.0", // Recommended by Nominatim
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // contains address info, display_name, etc.
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
}

// Cloudinary API - Image Upload + Image Public Url
export async function getImageUrl(formData: FormData) {
  try {
    const res = await fetch(`${apiBaseUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Image upload failed: ${res.statusText}`);
    } else {
      console.log("Image Public Url succesfully get");
    }

    const data = await res.json();
    return data.publicUrl as string;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

export async function sendScanResult(payload: ScanPayload) {
  try {
    const response = await fetch(`${apiBaseUrl}/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to save scan data: ${response.statusText}`);
    } else {
      console.log("Scan Result sucessfully saved");
    }

    return await response.json(); // optional: return server response
  } catch (error) {
    console.error("Save scan error:", error);
    return null;
  }
}

export async function getIsBanana(file: File) {
  try {
    if (!file) throw new Error("No file provided");

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Call Hugging Face API
    const response = await fetch(`${hfBaseUrl}/google/vit-base-patch16-224`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `data:image/jpeg;base64,${base64Image}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Check if banana is detected
    const isBanana = result.some(
      (p: { label: string; score: number }) =>
        p.label.toLowerCase() === "banana",
    );

    return { isBanana, predictions: result };
  } catch (error) {
    console.error("Error checking banana:", error);
    return { isBanana: false, predictions: [] };
  }
}

//*------------------------------------------------------------------------------------*//

//* Admin Helper Functions
function formatReadableDate(date: Date | null): string {
  if (!date) return "No scans yet";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export async function getScanResult(): Promise<ScanResultType[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/scan`);
    if (!response.ok) {
      throw new Error("Failed to fetch scans");
    }

    const json = await response.json();

    // API shape has { success: true, data: [...] }
    return json.data || [];
  } catch (error) {
    console.error("Error fetching scans:", error);
    return [];
  }
}

export async function deleteScanResult(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiBaseUrl}/scan/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete scan result: ${response.statusText}`);
    }

    const json = await response.json();

    // API returns { success: true, message: "...", deletedId: "..." }
    return json.success || false;
  } catch (error) {
    console.error("Error deleting scan result:", error);
    return false;
  }
}

export function getScanStat(scans: ScanResultType[]) {
  const totalScans = scans.length;
  const totalHealthy = scans.filter((scan) => scan.result === "healthy").length;
  const totalDiseased = scans.filter(
    (scan) => scan.result !== "healthy",
  ).length;

  const uniqueLocations = new Set(
    scans.map(
      (scan) =>
        `${scan.address.address.village}-${scan.address.address.road}-${scan.address.address.state}`,
    ),
  ).size;

  // ✅ Get the latest scan date
  const latestScanDate = scans.length
    ? new Date(
        Math.max(...scans.map((scan) => new Date(scan.createdAt).getTime())),
      )
    : null;

  return {
    totalScans,
    totalHealthy,
    totalDiseased,
    totalLocations: uniqueLocations,
    latestScanDate: formatReadableDate(latestScanDate),
  };
}

export function getWeeklyTrends(scans: ScanResultType[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ✅ Find the latest scan date
  const latestDate = scans.length
    ? new Date(
        Math.max(...scans.map((scan) => new Date(scan.createdAt).getTime())),
      )
    : null;

  if (!latestDate) {
    return {
      weeklyTrends: [],
      totalScans: 0,
      totalHealthy: 0,
      totalDiseased: 0,
    };
  }

  // ✅ Get the last 7 days range
  const startDate = new Date(latestDate);
  startDate.setDate(latestDate.getDate() - 6); // rolling 7-day window

  // Initialize last 7 days
  const weeklyTrends: {
    day: string;
    scans: number;
    healthy: number;
    diseased: number;
  }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    weeklyTrends.push({
      day: days[d.getDay()],
      scans: 0,
      healthy: 0,
      diseased: 0,
    });
  }

  // Totals
  let weeklyTotalScans = 0;
  let weeklyTotalHealthy = 0;
  let weeklyTotalDiseased = 0;

  // ✅ Aggregate scans within the window
  scans.forEach((scan) => {
    const scanDate = new Date(scan.createdAt);
    if (scanDate >= startDate && scanDate <= latestDate) {
      const dayName = days[scanDate.getDay()];
      const dayEntry = weeklyTrends.find((entry) => entry.day === dayName);

      if (dayEntry) {
        dayEntry.scans += 1;
        if (scan.result === "healthy") {
          dayEntry.healthy += 1;
          weeklyTotalHealthy += 1;
        } else {
          dayEntry.diseased += 1;
          weeklyTotalDiseased += 1;
        }
        weeklyTotalScans += 1;
      }
    }
  });

  return {
    weeklyTrends,
    weeklyTotalScans,
    weeklyTotalHealthy,
    weeklyTotalDiseased,
  };
}

export function getDiseaseDistribution(scans: ScanResultType[]) {
  const filteredBananaDisease = bananaDiseases.filter(
    (disease) => disease.id !== "not-banana",
  );

  const totalScans = scans.length || 1; // avoid divide by zero

  // Count by disease type
  const counts: Record<string, number> = {};
  scans.forEach((scan) => {
    counts[scan.result] = (counts[scan.result] || 0) + 1;
  });

  // Map to structured output
  const distribution = filteredBananaDisease.map((disease) => {
    const count = counts[disease.id] || 0;
    const value = (count / totalScans) * 100;
    return {
      id: disease.id,
      name: disease.name,
      value: Number(value.toFixed(1)), // 1 decimal
      count,
      color: disease.color,
    };
  });

  return distribution;
}

export function getDiseaseStat(scans: ScanResultType[]) {
  const filteredBananaDisease = bananaDiseases.filter(
    (disease) => disease.id !== "not-banana" && disease.id !== "healthy",
  );

  const totalScans = scans.length || 1; // avoid divide by zero

  // Count by disease type
  const counts: Record<string, number> = {};
  scans.forEach((scan) => {
    counts[scan.result] = (counts[scan.result] || 0) + 1;
  });

  // Track confidence sums and counts
  const confidenceSum: Record<string, number> = {};
  const confidenceCount: Record<string, number> = {};

  // Track unique locations
  const diseaseLocations: Record<string, Set<string>> = {};

  scans.forEach((scan) => {
    // Confidence
    confidenceSum[scan.result] =
      (confidenceSum[scan.result] || 0) + scan.percentage;
    confidenceCount[scan.result] = (confidenceCount[scan.result] || 0) + 1;

    // Locations
    if (!diseaseLocations[scan.result]) {
      diseaseLocations[scan.result] = new Set();
    }
    if (scan.address) {
      // Use a unique string representation for the address, e.g. village-road-state
      const addr = scan.address.address;
      const locationKey = `${addr.village || ""}-${addr.road || ""}-${addr.state || ""}`;
      diseaseLocations[scan.result].add(locationKey);
    }
  });

  // Calculate average confidence
  const avgConfidence: Record<string, number> = {};
  for (const disease in confidenceSum) {
    avgConfidence[disease] = confidenceSum[disease] / confidenceCount[disease];
  }

  // Map to structured output
  const distribution = filteredBananaDisease.map((disease) => {
    const count = counts[disease.id] || 0;
    const countPercentage = (count / totalScans) * 100;
    const finalAvgConfidence = avgConfidence[disease.id] || 0;
    const uniqueLocations = diseaseLocations[disease.id]?.size || 0; // number of distinct locations

    return {
      ...disease,
      count,
      countPercentage: Number(countPercentage.toFixed(1)),
      avgConfidence: finalAvgConfidence,
      uniqueLocations, // <-- added
    };
  });

  return distribution;
}

type TrendFilter = "weekly" | "monthly" | "hourly";

export function getDiseaseTrends(
  data: ScanResultType[],
  filter: TrendFilter = "weekly",
) {
  const DISEASE_KEYS = bananaDiseases
    .filter(
      (disease) => disease.id !== "healthy" && disease.id !== "not-banana",
    )
    .map((disease) => disease.id);

  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((scan) => {
    const date = new Date(scan.createdAt);
    let groupKey = "";

    if (filter === "monthly") {
      groupKey = date.toLocaleString("en-US", { month: "short" });
    } else if (filter === "weekly") {
      groupKey = date.toLocaleString("en-US", { weekday: "short" });
    } else if (filter === "hourly") {
      groupKey = date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
      });
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = {};
      DISEASE_KEYS.forEach((key) => (grouped[groupKey][key] = 0));
    }

    const diseaseId = scan.result;
    if (DISEASE_KEYS.includes(diseaseId)) {
      grouped[groupKey][diseaseId] += 1;
    }
  });

  const formatted = Object.entries(grouped).map(([period, diseaseCounts]) => ({
    [filter === "hourly" ? "hour" : filter === "weekly" ? "week" : "month"]:
      period,
    ...diseaseCounts,
  }));

  return {
    data: formatted,
    uniquePeriods: Object.keys(grouped).length, // how many distinct categories
  };
}

export function getDiseaseTrendsConfig(
  data: ScanResultType[],
  filter: TrendFilter = "weekly",
) {
  // ✅ Always include all diseases except healthy and not-banana
  const DISEASES = bananaDiseases.filter(
    (disease) => disease.id !== "healthy" && disease.id !== "not-banana",
  );

  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((scan) => {
    const date = new Date(scan.createdAt);
    let groupKey = "";

    if (filter === "monthly") {
      groupKey = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
    } else if (filter === "weekly") {
      const onejan = new Date(date.getFullYear(), 0, 1);
      const week = Math.ceil(
        ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) /
          7,
      );
      groupKey = `W${week}-${date.getFullYear()}`;
    } else if (filter === "hourly") {
      groupKey = `${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} ${date.getHours()}:00`;
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = {};
    }

    const diseaseId = scan.result;
    if (DISEASES.some((d) => d.id === diseaseId)) {
      grouped[groupKey][diseaseId] = (grouped[groupKey][diseaseId] || 0) + 1;
    }
  });

  // 🔹 Get the latest period (hour/week/month)
  const latestKey = Object.keys(grouped).sort().pop();
  const latestData = latestKey ? grouped[latestKey] : {};

  // 🔹 Build config with ALL diseases, defaulting to 0 if missing
  const config = DISEASES.map((disease) => {
    const count = latestData[disease.id] || 0;
    return {
      label: disease.id,
      name: disease.name,
      color: disease.color,
      type: disease.type || "Unknown",
      severity: disease.severity || "None",
      count,
    };
  });

  return config;
}

export interface SeverityDistributionType {
  severity: string;
  count: number;
  percentage: number;
  color: string;
}

const allSeverities = ["Critical", "High", "Medium", "Low"];

export function getSeverityDistribution(data: ScanResultType[]) {
  const filteredData = data.filter(
    (scan) => scan.result !== "not-banana" && scan.result !== "healthy",
  );

  // Count occurrences
  const counts: Record<string, number> = {};
  filteredData.forEach((scan) => {
    const diseaseId = scan.result;
    if (diseaseId === "healthy" || diseaseId === "not-banana") return;

    const diseaseMeta = scan.resultArr.find((d) => d.id === diseaseId);
    const severity = diseaseMeta?.severity || "None";

    counts[severity] = (counts[severity] || 0) + 1;
  });

  const total = Object.values(counts).reduce((sum, c) => sum + c, 0);

  // Ensure all severities are present
  const distribution = allSeverities.map((severity) => {
    const count = counts[severity] || 0;
    return {
      severity,
      count,
      percentage: total ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
      color: severityColors[severity] || "#6b7280",
    };
  });

  return distribution;
}

export interface GeographicsDataType {
  id: number;
  location: string;
  displayName: string;
  coordinates: { lat: number; lng: number };
  totalScans: number;
  healthyScans: number;
  diseasedScans: number;
  diseases: Record<string, number>;
  avgConfidence: number;
  lastScan: string;
  healthPercentage: number; // 👈 added
  diseasedPercentage: number;
  topDisease: string | null; // 👈 added
}

export function getGeographicsData(
  scans: ScanResultType[],
): GeographicsDataType[] {
  const grouped = new Map<string, ScanResultType[]>();

  scans.forEach((scan) => {
    const { address } = scan;
    const location =
      address?.address?.village ||
      address?.address?.state ||
      address?.address?.region ||
      address?.display_name;

    if (!location) return;
    if (!grouped.has(location)) grouped.set(location, []);
    grouped.get(location)!.push(scan);
  });

  let idCounter = 1;
  const geoData: GeographicsDataType[] = [];

  grouped.forEach((scanList, location) => {
    const first = scanList[0];
    const lat = Number(first.address.lat);
    const lng = Number(first.address.lon);
    const displayName = first.address.display_name;

    const totalScans = scanList.length;
    let healthyScans = 0;
    let diseasedScans = 0;
    let confidenceSum = 0;
    let lastScan = "";

    const diseases: Record<string, number> = {};

    scanList.forEach((scan) => {
      confidenceSum += scan.percentage;

      if (!lastScan || new Date(scan.createdAt) > new Date(lastScan)) {
        lastScan = scan.createdAt;
      }

      if (scan.result === "healthy") {
        healthyScans++;
      } else {
        diseasedScans++;
        diseases[scan.result] = (diseases[scan.result] || 0) + 1;
      }
    });

    const avgConfidence = confidenceSum / totalScans;

    // 👇 Health percentage
    const healthPercentage = Number(
      ((healthyScans / totalScans) * 100).toFixed(1),
    );

    // 👇 Health percentage
    const diseasedPercentage = Number(
      ((diseasedScans / totalScans) * 100).toFixed(1),
    );

    // 👇 Top disease
    const diseaseEntries = Object.entries(diseases).filter(
      ([id]) => id !== "healthy" && id !== "not-banana",
    );

    let topDisease: string | null = null;
    if (diseaseEntries.length > 0) {
      const [dominantDisease] = diseaseEntries.sort(([, a], [, b]) => b - a);
      topDisease = dominantDisease[0];
    }

    geoData.push({
      id: idCounter++,
      location,
      displayName,
      coordinates: { lat, lng },
      totalScans,
      healthyScans,
      diseasedScans,
      diseases,
      avgConfidence: Number(avgConfidence.toFixed(1)),
      lastScan: lastScan.split("T")[0],
      healthPercentage,
      diseasedPercentage,
      topDisease,
    });
  });

  return geoData;
}

export type PriorityLabel = "low" | "medium" | "high";
export type StatusLabel = "read" | "unread" | "replied";

export interface InquiryMessageType {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  priority: PriorityLabel;
  status?: StatusLabel;
  replied?: boolean;
  reply?: string;
  repliedAt?: string; // ISO string
  createdAt?: string; // ISO string
}

export const sendInquiry = async (payload: InquiryMessageType) => {
  try {
    const response = await fetch(`${apiBaseUrl}/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to send message" };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending inquiry message:", err);
    return { success: false, error: "Network error" };
  }
};

export interface PriorityResult {
  sequence: string;
  labels: PriorityLabel[];
  scores: number[];
}

export async function getPriorityType(inputText: string) {
  const response = await fetch(`${hfBaseUrl}/facebook/bart-large-mnli`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: inputText,
      parameters: {
        candidate_labels: ["low", "medium", "high"],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Getting Priory Type Error - Status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

export async function getInquiries() {
  try {
    const response = await fetch(`${apiBaseUrl}/inquiries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inquiries: ${response.statusText}`);
    }

    const result = await response.json();

    return result.data as InquiryMessageType[];
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    throw error;
  }
}

export async function updateInquiry(
  id: string,
  data: {
    status?: string;
    replied?: boolean;
    reply?: string;
  },
) {
  if (!id || id === "defaultId" || id === "id_01") {
    throw new Error("Invalid ID provided");
  }

  try {
    console.log(`Making PATCH request to: ${apiBaseUrl}/inquiries/${id}`);
    console.log("Request data:", data);

    const res = await fetch(`${apiBaseUrl}/inquiries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);

      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage =
          errorJson.error || errorJson.message || "Failed to update inquiry";
      } catch {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }

      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log("Update successful:", result);
    return result;
  } catch (err: any) {
    console.error("updateInquiry error:", err);

    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }

    throw err;
  }
}

export async function deleteInquiry(id: string) {
  if (!id || id === "defaultId" || id === "id_01") {
    throw new Error("Invalid ID provided");
  }

  try {
    console.log(`Making DELETE request to: ${apiBaseUrl}/inquiries/${id}`);

    const res = await fetch(`${apiBaseUrl}/inquiries/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Delete response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete error response:", errorText);

      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage =
          errorJson.error || errorJson.message || "Failed to delete inquiry";
      } catch {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }

      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log("Delete successful:", result);
    return result;
  } catch (err: any) {
    console.error("deleteInquiry error:", err);

    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }

    throw err;
  }
}

//Inquiries Utility Functions
export const getStatusColor = (status: string = "unread") => {
  const colors = {
    unread: "#f97a00",
    read: "#154D71",
    replied: "#22b123",
  };
  return colors[status as keyof typeof colors] || "#26333a";
};

export const getPriorityColor = (priority: string = "low") => {
  const colors = {
    high: "#f93827",
    medium: "#feba17",
    low: "#187498",
  };
  return colors[priority as keyof typeof colors] || "#187498";
};

export const formatDate = (isoDate: string = "") => {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", " -")
    .toLowerCase();
};

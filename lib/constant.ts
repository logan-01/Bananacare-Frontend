import {
  MdZoomOutMap,
  MdRotate90DegreesCcw,
  MdZoomIn,
  MdBrightness5,
} from "react-icons/md";
import { TfiArrowsHorizontal, TfiArrowsVertical } from "react-icons/tfi";
import { PiParallelogramThin, PiFlipHorizontalLight } from "react-icons/pi";
import { IconType } from "react-icons/lib";
import { Capacitor } from "@capacitor/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export const isNative = Capacitor.isNativePlatform();
// export const isNative = false;

export interface BananaDiseaseType {
  id: string;
  name: string;
  type?:
    | "Normal"
    | "Fungal"
    | "Viral"
    | "Bacterial"
    | "Pest"
    | "Healthy"
    | "Invalid";
  severity?: "Low" | "Medium" | "High" | "Critical" | "None";
  color: string;
  textColor?: string;
  imgUrl?: string;
  iconUrl?: string;
  shortDescription?: string;
  description?: string;
  symptoms?: string[];
  treatmentMethods?: string[];
  preventionTips?: string[];
  recommendations?: string[];
  percentage?: number;
}

// -------- OSM Reverse Geocoding --------
interface OSMAddress {
  road?: string;
  state?: string;
  region?: string;
  country?: string;
  village?: string;
  postcode?: string;
  country_code?: string;
  [key: string]: any;
}

interface OSMGeocoding {
  lat: string;
  lon: string;
  name: string;
  type: string;
  class: string;
  osm_id: number;
  address: OSMAddress;
  licence: string;
  osm_type: string;
  place_id: number;
  importance: number;
  place_rank: number;
  addresstype: string;
  boundingbox: [string, string, string, string];
  display_name: string;
}

export interface ScanResultType {
  id: string;
  address: OSMGeocoding;
  result: string;
  resultArr: BananaDiseaseType[];
  percentage: number;
  imgUrl: string;
  createdAt: string;
}

// Static data that doesn't need translation
const diseaseMetadata = {
  "black-sigatoka": {
    id: "black-sigatoka",
    type: "Fungal" as const,
    severity: "High" as const,
    color: "#F93827",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Black-Sigatoka.jpg",
    iconUrl: "/img/Black_Sigatoka_Icon.png",
  },
  bmv: {
    id: "bmv",
    type: "Viral" as const,
    severity: "Medium" as const,
    color: "#6A0066",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Bract-Mosaic-Virus.jpg",
    iconUrl: "/img/BMV_Icon.png",
  },
  cordana: {
    id: "cordana",
    type: "Fungal" as const,
    severity: "Medium" as const,
    color: "#FF9B00",
    textColor: "#26333a",
    imgUrl: "/img/Banana-Cordana.jpg",
    iconUrl: "/img/Cordana_Icon.png",
  },
  healthy: {
    id: "healthy",
    type: "Normal" as const,
    severity: "None" as const,
    color: "#22b123",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Bunch.jpg",
    iconUrl: "/img/Healthy_Icon.png",
  },
  moko: {
    id: "moko",
    type: "Bacterial" as const,
    severity: "High" as const,
    color: "#EB5353",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Moko.jpg",
    iconUrl: "/img/Moko_Icon.png",
  },
  panama: {
    id: "panama",
    type: "Fungal" as const,
    severity: "High" as const,
    color: "#36AE7C",
    textColor: "#FBFEFA",
    imgUrl: "/img/Banana-Panama.jpg",
    iconUrl: "/img/Panama_Icon.png",
  },
  "not-banana": {
    id: "not-banana",
    type: "Invalid" as const,
    severity: "None" as const,
    color: "",
    textColor: "",
    imgUrl: "/img/Banana-Bunch.jpg",
    iconUrl: "",
  },
  weevil: {
    id: "weevil",
    type: "Pest" as const,
    severity: "Medium" as const,
    color: "#187498",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Weevil.jpg",
    iconUrl: "/img/Weevil_Icon.png",
  },
} as const;

//! IMPORTANT: Keep this for backward compatibility with existing code
//! THE SEQUENCE/ORDER OF THE OBJECT MUST NOT CHANGE
//! ["black-sigatoka", "bmv", "cordana" , "healthy","moko","panama","not-banana", "weevil" ]
export const bananaDiseases: BananaDiseaseType[] = [
  {
    id: "black-sigatoka",
    name: "Black Sigatoka Disease",
    type: "Fungal",
    severity: "High",
    color: "#F93827",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Black-Sigatoka.jpg",
    iconUrl: "/img/Black_Sigatoka_Icon.png",
    shortDescription:
      "A severe fungal leaf disease that reduces yield by destroying photosynthetic area",
    description:
      "Black Sigatoka (Mycosphaerella fijiensis) causes dark streaks on banana leaves that expand into necrotic patches, drastically reducing photosynthesis. The disease spreads quickly in humid climates through airborne spores, leading to poor fruit yield and quality. Management relies on fungicide sprays, resistant varieties, and strict field sanitation.",
    symptoms: [
      "Dark streaks on leaves",
      "Yellowing and early leaf death",
      "Smaller bunch size",
      "Spreading necrotic patches",
    ],
    treatmentMethods: [
      "Apply fungicides such as mancozeb, propiconazole, or chlorothalonil.",
      "Prune and destroy infected leaves to reduce spore load.",
      "Rotate fungicides to prevent resistance development.",
    ],
    preventionTips: [
      "Plant resistant cultivars if available.",
      "Ensure good air circulation by maintaining proper spacing.",
      "Avoid overhead irrigation to reduce leaf wetness.",
    ],
    recommendations: [
      "Use resistant cultivars if available.",
      "Prune and remove infected leaves to reduce spore load.",
      "Improve air circulation by maintaining proper spacing.",
      "Apply fungicides like mancozeb, propiconazole, or chlorothalonil based on local agricultural guidelines.",
    ],
  },
  {
    id: "bmv",
    name: "Bract Mosaic Virus",
    type: "Viral",
    severity: "Medium",
    color: "#6A0066",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Bract-Mosaic-Virus.jpg",
    iconUrl: "/img/BMV_Icon.png",
    shortDescription:
      "A viral disease causing leaf mosaics, streaks, and reduced growth.",
    description:
      "Banana Bract Mosaic Virus, a Potyvirus spread mainly by Pentalonia nigronervosa aphids, causes mosaic streaks, spindle-shaped marks, and bract or leaf distortion. Infected plants suffer stunted growth and lower yields. Control depends on aphid management, sanitation, and using virus-free planting materials.",
    symptoms: [
      "Mosaic streaks on leaves",
      "Brown streaks on bracts",
      "Twisted leaf growth",
      "Fewer bunches",
    ],
    treatmentMethods: [
      "No direct cure—infected plants should be removed.",
      "Use systemic insecticides to reduce vector populations.",
    ],
    preventionTips: [
      "Plant only virus-free materials.",
      "Control vectors such as aphids and thrips.",
      "Avoid intercropping with virus host plants like sugarcane.",
    ],
    recommendations: [
      "Use virus-free planting materials.",
      "Control vector insects like aphids and thrips using insecticides.",
      "Regularly inspect and remove infected plants.",
      "Avoid intercropping with susceptible hosts (e.g., sugarcane).",
    ],
  },
  {
    id: "cordana",
    name: "Cordana Disease",
    type: "Fungal",
    severity: "Medium",
    color: "#FF9B00",
    textColor: "#26333a",
    imgUrl: "/img/Banana-Cordana.jpg",
    iconUrl: "/img/Cordana_Icon.png",
    shortDescription:
      "A mild-to-moderate fungal leaf spot disease that stresses plants under heavy infection.",
    description:
      "Cordana leaf spot (Cordana musae) produces brown lesions with yellow halos that can merge and reduce photosynthesis. While less damaging than Black Sigatoka, severe infections weaken plants and reduce productivity. It is managed with proper sanitation, good field practices, and timely fungicide use.",
    symptoms: [
      "Brown spots on leaves",
      "Yellow halos around lesions",
      "Premature leaf drying",
      "Weakened growth",
    ],
    treatmentMethods: [
      "Apply copper-based fungicides.",
      "Remove and destroy heavily infected leaves.",
    ],
    preventionTips: [
      "Improve soil drainage and avoid excess irrigation.",
      "Maintain field sanitation to minimize fungal spread.",
      "Avoid mechanical injury to plants.",
    ],
    recommendations: [
      "Improve drainage and reduce excess humidity.",
      "Remove and destroy infected leaves.",
      "Apply fungicides (like copper-based ones) as needed.",
      "Avoid mechanical damage to plants.",
    ],
  },
  {
    id: "healthy",
    name: "Banana Healthy",
    type: "Normal",
    severity: "None",
    color: "#22b123",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Bunch.jpg",
    iconUrl: "/img/Healthy_Icon.png",
    shortDescription:
      "A healthy banana plant with no signs of pests or diseases.",
    description:
      "A healthy banana plant with lush green leaves, strong stems, and optimal growth, free from major pests and diseases.",
    symptoms: [
      "Bright green leaves",
      "Strong pseudostem",
      "No wilting or spots",
    ],
    treatmentMethods: [],
    preventionTips: [
      "Use certified disease-free planting materials.",
      "Maintain proper irrigation and fertilization.",
      "Regularly monitor for pests and diseases.",
      "Apply organic mulch and compost.",
    ],
    recommendations: [
      "Continue good agricultural practices.",
      "Use disease-free planting materials.",
      "Apply organic mulch and compost.",
      "Regularly monitor for pests and diseases.",
      "Maintain proper irrigation and fertilization schedules.",
    ],
  },
  {
    id: "moko",
    name: "Moko Disease",
    type: "Bacterial",
    severity: "High",
    color: "#EB5353",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Moko.jpg",
    iconUrl: "/img/Moko_Icon.png",
    shortDescription: "A bacterial wilt disease that causes rapid plant death.",
    description:
      "Moko disease, caused by Ralstonia solanacearum, invades the banana's vascular system, leading to browning, wilting, and plant collapse. Fruits may show uneven ripening and internal streaks. It spreads through tools, planting material, and insects. Management requires sanitation, removal of infected plants, and disease-free seedlings.",
    symptoms: [
      "Sudden leaf wilting",
      "Yellow, collapsing leaves",
      "Brown vascular streaks",
      "Premature fruit ripening",
    ],
    treatmentMethods: [
      "No chemical cure—eradicate infected plants immediately.",
      "Disinfect cutting and harvesting tools regularly.",
    ],
    preventionTips: [
      "Use resistant varieties where available.",
      "Prevent movement of soil, tools, and water from infected fields.",
      "Apply strict quarantine in affected areas.",
    ],
    recommendations: [
      "Remove and destroy infected plants immediately.",
      "Use clean, disinfected tools.",
      "Avoid movement of soil and water from infected areas.",
      "Use resistant varieties where available.",
      "Implement strict quarantine measures in affected areas.",
    ],
  },
  {
    id: "panama",
    name: "Panama Disease",
    type: "Fungal",
    severity: "High",
    color: "#36AE7C",
    textColor: "#FBFEFA",
    imgUrl: "/img/Banana-Panama.jpg",
    iconUrl: "/img/Panama_Icon.png",
    shortDescription: "A destructive soil-borne fungal disease with no cure.",
    description:
      "Panama disease (Fusarium oxysporum f. sp. cubense) infects the vascular system, causing yellowing, wilting, and reddish-brown tissue discoloration. It is extremely difficult to eradicate as the fungus survives in soil for decades. Control focuses on resistant cultivars, crop rotation, and quarantine enforcement.",
    symptoms: [
      "Yellowing older leaves",
      "Splitting at stem base",
      "Dark vascular streaks",
      "Plant collapse",
    ],
    treatmentMethods: [
      "No effective chemical treatment.",
      "Infected plants must be destroyed.",
    ],
    preventionTips: [
      "Plant resistant cultivars (e.g., GCTCV-218, FHIA).",
      "Avoid planting in Fusarium-contaminated soil.",
      "Use biofungicides and organic amendments to improve soil health.",
      "Rotate with non-host crops like legumes.",
    ],
    recommendations: [
      "Use Fusarium-resistant banana cultivars (e.g., GCTCV-218 or FHIA varieties).",
      "Avoid planting in contaminated soil.",
      "Improve soil health with organic amendments and biofungicides.",
      "Rotate crops with non-host species (e.g., legumes).",
    ],
  },
  {
    id: "not-banana",
    name: "Not Banana",
    type: "Invalid",
    severity: "None",
    color: "",
    textColor: "",
    imgUrl: "/img/Banana-Bunch.jpg",
    iconUrl: "",
    shortDescription: "The scanned image does not belong to a banana plant.",
    description:
      "This input does not correspond to a banana plant. Please ensure the scanned image is of a banana leaf or plant part.",
    symptoms: ["Not applicable"],
    treatmentMethods: [],
    preventionTips: ["Ensure correct plant image before scanning."],
    recommendations: [],
  },
  {
    id: "weevil",
    name: "Weevil Disease",
    type: "Pest",
    severity: "Medium",
    color: "#187498",
    textColor: "#fbfefa",
    imgUrl: "/img/Banana-Weevil.jpg",
    iconUrl: "/img/Weevil_Icon.png",
    shortDescription:
      "An insect pest that bores into the corm and weakens plants.",
    description:
      "The banana weevil (Cosmopolites sordidus) lays eggs at the plant base, and larvae bore into the pseudostem and rhizome, forming galleries. This internal damage weakens the plant, disrupts water and nutrient flow, and often causes toppling. Integrated pest management with traps, resistant varieties, and biological control is key for reducing infestations.",
    symptoms: [
      "Tunnels in corm and stem",
      "Yellowing, stunted growth",
      "Weak or toppled plants",
      "Smaller bunch size",
    ],
    treatmentMethods: [
      "Apply entomopathogenic fungi (Beauveria bassiana) where feasible.",
      "Use insecticides only if infestation is severe.",
    ],
    preventionTips: [
      "Use clean planting materials.",
      "Install pseudostem traps to monitor and control adults.",
      "Remove crop residues that harbor weevils.",
    ],
    recommendations: [
      "Use clean planting material.",
      "Apply pseudostem traps to monitor and control adult weevils.",
      "Use entomopathogenic fungi or insecticides if infestation is severe.",
      "Remove plant residues that attract weevils.",
    ],
  },
];

// Hook to get translated diseases
// Fixed hook with useMemo and safe translation access
export function useBananaDiseases(): BananaDiseaseType[] {
  const t = useTranslations("diseases");

  return useMemo(() => {
    return Object.keys(diseaseMetadata).map((diseaseId) => {
      const metadata =
        diseaseMetadata[diseaseId as keyof typeof diseaseMetadata];

      // Safe translation getter that won't throw errors
      const safeTranslate = (key: string): string => {
        try {
          const result = t.raw(key);
          return typeof result === "string" ? result : "";
        } catch {
          return "";
        }
      };

      // Helper function to safely get array translations
      const getArrayTranslations = (key: string): string[] => {
        try {
          const arrayData = t.raw(`${diseaseId}.${key}`);

          // If it's already an array in the translation file, return it
          if (Array.isArray(arrayData)) {
            return arrayData.filter((item) => typeof item === "string");
          }

          // Otherwise try to get individual indexed items
          const items: string[] = [];
          for (let i = 0; i < 20; i++) {
            try {
              const item = t.raw(`${diseaseId}.${key}.${i}`);
              if (typeof item === "string" && item) {
                items.push(item);
              } else {
                break;
              }
            } catch {
              break;
            }
          }
          return items;
        } catch {
          return [];
        }
      };

      return {
        id: metadata.id,
        type: metadata.type,
        severity: metadata.severity,
        color: metadata.color,
        textColor: metadata.textColor,
        imgUrl: metadata.imgUrl,
        iconUrl: metadata.iconUrl,
        name: safeTranslate(`${diseaseId}.name`),
        shortDescription: safeTranslate(`${diseaseId}.shortDescription`),
        description: safeTranslate(`${diseaseId}.description`),
        symptoms: getArrayTranslations("symptoms"),
        treatmentMethods: getArrayTranslations("treatmentMethods"),
        preventionTips: getArrayTranslations("preventionTips"),
        recommendations: getArrayTranslations("recommendations"),
      };
    });
  }, [t]);
}

// Fixed helper with useMemo
export function useBananaDisease(
  diseaseId: string,
): BananaDiseaseType | undefined {
  const diseases = useBananaDiseases();

  return useMemo(() => {
    return diseases.find((d) => d.id === diseaseId);
  }, [diseases, diseaseId]);
}
// For components that need disease IDs only (without translations)
export const diseaseIds = Object.keys(diseaseMetadata);

export const barangay = [
  { title: "Alcadesma" },
  { title: "Bato" },
  { title: "Conrazon" },
  { title: "Malo" },
  { title: "Manihala" },
  { title: "Pag-asa" },
  { title: "Poblacion" },
  { title: "Proper Bansud" },
  { title: "Rosacara" },
  { title: "Salcedo" },
  { title: "Sumagui" },
  { title: "Proper Tiguisan" },
  { title: "Villa Pag-asa" },
];

export interface AugmentationStepsType {
  title: string;
  subtitle: string;
  description: string;
  animation: string;
  icon: IconType;
}

export const augmentationSteps: AugmentationStepsType[] = [
  {
    title: "Rescale",
    subtitle: "Rescaling",
    description: "Normalizes pixel values from 0-255 to 0-1.",
    animation: "rescale",
    icon: MdZoomOutMap,
  },
  {
    title: "Rotation",
    subtitle: "Rotating",
    description: "Randomly rotates the image within a ±40-degree range.",
    animation: "rotate",
    icon: MdRotate90DegreesCcw,
  },
  {
    title: "Width Shift",
    subtitle: "Width Shifting",
    description: "Horizontally shifts the image by up to 30% of the width.",
    animation: "shiftX",
    icon: TfiArrowsHorizontal,
  },
  {
    title: "Height Shift",
    subtitle: "Height Shifting",
    description: "Vertically shifts the image by up to 30% of the height.",
    animation: "shiftY",
    icon: TfiArrowsVertical,
  },
  {
    title: "Shear",
    subtitle: "Shearing",
    description: "Applies a shearing transformation (tilting the image).",
    animation: "shear",
    icon: PiParallelogramThin,
  },
  {
    title: "Zoom",
    subtitle: "Zooming",
    description: "Zooms in or out randomly within the range.",
    animation: "zoom",
    icon: MdZoomIn,
  },
  {
    title: "Horizontal Flip",
    subtitle: "Horizontal Flipping",
    description: "Randomly flips the image horizontally.",
    animation: "flip",
    icon: PiFlipHorizontalLight,
  },
  {
    title: "Brigthness",
    subtitle: "Adjusting Brightness",
    description: "Adjusts image brightness randomly within range.",
    animation: "brightness",
    icon: MdBrightness5,
  },
];

export const severityColors: Record<string, string> = {
  Critical: "#F93827",
  High: "#FF9B00",
  Medium: "#36AE7C",
  Low: "#187498",
  None: "#22b123",
};

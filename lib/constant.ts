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
import { FaTruckFast } from "react-icons/fa6";

// export const isNative = Capacitor.isNativePlatform();
export const isNative = false;

export interface BananaDiseaseType {
  id: string;
  name: string;
  color?: string;
  textColor?: string;
  recommendations: string[];
  percentage?: number;
}

export const bananaDiseases: BananaDiseaseType[] = [
  {
    id: "black-sigatoka",
    name: "Banana Black Sigatoka Disease",
    color: "#22b123",
    textColor: "#fbfefa",
    recommendations: [
      "Use resistant cultivars if available.",
      "Prune and remove infected leaves to reduce spore load.",
      "Improve air circulation by maintaining proper spacing.",
      "Apply fungicides like mancozeb, propiconazole, or chlorothalonil based on local agricultural guidelines.",
    ],
  },
  {
    id: "bmv",
    name: "Banana Bract Mosaic Virus Disease",
    color: "#0e470e",
    textColor: "#fbfefa",
    recommendations: [
      "Use virus-free planting materials.",
      "Control vector insects like aphids and thrips using insecticides.",
      "Regularly inspect and remove infected plants.",
      "Avoid intercropping with susceptible hosts (e.g., sugarcane).",
    ],
  },
  {
    id: "cordana",
    name: "Banana Cordana Disease",
    color: "#1b8e1c",
    textColor: "#fbfefa",
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
    color: "#feba17",
    textColor: "#26333a",
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
    name: "Banana Moko Disease",
    color: "#feba17",
    textColor: "#26333a",
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
    name: "Banana Panama Disease",
    color: "#fece2e",
    textColor: "#26333a",
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
    recommendations: [],
  },
  {
    id: "weevil",
    name: "Banana Weevil Disease",
    color: "#fed858",
    textColor: "#26333a",
    recommendations: [
      "Use clean planting material.",
      "Apply pseudostem traps to monitor and control adult weevils.",
      "Use entomopathogenic fungi or insecticides if infestation is severe.",
      "Remove plant residues that attract weevils.",
    ],
  },
];

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

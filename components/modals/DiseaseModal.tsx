import Image from "next/image";

import {
  MdWarning,
  MdInfo,
  MdLocalHospital,
  MdBugReport,
  MdScience,
  MdShield,
} from "react-icons/md";
import {
  RiVirusLine,
  RiPlantLine,
  RiMicroscopeLine,
  RiLeafLine,
  RiFirstAidKitLine,
} from "react-icons/ri";
import { MdAlarm } from "react-icons/md";
import PlatformWrapper from "../wrapper/PlatformWrapper";

import { isNative, BananaDiseaseType } from "@/lib/constant";

interface DiseaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  disease: BananaDiseaseType | null;
}

const DiseaseModal = ({ isOpen, onClose, disease }: DiseaseModalProps) => {
  if (!isOpen || !disease) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <MdWarning className="h-5 w-5 text-red-500" />;
      case "High":
        return <MdAlarm className="h-5 w-5 text-orange-500" />;
      case "Medium":
        return <MdInfo className="h-5 w-5 text-yellow-500" />;
      default:
        return <MdInfo className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Fungal":
        return <RiMicroscopeLine className="h-5 w-5 text-blue-600" />;
      case "Viral":
        return <RiVirusLine className="h-5 w-5 text-purple-600" />;
      case "Bacterial":
        return <MdScience className="h-5 w-5 text-green-600" />;
      case "Pest":
        return <MdBugReport className="h-5 w-5 text-indigo-600" />;
      default:
        return <RiPlantLine className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-50 text-red-800 border-red-200";
      case "High":
        return "bg-orange-50 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Fungal":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Viral":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Bacterial":
        return "bg-green-50 text-green-800 border-green-200";
      case "Pest":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <PlatformWrapper
      open={isOpen}
      onOpenChange={onClose}
      title={disease.name}
      nativeTitleClass="text-left "
    >
      <div
        className={`border-primary/60 overflow-hidden rounded-md border-1 ${!isNative ? "mx-0" : "mx-0"}`}
      >
        {/* Hero Image Section */}
        <div className="">
          <div className="relative h-64 w-full md:h-80">
            <Image
              src={disease.imgUrl || ""}
              fill
              alt={disease.name || ""}
              className="object-cover"
            />

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {disease.severity && (
                <div
                  className={`flex items-center gap-2 rounded-full border bg-white/90 px-3 py-1.5 backdrop-blur-md ${getSeverityColor(disease.severity)}`}
                >
                  {getSeverityIcon(disease.severity)}
                  <span className="text-sm font-semibold">
                    {disease.severity} Risk
                  </span>
                </div>
              )}
              {disease.type && (
                <div
                  className={`flex items-center gap-2 rounded-full border bg-white/90 px-3 py-1.5 backdrop-blur-md ${getTypeColor(disease.type)}`}
                >
                  {getTypeIcon(disease.type)}
                  <span className="text-sm font-semibold">{disease.type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-primary/10">
          {" "}
          <div className="space-y-6 p-6">
            {/* Disease Info */}
            <div>
              <h2 className="text-primary mb-3 text-2xl font-bold">
                {disease.name}
              </h2>
              <p className="text-justify text-sm leading-relaxed text-gray-600">
                {disease.description}
              </p>
            </div>

            {/* Key Symptoms */}
            {disease.symptoms && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <RiLeafLine className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">
                    Key Symptoms
                  </h3>
                </div>
                <ul className="space-y-2">
                  {disease.symptoms.map((symptom: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-red-700"
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                      <span className="text-sm">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Treatment Methods */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <RiFirstAidKitLine className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Treatment Methods
                </h3>
              </div>
              <ul className="space-y-2">
                {disease?.treatmentMethods?.map((treatment, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-green-700"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                    <span className="text-sm">{treatment}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention Tips */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <MdShield className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">
                  Prevention Tips
                </h3>
              </div>
              <ul className="space-y-2">
                {disease?.preventionTips?.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-blue-700"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional Consultation CTA */}
            <div className="from-primary/10 to-secondary/10 border-primary/20 hidden rounded-xl border bg-gradient-to-r p-6 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <MdLocalHospital className="text-primary h-6 w-6" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Need Professional Help?
                </h3>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                For severe infestations or if symptoms persist, consult with an
                agricultural expert or plant pathologist for personalized
                treatment recommendations.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex hidden flex-col gap-3 pt-4 sm:flex-row">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-200"
              >
                Close
              </button>
              <button className="bg-primary hover:bg-primary/90 flex-1 rounded-lg px-6 py-3 font-medium text-white transition-colors duration-200">
                Scan for This Disease
              </button>
            </div>
          </div>
        </div>
      </div>
    </PlatformWrapper>
  );
};

export default DiseaseModal;

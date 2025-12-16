"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ScanTable from "@/components/admin/ScanTable";
import useScanResult from "@/hooks/useScanResult";
import { deleteScanResult } from "@/lib/helper";
import { getDiseaseId } from "@/lib/diseaseMapper";
import { useBananaDiseases } from "@/lib/constant";

function Page() {
  const scanResult = useScanResult();
  const t = useTranslations("diseases");
  const bananaDiseases = useBananaDiseases();

  // Helper function to get full disease data by ID
  const getDiseaseDataById = (diseaseId: string) => {
    return bananaDiseases.find((d) => d.id === diseaseId);
  };

  // Helper function to get array translations safely
  const getArrayTranslations = (diseaseId: string, key: string): string[] => {
    try {
      const arrayData = t.raw(`${diseaseId}.${key}`);

      if (Array.isArray(arrayData)) {
        return arrayData.filter((item) => typeof item === "string");
      }

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

  // Translate all scan results to the current locale
  const translatedScanResults = useMemo(() => {
    return scanResult.map((scan) => {
      // Convert result (might be ID or disease name) to disease ID
      const diseaseId = getDiseaseId(scan.result);

      return {
        ...scan,
        // Translate the disease name for display
        result: t(`${diseaseId}.name`),
        // Fully translate each item in resultArr with all fields
        resultArr: scan.resultArr?.map((r) => {
          // Get disease ID from either r.id or r.name
          const rDiseaseId = getDiseaseId(r.id || r.name || "");
          const fullDiseaseData = getDiseaseDataById(rDiseaseId);

          return {
            ...r,
            id: rDiseaseId, // Ensure ID is present
            name: t(`${rDiseaseId}.name`),
            shortDescription: t(`${rDiseaseId}.shortDescription`),
            description: t(`${rDiseaseId}.description`),
            symptoms: getArrayTranslations(rDiseaseId, "symptoms"),
            treatmentMethods: getArrayTranslations(
              rDiseaseId,
              "treatmentMethods",
            ),
            preventionTips: getArrayTranslations(rDiseaseId, "preventionTips"),
            recommendations: getArrayTranslations(
              rDiseaseId,
              "recommendations",
            ),
            // Keep original metadata
            type: fullDiseaseData?.type || r.type,
            severity: fullDiseaseData?.severity || r.severity,
            color: fullDiseaseData?.color || r.color,
            textColor: fullDiseaseData?.textColor || r.textColor,
            imgUrl: fullDiseaseData?.imgUrl || r.imgUrl,
            iconUrl: fullDiseaseData?.iconUrl || r.iconUrl,
          };
        }),
      };
    });
  }, [scanResult, t, bananaDiseases]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <p className="font-clash-grotesk text-2xl font-semibold">
            Scan Results
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mb-10 flex flex-col gap-4">
        <ScanTable data={translatedScanResults} onDelete={deleteScanResult} />
      </div>
    </div>
  );
}

export default Page;

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";

import PlatformWrapper from "../wrapper/PlatformWrapper";
import { isNative } from "@/lib/constant";
import { div } from "@tensorflow/tfjs";

interface LoaderModalProps {
  open: boolean;
  onClose: () => void;
  currentStep: number;
  previewImg: string | null;
  augmentationSteps: {
    animation: string;
    subtitle: string;
    description: string;
  }[];
}

const LoaderModal: React.FC<LoaderModalProps> = ({
  open,
  onClose,
  currentStep,
  previewImg,
  augmentationSteps,
}) => {
  // Calculate progress percentage
  const progress = Math.min(
    (currentStep / augmentationSteps.length) * 100,
    100,
  );
  const currentStepData =
    augmentationSteps[currentStep] || augmentationSteps[0];

  // Step status indicators
  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  const paddingClass = isNative ? "px-0" : "px-6";

  useEffect(() => {
    if (open && !isNative) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        const message =
          "Analysis in progress! Are you sure you want to leave? Your scan will be lost.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [open, isNative]);

  return (
    <PlatformWrapper
      open={open}
      onOpenChange={onClose}
      title=""
      showBackButton={false}
      nativeTitleClass="text-center w-full"
      showHeader={false}
    >
      <div className="flex h-full flex-1 flex-col">
        {/* Refresh Warning */}
        {!isNative && (
          <div className="px-4">
            <Alert className="border-primary/20 bg-primary/20">
              <ScanLine className="text-primary h-4 w-4" />
              <AlertDescription className="text-primary font-medium">
                Scan in progress — please keep this page open.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Header Section */}
        <div className={`border-b border-gray-200 py-4 ${paddingClass}`}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-primary h-3 w-3 animate-pulse rounded-full"></div>
                <div className="bg-primary/40 absolute inset-0 h-3 w-3 animate-ping rounded-full opacity-75"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Performing Scan…
              </h2>
            </div>
            <Badge
              variant="secondary"
              className="border-primary bg-primary/10 text-primary font-semibold"
            >
              Step {currentStep + 1} of {augmentationSteps.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {currentStepData?.subtitle || "Processing"}...
              </span>
              <span className="text-primary text-sm font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 space-y-6 py-4 ${paddingClass}`}>
          {/* Image Analysis Section */}
          <Card className="bg-primary/20 border-primary border-2 border-dashed">
            <CardContent className="p-6">
              <div className="relative mx-auto aspect-square max-h-[350px] w-full overflow-hidden rounded-xl">
                {true && (
                  <>
                    {/* Image with processing overlay */}
                    <img
                      src={previewImg || "/img/Banana-Bract-Mosaic-Virus.jpg"}
                      alt="Sample Analysis"
                      className={`h-full w-full object-cover transition-all duration-700 ${
                        currentStepData?.animation || ""
                      } animate-steps`}
                    />

                    {/* Processing overlay */}
                    <div className="pointer-events-none absolute inset-0">
                      {/* Scanning line effect */}
                      <div className="absolute inset-0">
                        <div className="animate-scan-line bg-primary h-0.5 w-full shadow-lg"></div>
                      </div>
                    </div>

                    {/* Analysis indicators */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
                        <div className="bg-primary h-2 w-2 animate-pulse rounded-full"></div>
                        <p>Analyzing</p>
                      </div>
                    </div>

                    {/* Processing grid overlay */}
                    <div className="pointer-events-none absolute inset-0">
                      <div className="border-primary/40 h-full w-full rounded-xl border-2">
                        <div className="border-primary/30 absolute inset-4 rounded-lg border">
                          <div className="border-primary/20 absolute inset-4 rounded-md border"></div>
                        </div>
                      </div>
                    </div>

                    {/* Corner indicators */}
                    <div className="absolute top-2 left-2">
                      <div className="border-primary h-6 w-6 border-t-2 border-l-2"></div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="border-primary h-6 w-6 border-t-2 border-r-2"></div>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="border-primary h-6 w-6 border-b-2 border-l-2"></div>
                    </div>
                    <div className="absolute right-2 bottom-2">
                      <div className="border-primary h-6 w-6 border-r-2 border-b-2"></div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <div className="space-y-4">
            <h3 className="text-dark flex items-center gap-2 text-lg font-semibold">
              <div className="bg-primary h-4 w-4 rounded-full"></div>
              Disease Detection Steps
            </h3>

            <div className="grid gap-3">
              {augmentationSteps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 rounded-lg border p-3 transition-all duration-300 ${
                      status === "completed"
                        ? "border-primary/40 bg-primary/10"
                        : status === "active"
                          ? "border-primary/50 bg-primary/20 ring-primary/20 scale-105"
                          : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    {/* Step indicator */}
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                        status === "completed"
                          ? "bg-primary text-white shadow-lg"
                          : status === "active"
                            ? "bg-primary ring-primary/30 animate-pulse text-white shadow-lg ring-2"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {status === "completed" ? "✓" : index + 1}
                    </div>

                    {/* Step content */}
                    <div className="flex-1">
                      <p
                        className={`font-medium transition-colors duration-300 ${
                          status === "active"
                            ? "text-primary"
                            : status === "completed"
                              ? "text-primary"
                              : "text-gray-600"
                        }`}
                      >
                        {step.subtitle}
                      </p>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          status === "active"
                            ? "text-dark"
                            : status === "completed"
                              ? "text-dark"
                              : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Status indicator */}
                    {status === "active" && (
                      <div className="flex-shrink-0">
                        <div className="text-primary border-primary/30 border-t-primary h-6 w-6 animate-spin rounded-full border-2"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PlatformWrapper>
  );
};

export default LoaderModal;

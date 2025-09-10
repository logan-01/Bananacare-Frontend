import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import Stepper from "../user/Stepper";
import PlatformWrapper from "../wrapper/PlatformWrapper";

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

  return (
    <PlatformWrapper
      open={open}
      onOpenChange={onClose}
      title="Scan Progress"
      showBackButton={false}
    >
      <div className="flex h-full flex-1 flex-col bg-gradient-to-br from-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Processing Analysis
              </h2>
            </div>
            <Badge
              variant="secondary"
              className="border-blue-200 bg-blue-100 text-blue-800"
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
              <span className="text-sm font-bold text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 p-6">
          {/* Image Analysis Section */}
          <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 shadow-inner">
            <CardContent className="p-6">
              <div className="relative mx-auto aspect-square max-h-[350px] w-full overflow-hidden rounded-xl bg-white shadow-lg">
                {previewImg && (
                  <>
                    {/* Image with processing overlay */}
                    <img
                      src={previewImg}
                      alt="Banana Analysis"
                      className={`h-full w-full object-cover transition-all duration-700 ${
                        currentStepData?.animation || ""
                      } animate-steps`}
                    />

                    {/* Processing overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10">
                      {/* Scanning line effect */}
                      <div className="absolute inset-0">
                        <div className="animate-scan-line h-0.5 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-80"></div>
                      </div>
                    </div>

                    {/* Analysis indicators */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                        Analyzing
                      </div>
                    </div>

                    {/* Processing grid overlay */}
                    {currentStep > 1 && (
                      <div className="pointer-events-none absolute inset-0">
                        <div className="h-full w-full rounded-xl border-2 border-green-400/30">
                          <div className="absolute inset-4 rounded-lg border border-green-400/20">
                            <div className="absolute inset-4 rounded-md border border-green-400/10"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              Analysis Steps
            </h3>

            <div className="grid gap-3">
              {augmentationSteps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 rounded-lg border p-3 transition-all duration-300 ${
                      status === "completed"
                        ? "border-green-200 bg-green-50 shadow-sm"
                        : status === "active"
                          ? "scale-105 border-blue-300 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {/* Step indicator */}
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                        status === "completed"
                          ? "bg-green-500 text-white shadow-lg"
                          : status === "active"
                            ? "animate-pulse bg-blue-500 text-white shadow-lg"
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
                            ? "text-blue-800"
                            : status === "completed"
                              ? "text-green-800"
                              : "text-gray-600"
                        }`}
                      >
                        {step.subtitle}
                      </p>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          status === "active"
                            ? "text-blue-600"
                            : status === "completed"
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Status indicator */}
                    {status === "active" && (
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div className="space-y-2 text-center">
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                AI Processing
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                TensorFlow Model
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                Real-time Analysis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes scan-line {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(400px);
          }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
        .animate-steps {
          filter: brightness(1.1) contrast(1.05);
        }
      `}</style>
    </PlatformWrapper>
  );
};

export default LoaderModal;

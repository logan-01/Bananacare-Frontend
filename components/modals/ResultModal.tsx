import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MdClose,
  MdRefresh,
  MdDownload,
  MdShare,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdInfo,
} from "react-icons/md";
import { BananaDiseaseType } from "@/lib/constant";
import PlatformWrapper from "../wrapper/PlatformWrapper";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  rankedResults: BananaDiseaseType[];
  resetForm?: () => void;
  previewImg: string | null;
  isOfflineResult?: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({
  open,
  onClose,
  rankedResults,
  resetForm,
  previewImg,
  isOfflineResult = false,
}) => {
  const handleClose = () => {
    onClose();
    if (resetForm) {
      resetForm();
    }
  };

  const handleNewAnalysis = () => {
    handleClose();
  };

  const topResult = rankedResults[0];
  const confidence = topResult?.percentage || 0;

  // Get appropriate icon and styling based on confidence level
  const getConfidenceStatus = (confidence: number) => {
    if (confidence >= 90)
      return {
        icon: MdCheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        label: "High Confidence",
      };
    if (confidence >= 70)
      return {
        icon: MdWarning,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        label: "Medium Confidence",
      };
    if (confidence >= 50)
      return {
        icon: MdError,
        color: "text-orange-600",
        bg: "bg-orange-50",
        label: "Low Confidence",
      };
    return {
      icon: MdInfo,
      color: "text-gray-600",
      bg: "bg-gray-50",
      label: "Very Low Confidence",
    };
  };

  const confidenceStatus = getConfidenceStatus(confidence);
  const ConfidenceIcon = confidenceStatus.icon;

  const filteredResults = rankedResults.filter(
    (item) => item.id !== "not-banana",
  );

  return (
    <PlatformWrapper open={open} onOpenChange={handleClose} title="Scan Result">
      {isOfflineResult && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-2">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <MdInfo className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              Scan saved offline
            </p>
            <p className="text-xs text-blue-700">
              Results processed and stored locally for offline access
            </p>
          </div>
          <Badge
            variant="secondary"
            className="border-blue-200 bg-blue-100 text-blue-800"
          >
            Offline
          </Badge>
        </div>
      )}

      <div className="space-y-6">
        {/* Header with confidence indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${confidenceStatus.bg}`}>
              <ConfidenceIcon className={`h-5 w-5 ${confidenceStatus.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {topResult?.name}
              </h3>
              <p className={`text-sm ${confidenceStatus.color} font-medium`}>
                {confidenceStatus.label} ({confidence}%)
              </p>
            </div>
          </div>
          <Badge
            variant={confidence >= 70 ? "default" : "secondary"}
            className="text-light px-3 py-1"
          >
            Match: {confidence}%
          </Badge>
        </div>

        {/* Image with overlay */}
        <div className="group relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
            {previewImg ? (
              <img
                src={previewImg}
                alt="Analyzed banana image"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <p>No image available</p>
              </div>
            )}

            {/* Gradient overlay with result */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute right-4 bottom-4 left-4">
              <div className="bg rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {topResult?.name}
                    </p>
                    <p className="text-sm text-white">Primary detection</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {confidence}%
                    </p>
                    <p className="text-xs text-white">Confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detection Results */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900">
              Detection Results
            </h4>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-3">
            {filteredResults.map((result, index) => (
              <div
                key={index}
                className="group border-primary/80 h rounded-lg border bg-white p-4 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Rank indicator */}
                  <div className="flex-shrink-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                        index === 0
                          ? "bg-primary"
                          : index === 1
                            ? "bg-gray-400"
                            : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Progress and details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {result?.name}
                      </p>
                      <Badge variant="outline" className="text-primary ml-2">
                        {result?.percentage}%
                      </Badge>
                    </div>
                    <Progress
                      value={result?.percentage}
                      className="h-2"
                      style={{
                        backgroundColor: "#f1f5f9",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {topResult?.recommendations && topResult.recommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900">
                Recommendations
              </h4>
              <Separator className="flex-1" />
            </div>

            <div className="rounded-xl">
              <div className="space-y-4">
                {topResult.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="border-primary/80 flex items-start gap-4 rounded-lg border bg-white p-4 transition hover:shadow-md"
                  >
                    {/* Number / Step circle */}
                    <div className="bg-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white shadow">
                      {index + 1}
                    </div>

                    {/* Recommendation text */}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed font-medium text-gray-800">
                        {recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="hidden flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
          <Button
            onClick={handleNewAnalysis}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            <MdRefresh className="mr-2 h-4 w-4" />
            Analyze Another Image
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-gray-50"
              title="Download Results"
            >
              <MdDownload className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-gray-50"
              title="Share Results"
            >
              <MdShare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </PlatformWrapper>
  );
};

export default ResultModal;

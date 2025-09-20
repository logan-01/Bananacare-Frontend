"use client";

//React
import { useState, useEffect } from "react";
//Zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//React Hook Form
import { useForm } from "react-hook-form";
//Tensorflow
import * as tf from "@tensorflow/tfjs";
import { loadModel, preprocessImage, makePrediction } from "@/lib/tensorflow";
//Constant
import { BananaDiseaseType, augmentationSteps } from "@/lib/constant";
//Shadcn
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
// Custom Hooks
import useLocation from "@/hooks/useLocation";
import useOfflineStorage from "@/hooks/useOfflineStorage";
// Helper
import {
  getReverseGeocode,
  getImageUrl,
  getIsBanana,
  sendScanResult,
} from "@/lib/helper";

//Modals Component
import LoaderModal from "../modals/LoaderModal";
import ResultModal from "../modals/ResultModal";
import NotBananaModal from "../modals/NotBananaModal";
import LocationModal from "../modals/LocationModal";
//Custom Input Fields
import ImageInput from "./ImageInput";
import LocationInput from "./LocationInput";

import { isNative } from "@/lib/constant";
import { MapPin, CheckCircle2, WifiOff, Wifi, CloudUpload } from "lucide-react";

// Schema
const scanSchema = z.object({
  file: z.array(z.instanceof(File)).min(1, "Please upload an image"),
});

function ScanForm() {
  //* useState
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showNotBanana, setShowNotBanana] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [rankedResults, setRankedResults] = useState<BananaDiseaseType[]>([]);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [scanSavedOffline, setScanSavedOffline] = useState<boolean>(false);

  //* Hooks
  const {
    locationData,
    isGettingLocation,
    locationError,
    getCurrentLocation,
    resetLocation,
  } = useLocation();

  const {
    syncStatus,
    saveScanOffline,
    syncAllPendingScans,
    checkNetworkStatus,
  } = useOfflineStorage();

  //* useEffect
  // Load Model useEffect
  useEffect(() => {
    const load = async () => {
      const loadedModel = await loadModel("/model/model.json");
      setModel(loadedModel);
    };
    load();
  }, []);

  // Show Loader useEffect
  useEffect(() => {
    let interval: any;

    if (showLoader) {
      setCurrentStep(0); // Reset on new start
      setShowResult(false); // Hide result initially

      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < 7) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setShowResult(true);
            setShowLoader(false); // optional: stop loader once done
            setIsScanning(false);
            return prev;
          }
        });
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [showLoader]);

  // Check network status on mount
  useEffect(() => {
    checkNetworkStatus();
  }, []);

  //* Functions
  const form = useForm<z.infer<typeof scanSchema>>({
    resolver: zodResolver(scanSchema),
    defaultValues: {
      file: [],
    },
  });

  // Add this to your ScanForm component for better debugging

  const onSubmit = async (values: z.infer<typeof scanSchema>) => {
    console.log("🚀 === SCAN SUBMISSION STARTED ===");
    console.log("📱 Is native app:", isNative);
    console.log("🌐 Network status:", syncStatus.isOnline);

    //Guard Close
    // Model Check
    if (!model) {
      alert("AI model is still loading. Please wait and try again.");
      return;
    }
    //Location Data Check
    if (!locationData) {
      setShowLocationModal(true);
      return;
    }

    setIsScanning(true);
    setScanSavedOffline(false);

    try {
      const bananaImage = values.file[0];
      console.log("🖼️ Image file:", {
        name: bananaImage.name,
        size: bananaImage.size,
        type: bananaImage.type,
      });

      const tensor = await preprocessImage(bananaImage);
      const results = await makePrediction(model, tensor);
      console.log("🧠 AI Prediction results:", results);

      // Always check with local model first
      const modelIsBanana =
        results.length > 0 && results[0].id !== "not-banana";
      let isBanana = modelIsBanana;

      console.log("🍌 Local model says is banana:", modelIsBanana);

      // Only check with HuggingFace if online
      if (syncStatus.isOnline) {
        console.log("🤖 Checking with HuggingFace API...");
        try {
          const { isBanana: hfIsBanana } = await getIsBanana(bananaImage);
          isBanana = modelIsBanana && hfIsBanana;
          console.log("🤖 HuggingFace says is banana:", hfIsBanana);
          console.log("🎯 Final decision is banana:", isBanana);
        } catch (error) {
          console.warn("⚠️ HF API failed, using model prediction only:", error);
        }
      } else {
        console.log("📴 Offline mode - skipping HuggingFace check");
      }

      if (!isBanana) {
        console.log("❌ Not a banana - showing not banana modal");
        setShowNotBanana(true);
        setShowLoader(false);
        setRankedResults([]);
        setIsScanning(false);
        return;
      }

      console.log("✅ Is banana - proceeding with scan");
      setShowLoader(true);
      setRankedResults(results);

      // Handle online vs offline scenarios
      if (syncStatus.isOnline) {
        console.log("🌐 Online mode - attempting to save to backend");
        try {
          console.log("=== ONLINE SAVE PROCESS ===");

          // Step 1: Upload image
          console.log("📤 Step 1: Uploading image to Cloudinary...");
          const formData = new FormData();
          formData.append("file", values.file[0]);
          const imgUrl = await getImageUrl(formData);
          console.log("📤 Image URL received:", imgUrl);

          // Step 2: Get location info
          console.log("🗺️ Step 2: Getting reverse geocode...");
          const locationInfo = await getReverseGeocode(
            locationData.latitude,
            locationData.longitude,
          );
          console.log("🗺️ Location info received:", locationInfo);

          // Step 3: Prepare payload
          const payload = {
            percentage: results[0].percentage ?? 0,
            resultArr: results,
            result: results[0].id,
            imgUrl: imgUrl || "",
            address: locationInfo,
          };
          console.log("📋 Payload prepared:", {
            result: payload.result,
            percentage: payload.percentage,
            hasImage: !!payload.imgUrl,
            hasAddress: !!payload.address,
          });

          // Step 4: Send to backend
          console.log("💾 Step 3: Sending to backend...");
          await sendScanResult(payload);
          console.log("✅ Online save completed successfully!");
        } catch (error) {
          console.error("❌ Online save failed:", error);
          console.log("💾 Falling back to offline save...");

          // Save offline as fallback
          await saveScanOffline(
            bananaImage,
            results[0].percentage ?? 0,
            results,
            results[0].id,
            {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
            },
          );
          setScanSavedOffline(true);
          console.log("💾 Offline fallback save completed");
        }
      } else {
        console.log("📴 Offline mode - saving locally");
        await saveScanOffline(
          bananaImage,
          results[0].percentage ?? 0,
          results,
          results[0].id,
          {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
          },
        );
        setScanSavedOffline(true);
        console.log("💾 Offline save completed");
      }

      console.log("🏁 === SCAN SUBMISSION COMPLETED ===");
    } catch (error: unknown) {
      console.error("💥 === SCAN SUBMISSION FAILED ===");
      console.error("Error details:", error);

      if (error instanceof Error) {
        alert(`Scan failed: ${error.message}`);
      } else {
        alert("Scan failed: Unknown error");
      }

      setIsScanning(false);
      setShowLoader(false);
    }
  };
  const resetForm = () => {
    setPreviewImg(null);
    form.reset();
    setShowResult(false);
    setRankedResults([]);
    resetLocation();
    setShowLocationModal(false);
    setScanSavedOffline(false);
  };

  // Handle location modal actions
  const handleLocationModalClose = () => {
    setShowLocationModal(false);
  };

  const handleLocationModalGetLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setShowLocationModal(false);
      // Automatically trigger scan after getting location
      if (form.getValues("file").length > 0) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  // Handle manual sync
  const handleManualSync = async () => {
    await syncAllPendingScans();
  };

  // Check if form is ready for submission
  const hasImage = form.watch("file").length > 0;

  const handleImageChange = (files: File[], previewUrl: string | null) => {
    form.setValue("file", files);
  };

  return (
    <div className={`${isNative ? "mr-0" : "mr-0"}`}>
      {/* Network Status & Sync Info */}
      <div className="mb-4 hidden space-y-2">
        {/* Network Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600">Offline</span>
              </>
            )}
          </div>

          {/* Sync Status */}
          {syncStatus.pendingCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {syncStatus.pendingCount} pending
              </Badge>
              {syncStatus.isOnline && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualSync}
                  disabled={syncStatus.isSyncing}
                  className="h-6 px-2 text-xs"
                >
                  <CloudUpload className="mr-1 h-3 w-3" />
                  {syncStatus.isSyncing ? "Syncing..." : "Sync"}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Offline Notice */}
        {!syncStatus.isOnline && (
          <Alert>
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You're offline. Scan results will be saved locally and synced when
              you're back online.
            </AlertDescription>
          </Alert>
        )}

        {/* Sync Errors */}
        {syncStatus.syncErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              Some scans failed to sync: {syncStatus.syncErrors[0]}
              {syncStatus.syncErrors.length > 1 &&
                ` and ${syncStatus.syncErrors.length - 1} more`}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex flex-col gap-4 ${isNative ? "px-0" : "px-0"}`}
        >
          {/* Location Input */}
          <LocationInput
            locationData={locationData}
            locationError={locationError}
            isGettingLocation={isGettingLocation}
            onGetLocation={getCurrentLocation}
            onRetryLocation={getCurrentLocation}
          />

          {/* Image Input Field */}
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <ImageInput
                previewImg={previewImg}
                onImageChange={handleImageChange}
                onPreviewChange={setPreviewImg}
              />
            )}
          />

          <Button
            type="submit"
            className="text-light py-6 text-base hover:cursor-pointer"
            disabled={!hasImage || isScanning || isGettingLocation}
          >
            {isScanning
              ? "Scanning..."
              : isGettingLocation
                ? "Getting Location..."
                : "Scan"}
          </Button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Results are for reference only. Consult agricultural experts for
              treatment advice.
              {!syncStatus.isOnline && " • Working offline"}
            </p>
          </div>
        </form>
      </Form>

      {/* Loader Modal */}
      <LoaderModal
        open={showLoader}
        onClose={() => {
          setShowLoader(false);
          setIsScanning(false);
        }}
        currentStep={currentStep}
        previewImg={previewImg}
        augmentationSteps={augmentationSteps}
      />

      {/* Result Modal */}
      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        rankedResults={rankedResults}
        resetForm={resetForm}
        previewImg={previewImg}
        // Pass offline status to show different messaging
        isOfflineResult={scanSavedOffline}
      />

      <NotBananaModal
        open={showNotBanana}
        onClose={() => setShowNotBanana(false)}
      />

      {/* Location Required Modal */}
      <LocationModal
        open={showLocationModal}
        onClose={handleLocationModalClose}
        onGetLocation={handleLocationModalGetLocation}
        isGettingLocation={isGettingLocation}
        locationError={locationError}
      />
    </div>
  );
}

export default ScanForm;

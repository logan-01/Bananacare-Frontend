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
// Custom Hooks
import useLocation from "@/hooks/useLocation";
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
import { MapPin, CheckCircle2 } from "lucide-react";

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

  //* Hooks
  const {
    locationData,
    isGettingLocation,
    locationError,
    getCurrentLocation,
    resetLocation,
  } = useLocation();

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

  //* Functions
  const form = useForm<z.infer<typeof scanSchema>>({
    resolver: zodResolver(scanSchema),
    defaultValues: {
      file: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof scanSchema>) => {
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

    try {
      const bananaImage = values.file[0];
      const tensor = await preprocessImage(bananaImage);
      const results = await makePrediction(model, tensor);

      //Check if the image is a banana
      const modelIsBanana =
        results.length > 0 && results[0].id !== "not-banana";
      const { isBanana: hfIsBanana, predictions: hfPredictions } =
        await getIsBanana(bananaImage);
      const isBanana = modelIsBanana && hfIsBanana;

      console.log("Model is Banana ?", modelIsBanana);
      console.log("HF is Banana ?", hfIsBanana);

      if (!isBanana) {
        setShowNotBanana(true);
        setShowLoader(false);
        setRankedResults([]);
        setIsScanning(false);
        return;
      }

      setShowLoader(true);
      setRankedResults(results);

      const formData = new FormData();
      formData.append("file", values.file[0]);
      //Get Image URL from Cloudinary
      const imgUrl = await getImageUrl(formData);
      //Get Location Info from OSM
      const locationInfo = await getReverseGeocode(
        locationData.latitude,
        locationData.longitude,
      );

      // Enhanced payload with location data
      const payload = {
        percentage: results[0].percentage ?? 0,
        resultArr: results,
        result: results[0].id,
        imgUrl: imgUrl || "",
        address: locationInfo.address,
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy,
          timestamp: locationData.timestamp,
        },
      };
      //Save Scan Result to Database
      await sendScanResult(payload);
    } catch (error) {
      console.error("Scan error:", error);
      alert("An error occurred during scanning. Please try again.");
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

  // Check if form is ready for submission
  const hasImage = form.watch("file").length > 0;

  const handleImageChange = (files: File[], previewUrl: string | null) => {
    form.setValue("file", files);
  };

  return (
    <div className={`${isNative ? "mr-0" : "mr-4"}`}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Location Input */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center gap-2 py-1">
              <div className="flex flex-1 items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold">Set Location</span>
              </div>

              {locationData && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Located
                </Badge>
              )}
            </div>

            <LocationInput
              locationData={locationData}
              locationError={locationError}
              isGettingLocation={isGettingLocation}
              onGetLocation={getCurrentLocation}
              onRetryLocation={getCurrentLocation}
            />
          </div>

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
            className="text-light text-base hover:cursor-pointer"
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

"use client";

//React
import { useState, useEffect, useCallback } from "react";
//Next
import NextImage from "next/image";
//Zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//React Hook Form
import { useForm } from "react-hook-form";
// React Icons
import {
  MdCloudUpload,
  MdClose,
  MdCameraAlt,
  MdLocationOn,
  MdLocationOff,
} from "react-icons/md";
//Tensorflow
import * as tf from "@tensorflow/tfjs";
import { loadModel, preprocessImage, makePrediction } from "@/lib/tensorflow";
//Constant
import { BananaDiseaseType, augmentationSteps } from "@/lib/constant";
//React Drop Zone
import { useDropzone } from "react-dropzone";
//Capacitor
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
//Shadcn
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// Removed toast import - using console.log and alerts instead
//Custom Component
import LoaderModal from "../modals/LoaderModal";
import ResultModal from "../modals/ResultModal";
import NotBananaModal from "../modals/NotBananaModal";

// Updated schema for image upload with location data
const scanSchema = z.object({
  file: z.array(z.instanceof(File)).min(1, "Please upload an image"),
});

// Location interface
interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export function ScanForm() {
  //* useState
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showNotBanana, setShowNotBanana] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [rankedResults, setRankedResults] = useState<BananaDiseaseType[]>([]);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

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

    return () => clearInterval(interval); // Clean up when showLoader changes or unmounts
  }, [showLoader]);

  //* Functions
  const form = useForm<z.infer<typeof scanSchema>>({
    resolver: zodResolver(scanSchema),
    defaultValues: {
      file: [],
    },
  });

  // Function to convert base64 to File
  const base64ToFile = (base64String: string, fileName: string): File => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  // Function to capture image from camera
  const captureFromCamera = async () => {
    try {
      setIsCapturing(true);

      // Check if running on native platform
      if (!Capacitor.isNativePlatform()) {
        alert("Camera capture is only available on mobile devices.");
        return;
      }

      // Request camera permission and capture
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        // Convert to File object
        const file = base64ToFile(
          image.dataUrl,
          `camera_capture_${Date.now()}.jpg`,
        );

        // Update form and preview
        form.setValue("file", [file]);
        setPreviewImg(image.dataUrl);

        console.log("Photo captured successfully!");
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      alert("Failed to capture photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  // Function to get current location
  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setIsGettingLocation(true);
      setLocationError(null);

      // Check if running on native platform or web
      let coordinates;

      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Geolocation for native
        coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
      } else {
        // Use Web Geolocation API for browser
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by this browser");
        }

        coordinates = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 60000,
            });
          },
        );
      }

      const locationData: LocationData = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
        timestamp: coordinates.timestamp,
      };

      setLocationData(locationData);
      setLocationError(null);

      console.log(
        `Location recorded: ${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`,
      );

      return locationData;
    } catch (error) {
      console.error("Error getting location:", error);
      let errorMessage = "Failed to get location";

      if (error instanceof GeolocationPositionError || (error as any).code) {
        const code = (error as any).code;
        switch (code) {
          case 1:
            errorMessage =
              "Location access denied. Please enable location services and allow access.";
            break;
          case 2:
            errorMessage =
              "Location unavailable. Please check your device's location settings.";
            break;
          case 3:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage =
              "Unable to retrieve location. Please enable location services.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setLocationError(errorMessage);
      alert(errorMessage);
      return null;
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Function to retry getting location
  const retryLocation = () => {
    getCurrentLocation();
  };

  const onSubmit = async (values: z.infer<typeof scanSchema>) => {
    if (!model) {
      alert("AI model is still loading. Please wait and try again.");
      return;
    }

    // Check if location is available, if not show modal
    if (!locationData) {
      setShowLocationModal(true);
      return;
    }

    setIsScanning(true);

    // Use current locationData (guaranteed to exist at this point)
    const currentLocation = locationData!;

    try {
      const bananaImage = values.file[0];
      const tensor = await preprocessImage(bananaImage);
      const results = await makePrediction(model, tensor);

      // Check if top result is 'not-banana'
      if (results.length > 0 && results[0].id === "not-banana") {
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

      //Upload Image to Cloudinary
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const imgData = await res.json();
      const imgUrl = imgData.publicUrl;

      // Reverse Geocoding via OpenStreetMap Nominatim API
      const resLocation = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&format=json`,
      );

      const locationInfo = await resLocation.json();

      // Enhanced payload with location data
      const payload = {
        percentage: results[0].percentage,
        resultArr: results,
        result: results[0].id,
        imgUrl,
        address: locationInfo.address,
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          accuracy: currentLocation.accuracy,
          timestamp: currentLocation.timestamp,
        },
      };

      console.log("Payload to be saved:", payload);

      const save = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!save.ok) {
        throw new Error("Failed to save scan data");
      } else {
        console.log("Data saved successfully with location!");
      }
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
    setLocationData(null);
    setLocationError(null);
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

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pt-4"
        >
          {/* Image Input Field */}
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => {
              //React Drop Zone
              const onDrop = useCallback(
                (acceptedFiles: File[]) => {
                  field.onChange(acceptedFiles);
                  if (acceptedFiles[0]) {
                    const imageFile = acceptedFiles[0];
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setPreviewImg(reader.result as string);
                    reader.readAsDataURL(imageFile);
                  }
                },
                [field],
              );

              const { getRootProps, getInputProps, isDragActive } = useDropzone(
                {
                  onDrop,
                  accept: { "image/*": [] },
                  multiple: false,
                },
              );

              return (
                <FormItem>
                  <FormLabel className="text-primary flex flex-col items-start font-semibold">
                    <p>Upload Image</p>
                  </FormLabel>

                  {!previewImg ? (
                    <div className="border-primary/60 space-y-4 rounded-md border px-4 py-4">
                      <p className="text-danger pt-1 text-sm">
                        Note: Only images containing bananas are allowed.
                      </p>

                      {/* Upload/Drag Zone */}
                      <div
                        {...getRootProps()}
                        className="text-primary font- flex flex-col hover:cursor-pointer hover:opacity-70"
                      >
                        <div
                          className={`bg-primary/20 border-primary flex aspect-square max-h-[400px] w-full flex-col items-center justify-center rounded-md border-2 border-dashed py-6 ${
                            isDragActive ? "bg-primary/30" : ""
                          }`}
                        >
                          <MdCloudUpload className="text-8xl" />
                          <p className="text-dark text-base font-medium">
                            {isDragActive
                              ? "Drop the image here..."
                              : "Click or Drag to Upload Image"}
                          </p>
                          <p className="text-primary text-base">
                            JPEG,PNG, SVG
                          </p>
                        </div>

                        <input {...getInputProps()} className="hidden" />
                      </div>

                      <div className="flex items-center gap-2 md:hidden">
                        <hr className="border-primary flex-1" />
                        <p className="text-primary">or</p>
                        <hr className="border-primary flex-1" />
                      </div>

                      {/* Camera Capture Button */}
                      {Capacitor.isNativePlatform() && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={captureFromCamera}
                          disabled={isCapturing}
                          className="border-primary bg-light flex w-full items-center gap-2"
                        >
                          <MdCameraAlt className="text-primary text-xl" />
                          {isCapturing ? "Capturing..." : "Open Camera"}
                        </Button>
                      )}
                    </div>
                  ) : (
                    // Image Preview
                    previewImg && (
                      <div
                        className={`bg-primary/20 border-primary flex aspect-square max-h-[400px] w-full flex-col rounded-md border-2 border-dashed px-4 py-4`}
                      >
                        <div className="relative flex-1 overflow-hidden rounded-md">
                          <NextImage
                            src={previewImg}
                            fill
                            className="object-center"
                            alt="sample"
                            unoptimized
                          />

                          <div
                            className="bg-dark absolute top-0 right-0 z-50 m-2 aspect-square rounded-full p-1 hover:cursor-pointer hover:opacity-70"
                            onClick={() => {
                              setPreviewImg(null);
                              field.onChange([]);
                            }}
                          >
                            <MdClose className="text-light text-lg" />
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <FormMessage className="text-red-600" />
                </FormItem>
              );
            }}
          />

          {/* Location Section */}
          <div className="space-y-3">
            {/* Location Status */}
            {locationData ? (
              <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
                <MdLocationOn className="text-xl text-green-600" />
                <div className="flex-1 text-sm text-green-800">
                  <p className="font-medium">Location recorded</p>
                  <p className="text-xs">
                    {locationData.latitude.toFixed(6)},{" "}
                    {locationData.longitude.toFixed(6)}
                    {locationData.accuracy &&
                      ` (±${Math.round(locationData.accuracy)}m)`}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={retryLocation}
                  disabled={isGettingLocation}
                  className="text-xs"
                >
                  Update
                </Button>
              </div>
            ) : locationError ? (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                <MdLocationOff className="text-xl text-red-600" />
                <div className="flex-1 text-sm text-red-800">
                  <p className="font-medium">Location required</p>
                  <p className="text-xs">{locationError}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={retryLocation}
                  disabled={isGettingLocation}
                  className="text-xs"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 p-3">
                <MdLocationOn className="text-xl text-orange-600" />
                <div className="flex-1 text-sm text-orange-800">
                  <p className="font-medium">Location access needed</p>
                  <p className="text-xs">
                    Location is required for disease tracking and reporting
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="text-xs"
                >
                  {isGettingLocation ? "Getting..." : "Locate"}
                </Button>
              </div>
            )}
          </div>

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
        </form>
      </Form>

      {/* Loader Modal */}
      <LoaderModal
        open={showLoader}
        onClose={() => setShowLoader(false)}
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
      {showLocationModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <MdLocationOn className="text-3xl text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Location Required
              </h2>
            </div>

            <div className="mb-6 text-gray-600">
              <p className="mb-3">
                Location access is required for disease tracking and reporting
                purposes.
              </p>
              <p className="text-sm">
                This helps us monitor banana disease patterns and provide better
                agricultural insights for your area.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleLocationModalGetLocation}
                disabled={isGettingLocation}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                {isGettingLocation ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MdLocationOn className="mr-2" />
                    Enable Location
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleLocationModalClose}
                disabled={isGettingLocation}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            {locationError && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{locationError}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

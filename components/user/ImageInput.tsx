// components/ImageInput.tsx
import { useCallback } from "react";
import NextImage from "next/image";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Camera,
  X,
  Image as ImageIcon,
  CheckCircle2,
  CircleX,
  Ban,
  CircleAlert,
} from "lucide-react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useCamera from "@/hooks/useCamera";
import { isNative } from "@/lib/constant";

interface ImageInputProps {
  previewImg: string | null;
  onImageChange: (files: File[], previewUrl: string | null) => void;
  onPreviewChange: (url: string | null) => void;
}

function ImageInput({
  previewImg,
  onImageChange,
  onPreviewChange,
}: ImageInputProps) {
  const { isCapturing, cameraCapture, isNativePlatform } = useCamera();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        const imageFile = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const previewUrl = reader.result as string;
          onPreviewChange(previewUrl);
          onImageChange(acceptedFiles, previewUrl);
        };
        reader.readAsDataURL(imageFile);
      }
    },
    [onImageChange, onPreviewChange],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
      maxSize: 10 * 1024 * 1024, // 10MB limit
    });

  const handleCameraCapture = async () => {
    const result = await cameraCapture();
    if (result) {
      onPreviewChange(result.previewUrl);
      onImageChange([result.file], result.previewUrl);
    }
  };

  const clearImage = () => {
    onPreviewChange(null);
    onImageChange([], null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <FormItem className="space-y-0">
      <div className="flex items-center justify-between">
        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <ImageIcon className="h-4 w-4" />
          Upload Image
        </FormLabel>
        {previewImg && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Image loaded
          </Badge>
        )}

        {fileRejections.length > 0 && (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <CircleX className="mr-1 h-3 w-3" />
            Unsupported File Type
          </Badge>
        )}
      </div>

      {!previewImg ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50">
          <CardContent className="p-0">
            {/* Error handling */}
            {fileRejections.length > 0 ? (
              <div className="mx-6 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                <Ban className="h-5 w-5 text-red-500" />
                <p className="text-sm font-medium text-red-800">
                  Oops!{" "}
                  {fileRejections.map(({ file, errors }) => (
                    <span key={file.name} className="text-primary">
                      {file.name}
                    </span>
                  ))}{" "}
                  isn't supported. Please upload an image file instead.{" "}
                </p>
              </div>
            ) : (
              //  Warning Alert
              <div className="mx-6 flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 p-3">
                <div className="flex items-center gap-2">
                  <CircleAlert className="h-5 w-5 text-orange-500" />
                  <p className="text-sm font-medium text-orange-800">
                    Important: Only upload clear image of banana only
                  </p>
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Upload/Drag Zone */}
              <div
                {...getRootProps()}
                className={`group relative cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "scale-[1.02] transform"
                    : "hover:scale-[1.01] hover:transform"
                }`}
              >
                <div
                  className={`flex aspect-square max-h-[350px] w-full flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 transition-all duration-300 ${
                    isDragActive
                      ? "border-green-400 bg-green-50 shadow-lg"
                      : "border-gray-300 bg-white group-hover:border-green-400 group-hover:bg-green-50/50"
                  } `}
                >
                  {/* Upload Icon */}
                  <div
                    className={`mb-4 rounded-full p-4 transition-all duration-300 ${
                      isDragActive
                        ? "scale-110 bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500 group-hover:scale-110 group-hover:bg-green-100 group-hover:text-green-600"
                    } `}
                  >
                    <Upload className="h-8 w-8" />
                  </div>

                  {/* Upload Text */}
                  <div className="space-y-2 text-center">
                    <h3
                      className={`text-lg font-semibold transition-colors duration-300 ${
                        isDragActive
                          ? "text-primary"
                          : "group-hover:text-primary text-gray-700"
                      }`}
                    >
                      {isDragActive
                        ? "Drop your image here"
                        : "Upload banana image"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Click to browse or drag and drop
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 text-xs text-gray-400">
                      <span>JPEG,</span>
                      <span>PNG,</span>
                      <span>WEBP</span>
                      <span>• Max 10MB</span>
                    </div>
                  </div>

                  {/* Subtle gradient overlay */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                      isDragActive
                        ? "bg-gradient-to-br from-green-400/10 to-green-600/10 opacity-100"
                        : "bg-gradient-to-br from-gray-400/5 to-gray-600/5 opacity-0 group-hover:opacity-100"
                    } `}
                  />
                </div>
                <input {...getInputProps()} className="hidden" />
              </div>

              {/* Camera Option for Mobile */}
              {isNative && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <hr className="flex-1 border-gray-200" />
                    <span className="text-sm font-medium text-gray-500">
                      or
                    </span>
                    <hr className="flex-1 border-gray-200" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCameraCapture}
                    disabled={isCapturing}
                    className="text-primary border-primary w-full bg-white transition-all duration-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {isCapturing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                        Capturing...
                      </>
                    ) : (
                      "Take Photo"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Image Preview
        <Card className="border-primary bg-primary/20 overflow-hidden border-2">
          <CardContent className="p-4">
            <div className="relative aspect-square max-h-[350px] w-full overflow-hidden rounded-xl bg-white shadow-inner">
              <NextImage
                src={previewImg}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                alt="Preview of uploaded banana image"
                unoptimized
              />

              {/* Remove button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-red-600/40 p-0 shadow-lg transition-transform duration-200 hover:scale-110"
                onClick={clearImage}
              >
                <X className="h-4 w-4 text-white" />
              </Button>

              {/* Image info overlay */}
              <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                Image ready
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <FormMessage className="text-red-600" />
    </FormItem>
  );
}

export default ImageInput;

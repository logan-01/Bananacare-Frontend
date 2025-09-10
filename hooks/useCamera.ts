import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

export default function useCamera() {
  const [isCapturing, setIsCapturing] = useState(false);

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

  const cameraCapture = async (): Promise<{
    file: File;
    previewUrl: string;
  } | null> => {
    try {
      setIsCapturing(true);

      if (!Capacitor.isNativePlatform()) {
        alert("Camera capture is only available on mobile devices.");
        return null;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        const file = base64ToFile(
          image.dataUrl,
          `camera_capture_${Date.now()}.jpg`,
        );

        return {
          file,
          previewUrl: image.dataUrl,
        };
      }

      return null;
    } catch (error) {
      console.error("Error capturing photo:", error);
      alert("Failed to capture photo. Please try again.");
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    isCapturing,
    cameraCapture,
    isNativePlatform: Capacitor.isNativePlatform(),
  };
}

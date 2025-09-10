import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export default function useLocation() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setIsGettingLocation(true);
      setLocationError(null);

      let coordinates;

      if (Capacitor.isNativePlatform()) {
        coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
      } else {
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
      return null;
    } finally {
      setIsGettingLocation(false);
    }
  };

  const resetLocation = () => {
    setLocationData(null);
    setLocationError(null);
  };

  return {
    locationData,
    isGettingLocation,
    locationError,
    getCurrentLocation,
    resetLocation,
  };
}

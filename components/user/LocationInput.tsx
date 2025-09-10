import { MdLocationOn, MdLocationOff } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationInputProps {
  locationData: LocationData | null;
  locationError: string | null;
  isGettingLocation: boolean;
  onGetLocation: () => void;
  onRetryLocation: () => void;
}

function LocationInput({
  locationData,
  locationError,
  isGettingLocation,
  onGetLocation,
  onRetryLocation,
}: LocationInputProps) {
  if (locationData) {
    return (
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
          onClick={onRetryLocation}
          disabled={isGettingLocation}
          className="text-xs"
        >
          Update
        </Button>
      </div>
    );
  }

  if (locationError) {
    return (
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
          onClick={onRetryLocation}
          disabled={isGettingLocation}
          className="text-xs"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
      <MdLocationOn className="text-xl text-red-600" />
      <div className="flex-1 text-sm text-red-800">
        <p className="font-medium">Location access needed</p>
        <p className="text-xs">
          Location is required for disease tracking & reporting
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onGetLocation}
        disabled={isGettingLocation}
        className="text-xs"
      >
        {isGettingLocation ? "Getting..." : "Locate"}
      </Button>
    </div>
  );
}

export default LocationInput;

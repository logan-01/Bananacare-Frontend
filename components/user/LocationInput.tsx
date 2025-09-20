import { MdLocationOn, MdLocationOff } from "react-icons/md";
import {
  CheckCircle2,
  CircleX,
  MapPin,
  MapPinCheck,
  MapPinX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

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
  return (
    <div className="space-y-1 rounded-md border-2 border-gray-300 p-4">
      <div className="flex items-center gap-2 py-1">
        <div className="flex flex-1 items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="font-semibold">Set Location</span>
        </div>

        {locationData && (
          <Badge variant="secondary" className="bg-primary/5 text-primary">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Located
          </Badge>
        )}

        {locationError && (
          <Badge variant="secondary" className="bg-danger/5 text-danger">
            <CircleX className="mr-1 h-3 w-3" />
            Not Found
          </Badge>
        )}

        {/* {!locationData && !locationError && (
          <Badge variant="secondary" className="bg-normal/5 text-normal">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Required
          </Badge>
        )} */}
      </div>

      {/* Location Update */}
      {locationData && (
        <div className="bg-primary/5 border-primary/20 flex items-center gap-2 rounded-md border p-3">
          <MapPinCheck className="text-primary text-xl" />
          <div className="text-primary flex-1 text-sm">
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
            // variant="outline"
            size="sm"
            onClick={onRetryLocation}
            disabled={isGettingLocation}
            className="border-primary/60 bg-primary text-light hover:bg-primary/80 border text-xs hover:cursor-pointer"
          >
            Update
          </Button>
        </div>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="bg-danger/5 border-danger/20 flex items-center gap-2 rounded-md border p-3">
          <MapPinX className="text-danger text-xl" />
          <div className="text-danger flex-1 text-sm">
            <p className="font-medium">Location required</p>
            <p className="text-xs">{locationError}</p>
          </div>
          <Button
            type="button"
            // variant="outline"
            size="sm"
            onClick={onRetryLocation}
            disabled={isGettingLocation}
            className="border-danger/60 bg-danger text-light hover:bg-danger/80 border text-xs hover:cursor-pointer"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Location Required */}
      {!locationData && !locationError && (
        <div className="border-normal/20 bg-normal/5 flex items-center gap-2 rounded-md border p-3">
          <MapPin className="text-normal text-xl" />
          <div className="text-normal flex-1 text-sm">
            <p className="font-medium">Location access needed</p>
            <p className="text-xs">
              Location is required for disease tracking & reporting
            </p>
          </div>
          <Button
            type="button"
            // variant="outline"
            size="sm"
            onClick={onGetLocation}
            disabled={isGettingLocation}
            className="border-normal/60 bg-normal text-light hover:bg-normal/80 border text-xs hover:cursor-pointer"
          >
            {isGettingLocation ? "Getting..." : "Locate"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default LocationInput;

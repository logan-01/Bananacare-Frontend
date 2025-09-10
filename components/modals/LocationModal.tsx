import React from "react";
import { MdLocationOn } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onGetLocation: () => void;
  isGettingLocation: boolean;
  locationError: string | null;
}

function LocationModal({
  open,
  onClose,
  onGetLocation,
  isGettingLocation,
  locationError,
}: LocationModalProps) {
  if (!open) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center rounded-md bg-black/80">
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
            onClick={onGetLocation}
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
            onClick={onClose}
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
  );
}

export default LocationModal;

"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformWrapper from "../wrapper/PlatformWrapper";

import { isNative, BananaDiseaseType } from "@/lib/constant";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteTitle?: string;
  deleteDescription?: string;
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  deleteTitle = "Delete Scan Result?",
  deleteDescription = "This action cannot be undone. The scan result and all related data  will be permanently removed.",
}: DeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <PlatformWrapper
      open={isOpen}
      onOpenChange={onClose}
      title={""}
      nativeTitleClass="text-left"
      showHeader={false}
      size="sm"
    >
      <div className="">
        {/* Header with icon */}
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-danger/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
            <AlertTriangle className="text-danger h-7 w-7" />
          </div>
          <div className="text-danger flex-1">
            <h2 className="text-foreground text-lg font-semibold">
              {deleteTitle}
            </h2>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-muted-foreground text-sm">{deleteDescription}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="bg-dark text-light flex-1 hover:cursor-pointer hover:opacity-70"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-danger text-light hover:bg-danger flex-1 hover:cursor-pointer hover:opacity-70"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </PlatformWrapper>
  );
};

export default DeleteModal;

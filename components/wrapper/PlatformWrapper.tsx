"use client";

import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { isNative } from "@/lib/constant";

interface PlatformWrapperProps {
  // Modal-specific props (used on web)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  description?: React.ReactNode;

  // Stack-specific props (used on native)
  onBack?: () => void;
  showBackButton?: boolean;

  // Common props
  title?: string;
  nativeTitleClass?: string;
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
}

const PlatformWrapper: React.FC<PlatformWrapperProps> = ({
  open,
  onOpenChange,
  trigger,
  title = "Modal",
  size = "md",
  className = "bg-light",
  onBack,
  showBackButton = true,
  children,
  nativeTitleClass = "text-left",
  showHeader = true,
  description = "dummy",
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Modal logic for web
  if (!isNative) {
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    const sizeClasses = {
      sm: "md:min-w-[25vw]",
      md: "md:min-w-[48vw]",
      lg: "md:min-w-[65vw]",
      xl: "md:min-w-[80vw]",
      full: "md:min-w-[95vw]",
    };

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
        <AlertDialogContent
          className={`flex max-h-[96vh] flex-col overflow-hidden border-none ${sizeClasses[size]} md:px-10 ${className}`}
        >
          <AlertDialogTitle
            className={`sticky top-0 flex items-center bg-white ${!showHeader ? "sr-only" : ""}`}
          >
            <p className="flex-1">{title}</p>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              ✕
            </button>
          </AlertDialogTitle>

          {/* ✅ only render if description is provided */}
          {description && (
            <AlertDialogDescription className="mb-2 hidden text-sm text-gray-500">
              {description}
            </AlertDialogDescription>
          )}

          <div className="flex-1 overflow-y-auto">{children}</div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Stack logic for native
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleBack = () => {
    setIsOpen(false);
    if (onBack) {
      onBack();
    }
  };

  return (
    <>
      {/* Trigger button for native */}
      {trigger && <div onClick={() => setIsOpen(true)}>{trigger}</div>}

      {/* Stack overlay - only show when open */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-[999] flex min-h-screen w-screen flex-1 flex-col ${isNative ? "pb-20" : ""} ${className}`}
        >
          {showHeader && (
            <div className="text-primary flex items-center gap-4 px-4 py-4 font-semibold shadow-sm">
              {showBackButton && (
                <MdArrowBack
                  className="cursor-pointer text-xl hover:cursor-pointer hover:opacity-70"
                  onClick={handleBack}
                />
              )}
              <p className={nativeTitleClass}>{title}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </div>
      )}
    </>
  );
};

export default PlatformWrapper;

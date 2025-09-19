"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RiSparklingLine } from "react-icons/ri";
import { isNative } from "@/lib/constant";

const AdminButton = () => {
  const [tapCount, setTapCount] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  // Show toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Reset tap count after 2 seconds of inactivity
  const resetTapCount = useCallback(() => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);
  }, []);

  // Handle logo click (count taps)
  const handleLogoClick = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount === 1) {
      showToastMessage("Keep going… 2 taps away");
    } else if (newTapCount === 2) {
      showToastMessage("Almost there… 1 tap left");
    } else if (newTapCount === 3) {
      showToastMessage("Admin unlocked! Long press to proceed");
    } else if (newTapCount > 3) {
      // Reset if more than 3 taps
      setTapCount(0);
    }

    resetTapCount();
  };

  // Trigger admin redirect
  const triggerAdminAccess = () => {
    router.push("/admin"); // 🚀 Redirect to /admin
    setTapCount(0);
    setIsLongPressing(false);
  };

  // Pointer events (unified for mouse, touch, stylus)
  const handlePointerDown = () => {
    if (tapCount === 3) {
      setIsLongPressing(true);
      longPressTimeoutRef.current = setTimeout(triggerAdminAccess, 1000);
    }
  };

  const handlePointerUp = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
    setIsLongPressing(false);
  };

  return (
    <div>
      {/* Button Trigger*/}
      <div
        className={`relative cursor-pointer transition-all duration-200 select-none ${tapCount > 0 ? "animate-pulse" : ""} ${
          isLongPressing ? "scale-95 opacity-70" : ""
        } ${!isNative ? "pointer-events-none" : ""}`}
        onClick={handleLogoClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
          <RiSparklingLine className="h-4 w-4" />
          <span>AI-Powered Disease Detection</span>
        </div>

        {/* Long press indicator */}
        {isLongPressing && (
          <div className="border-primary absolute inset-0 animate-pulse rounded-full border-2"></div>
        )}
      </div>

      {/* Toast Message */}
      <div
        className={`fixed bottom-[calc(6rem+1.5rem)] left-1/2 z-40 -translate-x-1/2 transform transition-all duration-300 ease-in-out ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-primary/20 text-light max-w-sm rounded-lg px-6 py-3 text-center whitespace-nowrap shadow-lg">
          <p className="text-sm">{toastMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminButton;

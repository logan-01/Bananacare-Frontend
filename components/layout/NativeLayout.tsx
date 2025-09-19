"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import BottomNav from "@/components/user/BottomNav";
import CapacitorStatusBar from "../user/CapacitorStatusBar";

interface NativeLayoutProps {
  home: React.ReactNode;
  disease: React.ReactNode;
  contact: React.ReactNode;
  about: React.ReactNode;
}

type TabType = "home" | "disease" | "about" | "contact" | "scan";

const tabs: TabType[] = ["home", "disease", "about", "contact"];

function NativeLayout({ home, disease, contact, about }: NativeLayoutProps) {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get("tab") as TabType;
    return tab && tabs.includes(tab) ? tab : "home";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );

  const components = {
    home,
    disease,
    about,
    contact,
    scan: <div>Scan page coming soon...</div>,
  };

  const handleTabChange = async (newTab: TabType) => {
    if (newTab === activeTab || isTransitioning) return;

    setIsTransitioning(true);
    setSwipeProgress(0);
    setSwipeDirection(null);

    // Smooth transition delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    setActiveTab(newTab);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "home") {
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);

    // Reset transition state
    setTimeout(() => setIsTransitioning(false), 350);
  };

  // Enhanced swipe handlers with progress tracking
  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      const { deltaX, dir } = eventData;
      const containerWidth = containerRef.current?.clientWidth || 375;
      const progress = Math.abs(deltaX) / containerWidth;

      setSwipeProgress(Math.min(progress, 0.3)); // Max 30% visual feedback
      setSwipeDirection(
        dir === "Left" ? "left" : dir === "Right" ? "right" : null,
      );
    },
    onSwipedLeft: () => {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        handleTabChange(tabs[currentIndex + 1]);
      } else {
        // Reset if at end
        setSwipeProgress(0);
        setSwipeDirection(null);
      }
    },
    onSwipedRight: () => {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        handleTabChange(tabs[currentIndex - 1]);
      } else {
        // Reset if at beginning
        setSwipeProgress(0);
        setSwipeDirection(null);
      }
    },
    onTouchEndOrOnMouseUp: () => {
      // Reset swipe progress when touch ends
      setSwipeProgress(0);
      setSwipeDirection(null);
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    trackTouch: true,
    delta: 10,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  });

  // Get current tab index for navigation indicators
  const currentTabIndex = tabs.indexOf(activeTab);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Status Bar for Safe Area  */}
      <CapacitorStatusBar />

      {/* Content area with enhanced transitions */}
      <div
        {...swipeHandlers}
        ref={containerRef}
        className="relative flex flex-1 overflow-hidden"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab;
          const isPrev = index === currentTabIndex - 1;
          const isNext = index === currentTabIndex + 1;

          // Calculate transform based on swipe progress
          let transform = "translateX(100%)";
          let opacity = 0;
          let scale = 0.95;

          if (isActive) {
            const swipeOffset =
              swipeDirection === "left"
                ? -swipeProgress * 100
                : swipeDirection === "right"
                  ? swipeProgress * 100
                  : 0;
            transform = `translateX(${swipeOffset}%)`;
            opacity = 1;
            scale = 1 - swipeProgress * 0.05;
          } else if (isPrev && swipeDirection === "right") {
            transform = `translateX(${-100 + swipeProgress * 100}%)`;
            opacity = swipeProgress;
            scale = 0.95 + swipeProgress * 0.05;
          } else if (isNext && swipeDirection === "left") {
            transform = `translateX(${100 - swipeProgress * 100}%)`;
            opacity = swipeProgress;
            scale = 0.95 + swipeProgress * 0.05;
          } else if (index < currentTabIndex) {
            transform = "translateX(-100%)";
          }

          return (
            <div
              key={tab}
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                isActive ? "z-10" : "z-0"
              }`}
              style={{
                transform: `${transform} scale(${scale})`,
                opacity: opacity,
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <div className="h-full w-full overflow-y-auto">
                {components[tab]}
              </div>
            </div>
          );
        })}

        {/* Loading overlay */}
        {isTransitioning && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2"></div>
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onChangeTab={handleTabChange} />
    </div>
  );
}

export default NativeLayout;

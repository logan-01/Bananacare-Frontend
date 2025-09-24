"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
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

  // Touch tracking refs
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get("tab") as TabType;
    return tab && tabs.includes(tab) ? tab : "home";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const components = {
    home,
    disease,
    about,
    contact,
    scan: <div>Scan page coming soon...</div>,
  };

  const handleTabChange = (newTab: TabType) => {
    if (newTab === activeTab || isTransitioning) return;

    setIsTransitioning(true);
    setSwipeProgress(0);

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
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Native touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;

    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isTransitioning) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Determine if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isDragging.current = true;
      e.preventDefault(); // Prevent scrolling

      const containerWidth = containerRef.current?.clientWidth || 375;
      const progress = Math.min(Math.abs(deltaX) / containerWidth, 0.3);
      setSwipeProgress(progress);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isTransitioning || !isDragging.current) {
      setSwipeProgress(0);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const threshold = 50; // Minimum swipe distance

    const currentIndex = tabs.indexOf(activeTab);

    if (deltaX > threshold && currentIndex > 0) {
      // Swipe right - go to previous tab
      handleTabChange(tabs[currentIndex - 1]);
    } else if (deltaX < -threshold && currentIndex < tabs.length - 1) {
      // Swipe left - go to next tab
      handleTabChange(tabs[currentIndex + 1]);
    } else {
      // Reset if swipe wasn't far enough
      setSwipeProgress(0);
    }

    isDragging.current = false;
  };

  const currentTabIndex = tabs.indexOf(activeTab);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <CapacitorStatusBar />

      <div
        ref={containerRef}
        className="relative flex flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: "pan-y",
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab;

          let transform = "translateX(100%)";
          let opacity = 0;

          if (isActive) {
            // Show swipe feedback only during drag
            if (isDragging.current && swipeProgress > 0) {
              const direction =
                touchStartX.current >
                (containerRef.current?.clientWidth || 0) / 2
                  ? 1
                  : -1;
              transform = `translateX(${direction * swipeProgress * -30}%)`;
            } else {
              transform = "translateX(0%)";
            }
            opacity = 1;
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
                transform,
                opacity,
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <div className="h-full w-full overflow-y-auto">
                {components[tab]}
              </div>
            </div>
          );
        })}

        {/* Transition overlay */}
        {isTransitioning && (
          <div className="pointer-events-none absolute inset-0 z-20 bg-transparent" />
        )}
      </div>

      <BottomNav activeTab={activeTab} onChangeTab={handleTabChange} />
    </div>
  );
}

export default NativeLayout;

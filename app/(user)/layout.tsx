"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/user/Navbar";
import BottomNav from "@/components/user/BottomNav";
import Footer from "@/components/user/Footer";
import ScanButton from "@/components/user/ScanButton";

import { isNative } from "@/lib/constant";

function UserLayout({
  auth,
  home,
  disease,
  contact,
  about,
  scan,
}: {
  auth: React.ReactNode;
  home: React.ReactNode;
  disease: React.ReactNode;
  contact: React.ReactNode;
  about: React.ReactNode;
  scan: React.ReactNode;
}) {
  // useEffect(() => {
  //   if (window.location.hash === "#_=_") {
  //     // Remove the fragment
  //     history.replaceState(null, "", window.location.pathname);
  //   }
  // }, []);

  // Track Zctive Tab (only used in native mode)
  const [activeTab, setActiveTab] = useState<
    "home" | "disease" | "about" | "contact" | "scan"
  >("home");

  return (
    <>
      {!isNative ? (
        //Web Layout
        <div className="flex h-full flex-1 flex-col">
          <Navbar />
          {home}
          {disease}
          {about}
          {contact}
          <Footer />
          <ScanButton />
        </div>
      ) : (
        //Native Layout
        <div className="flex h-screen flex-col">
          <div className="flex flex-1">
            {activeTab === "home" && home}
            {activeTab === "disease" && disease}
            {activeTab === "about" && about}
            {activeTab === "contact" && contact}
          </div>
          <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
        </div>
      )}
    </>
  );
}

export default UserLayout;

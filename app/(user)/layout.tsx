"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/user/Navbar";
import BottomNav from "@/components/user/BottomNav";
import Footer from "@/components/user/Footer";
import ScanActionButton from "@/components/user/ScanActionButton";

import { Capacitor } from "@capacitor/core";

function UserLayout({
  auth,
  home,
  disease,
  contact,
  about,
}: {
  auth: React.ReactNode;
  home: React.ReactNode;
  disease: React.ReactNode;
  contact: React.ReactNode;
  about: React.ReactNode;
}) {
  useEffect(() => {
    if (window.location.hash === "#_=_") {
      // Remove the fragment
      history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="flex h-full flex-1 flex-col">
      <Navbar />

      {Capacitor.isNativePlatform() && <BottomNav />}

      <ScanActionButton />

      {auth}
      {home}
      {disease}
      {about}
      {contact}
      <Footer />
    </div>
  );
}

export default UserLayout;

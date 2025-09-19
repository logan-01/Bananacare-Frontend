import React from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import ScanButton from "@/components/user/ScanButton";

interface WebLayoutProps {
  home: React.ReactNode;
  disease: React.ReactNode;
  contact: React.ReactNode;
  about: React.ReactNode;
}

function WebLayout({ home, disease, contact, about }: WebLayoutProps) {
  return (
    <div className="flex h-full flex-1 flex-col">
      <Navbar />
      {home}
      {disease}
      {about}
      {contact}
      <Footer />
      <ScanButton />
    </div>
  );
}

export default WebLayout;

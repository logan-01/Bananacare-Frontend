"use client";

import React from "react";
import { isNative } from "@/lib/constant";
import NativeLayout from "@/components/layout/NativeLayout";
import WebLayout from "@/components/layout/WebLayout";

import { useState, useEffect } from "react";
import Loader from "@/components/wrapper/Loader";

interface UserLayoutProps {
  home: React.ReactNode;
  disease: React.ReactNode;
  contact: React.ReactNode;
  about: React.ReactNode;
}

function UserLayout({ home, disease, contact, about }: UserLayoutProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!isNative ? (
        <WebLayout
          home={home}
          disease={disease}
          about={about}
          contact={contact}
        />
      ) : (
        <NativeLayout
          home={home}
          disease={disease}
          about={about}
          contact={contact}
        />
      )}
    </>
  );
}

export default UserLayout;

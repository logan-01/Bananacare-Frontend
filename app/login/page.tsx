"use client";

import React, { useEffect } from "react";
import LoginForm from "@/components/user/LoginForm";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/wrapper/Loader";
import { isNative } from "@/lib/constant";

function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="bg-light bg-image flex h-screen items-center justify-center">
        <div
          className={`bg-light z-50 flex flex-col overflow-y-auto rounded-lg border border-gray-300 px-6 py-6 shadow-xl md:w-[40vw] md:px-10 ${isNative ? "h-screen max-h-[100vh] w-[100vw]" : "h-fit max-h-[95vh] w-[90vw]"}`}
        >
          <LoginForm type="full" />
        </div>
      </div>
    );
  }
}

export default LoginPage;

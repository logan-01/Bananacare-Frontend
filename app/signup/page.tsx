"use client";

import React, { useEffect } from "react";
import SignupForm from "@/components/user/SignupForm";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/wrapper/Loader";
import { isNative } from "@/lib/constant";

function SignupPage() {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-light bg-image flex h-screen items-center justify-center">
        <div
          className={`bg-light z-50 flex flex-col overflow-y-auto rounded-lg border border-gray-300 px-6 py-6 shadow-xl md:w-[40vw] md:px-10 ${isNative ? "h-[100vh] max-h-[100vh] w-[100vw]" : "h-[100vh] max-h-[95vh] w-[95vw]"}`}
        >
          <SignupForm type="full" />
        </div>
      </div>
    );
  }
}

export default SignupPage;

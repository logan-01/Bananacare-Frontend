"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  MdVisibility,
  MdVisibilityOff,
  MdEmail,
  MdLock,
  MdPerson,
} from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/zod";
import Link from "next/link";

function SignupForm({ type = "full" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // async function onSubmit(values: z.infer<typeof signUpSchema>) {
  //   setError(null);
  //   setLoading(true);

  //   try {
  //     const result: { ok: boolean; error?: string } =
  //       await handleSignup(values);

  //     if (result.ok) {
  //       if (type === "modal") {
  //         router.push("/login");
  //       } else {
  //         window.location.href = "/login";
  //       }
  //     } else {
  //       setError(
  //         result.error || "An error occurred during signup. Please try again.",
  //       );
  //     }
  //   } catch (err) {
  //     setError("Network error. Please check your connection and try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log("A Dummy Signup");
  }

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="mb-6">
          {/* Logo or Icon placeholder */}
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <MdPerson className="text-primary h-8 w-8" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Create Account
        </h1>
        <p className="text-sm leading-relaxed text-gray-600">
          Join us to access all features and personalize your experience
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MdPerson className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your full name"
                      disabled={loading}
                      className="focus:border-primary focus:ring-primary h-12 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder-gray-500 transition-colors duration-200"
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-1 text-sm text-red-600" />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MdEmail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      disabled={loading}
                      className="focus:border-primary focus:ring-primary h-12 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder-gray-500 transition-colors duration-200"
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-1 text-sm text-red-600" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MdLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      {...field}
                      type={showPassword.password ? "text" : "password"}
                      placeholder="Create a password"
                      disabled={loading}
                      className="focus:border-primary focus:ring-primary h-12 rounded-lg border-gray-300 pr-12 pl-10 text-gray-900 placeholder-gray-500 transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("password")}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors duration-200 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPassword.password ? (
                        <MdVisibilityOff className="h-5 w-5" />
                      ) : (
                        <MdVisibility className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="mt-1 text-sm text-red-600" />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-sm font-semibold text-gray-700">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MdLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      {...field}
                      type={showPassword.confirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      disabled={loading}
                      className="focus:border-primary focus:ring-primary h-12 rounded-lg border-gray-300 pr-12 pl-10 text-gray-900 placeholder-gray-500 transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      disabled={loading}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors duration-200 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPassword.confirmPassword ? (
                        <MdVisibilityOff className="h-5 w-5" />
                      ) : (
                        <MdVisibility className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="mt-1 text-sm text-red-600" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 mt-4 h-12 w-full transform rounded-lg font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Requesting Account...
              </div>
            ) : (
              "Request Account"
            )}
          </Button>
        </form>
      </Form>

      {/* Login Link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          {type === "modal" ? (
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
            >
              Sign in here
            </Link>
          ) : (
            <button
              onClick={() => (window.location.href = "/login")}
              className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
            >
              Sign in here
            </button>
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 hidden text-center">
        <p className="text-sm text-gray-500">Detect Banana Disease with Ease</p>
      </div>
    </div>
  );
}

export default SignupForm;

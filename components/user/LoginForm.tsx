"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock } from "react-icons/md";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-config"; // You'll need to create this
import { useAuth } from "@/hooks/useAuth"; // You'll need to create this

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
import { loginSchema } from "@/lib/zod";

function LoginForm({ type = "full" }) {
  const router = useRouter();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      // Optional: Check if user is admin (you can add custom claims or check email domain)
      const user = userCredential.user;
      console.log("Signed in user:", user.email);

      // Redirect to admin page
      router.push("/admin");
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle specific Firebase Auth errors
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;
        case "auth/wrong-password":
          setError("Invalid email or password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled. Please contact support.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed login attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError(
            "Network error. Please check your connection and try again.",
          );
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="mb-6">
          {/* Logo or Icon placeholder */}
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <MdLock className="text-primary h-8 w-8" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Welcome Back <span className="text-primary">Admin</span>
        </h1>
        <p className="text-sm leading-relaxed text-gray-600">
          Sign in to your admin account to continue
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

      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      className="focus:border-primary focus:ring-primary h-12 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus-visible:ring-1"
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      disabled={loading}
                      className="focus:border-primary focus:ring-primary h-12 rounded-lg border-gray-300 pr-12 pl-10 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus-visible:ring-1"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors duration-200 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPassword ? (
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
            className="bg-primary hover:bg-primary/90 h-12 w-full transform rounded-lg font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
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
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Detect Banana Disease with Ease</p>
      </div>
    </div>
  );
}

export default LoginForm;

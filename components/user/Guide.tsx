"use client";

import React, { useState } from "react";
import {
  Camera,
  CheckCircle,
  XCircle,
  Info,
  Sun,
  Smartphone,
  Zap,
  Eye,
} from "lucide-react";
import Image from "next/image";

const Guide = () => {
  const [activeTab, setActiveTab] = useState("basics");

  const goodExamples = [
    {
      title: "Close-up of Banana Leaf",
      description: "Clear view of leaf surface with good lighting",
      tips: ["Fill the frame", "Sharp focus", "Natural lighting"],
      imgUrl: "/img/Banana-Close-Up.jpg", // banana leaf close-up
    },
    {
      title: "Banana Bunch",
      description: "Well-lit banana cluster showing clear details",
      tips: ["Avoid shadows", "Steady hands", "Multiple angles"],
      imgUrl: "/img/Banana-Bunch.jpg", // banana bunch
    },
    {
      title: "Disease Spots",
      description: "Clear visibility of affected areas",
      tips: ["Macro mode", "Consistent lighting", "Multiple shots"],
      imgUrl: "/img/Banana-Disease-Spots.jpg",
    },
  ];

  const badExamples = [
    {
      title: "Blurry Images",
      description: "Out of focus or motion blur",
      solution: "Use steady hands or tripod",
      imgUrl: "/img/Banana-Blurry.jpg",
    },
    {
      title: "Poor Lighting",
      description: "Too dark or harsh shadows",
      solution: "Use natural light or soft flash",
      imgUrl: "/img/Banana-Poor-Lighting.jpg",
    },
    {
      title: "Wrong Subject",
      description: "Other plants or irrelevant objects",
      solution: "Focus only on banana plants",
      imgUrl: "/img/Banana-Wrong.jpg",
    },
  ];

  const captureSteps = [
    {
      icon: <Sun className="h-6 w-6" />,
      title: "Find Good Lighting",
      description:
        "Use natural daylight or soft, even artificial lighting. Avoid harsh shadows and direct sunlight.",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Position Yourself",
      description:
        "Get close enough to fill the frame with the banana plant part you want to analyze.",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Hold Steady",
      description:
        "Keep your phone stable. Use both hands and brace against a stable surface if needed.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Focus & Capture",
      description:
        "Tap to focus on the subject, wait for the focus indicator, then capture multiple shots.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="">
        {/* Navigation Tabs */}
        <div className="mb-8 rounded-lg bg-white">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: "basics", label: "Basics", icon: Info },
                { id: "examples", label: "Examples", icon: Eye },
                { id: "steps", label: "Step by Step", icon: Zap },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 border-b-2 py-4 text-sm font-medium ${
                    activeTab === id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="py-4">
            {/* Basics Tab */}
            {activeTab === "basics" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    How to Capture Perfect Banana Images
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-gray-600">
                    Follow these guidelines to ensure accurate disease detection
                    for your banana plants.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {/* What to Capture */}
                  <div className="rounded-lg bg-green-50 p-6">
                    <h3 className="mb-4 flex items-center text-xl font-semibold text-green-800">
                      <CheckCircle className="mr-2 h-6 w-6" />
                      What to Capture
                    </h3>
                    <ul className="space-y-3 text-green-700">
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                        <span>Banana leaves (front and back surfaces)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                        <span>Banana fruits and bunches</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                        <span>Banana tree trunk and pseudostem</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                        <span>Close-ups of suspected disease spots</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                        <span>Overall plant health condition</span>
                      </li>
                    </ul>
                  </div>

                  {/* What to Avoid */}
                  <div className="rounded-lg bg-red-50 p-6">
                    <h3 className="mb-4 flex items-center text-xl font-semibold text-red-800">
                      <XCircle className="mr-2 h-6 w-6" />
                      What to Avoid
                    </h3>
                    <ul className="space-y-3 text-red-700">
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                        <span>Other plants or trees in the frame</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                        <span>Blurry or out-of-focus images</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                        <span>Images with poor lighting or shadows</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                        <span>Too much background clutter</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                        <span>Images taken from too far away</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Key Tips */}
                <div className="rounded-lg bg-yellow-50 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-yellow-800">
                    💡 Key Tips for Best Results
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-200">
                        <Sun className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold text-yellow-800">
                        Good Lighting
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700">
                        Natural light works best
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-200">
                        <Eye className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold text-yellow-800">
                        Sharp Focus
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700">
                        Tap to focus before shooting
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-200">
                        <Camera className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold text-yellow-800">
                        Multiple Shots
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700">
                        Take several photos for accuracy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Examples Tab */}
            {activeTab === "examples" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Good vs Bad Examples
                  </h2>
                  <p className="text-gray-600">
                    Learn from these examples to improve your image capture
                    technique
                  </p>
                </div>

                {/* Good Examples */}
                <div>
                  <h3 className="mb-4 flex items-center text-xl font-semibold text-green-800">
                    <CheckCircle className="mr-2 h-6 w-6" />✅ Good Examples
                  </h3>
                  <div className="flex flex-col gap-6">
                    {goodExamples.map((example, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-green-200 bg-green-50 p-4"
                      >
                        {/* Images */}
                        <div className="relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-green-100">
                          <Image
                            src={example.imgUrl}
                            alt={example.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <h4 className="mb-2 font-semibold text-green-800">
                          {example.title}
                        </h4>
                        <p className="mb-3 text-sm text-green-700">
                          {example.description}
                        </p>
                        <div className="space-y-1">
                          {example.tips.map((tip, tipIndex) => (
                            <div
                              key={tipIndex}
                              className="flex items-center text-xs text-green-600"
                            >
                              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bad Examples */}
                <div>
                  <h3 className="mb-4 flex items-center text-xl font-semibold text-red-800">
                    <XCircle className="mr-2 h-6 w-6" />❌ Avoid These Mistakes
                  </h3>
                  <div className="flex flex-col gap-6">
                    {badExamples.map((example, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-red-200 bg-red-50 p-4"
                      >
                        {/* Images */}
                        <div className="relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-green-100">
                          <Image
                            src={example.imgUrl}
                            alt={example.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <h4 className="mb-2 font-semibold text-red-800">
                          {example.title}
                        </h4>
                        <p className="mb-3 text-sm text-red-700">
                          {example.description}
                        </p>
                        <div className="rounded bg-red-100 p-2">
                          <p className="text-xs text-red-800">
                            <span className="font-medium">Solution:</span>{" "}
                            {example.solution}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Steps Tab */}
            {activeTab === "steps" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Step-by-Step Capture Process
                  </h2>
                  <p className="text-gray-600">
                    Follow these steps for optimal image capture results
                  </p>
                </div>

                <div className="space-y-6">
                  {captureSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      {/* <div className="flex-shrink-0">
                        <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white">
                          {index + 1}
                        </div>
                      </div> */}
                      <div className="relative flex-1">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                          <div className="mb-3 flex items-center space-x-3">
                            <div className="text-primary">{step.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {step.title}
                            </h3>
                          </div>
                          <p className="leading-relaxed text-gray-700">
                            {step.description}
                          </p>
                        </div>

                        <div className="bg-primary text-light absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Tips */}
                <div className="bg-primary text-light rounded-lg p-6">
                  <h3 className="mb-3 text-xl font-bold">🎯 Pro Tips</h3>
                  <div className="grid gap-4 text-sm md:grid-cols-2">
                    <div>
                      <p className="mb-2">
                        • Clean your camera lens before shooting
                      </p>
                      <p className="mb-2">
                        • Take photos during mid-morning or late afternoon
                      </p>
                      <p>
                        • Capture both healthy and affected areas for comparison
                      </p>
                    </div>
                    <div>
                      <p className="mb-2">
                        • Hold phone horizontally for wider shots
                      </p>
                      <p className="mb-2">
                        • Get as close as possible without losing focus
                      </p>
                      <p>• Take multiple angles of the same subject</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="hidden rounded-lg bg-white p-6 text-center shadow-sm">
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Ready to Start Scanning?
          </h3>
          <p className="mb-4 text-gray-600">
            Now that you know how to capture perfect images, start detecting
            banana diseases with confidence!
          </p>
          <button className="mx-auto flex items-center space-x-2 rounded-lg bg-yellow-400 px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-yellow-500">
            <Camera className="h-5 w-5" />
            <span>Start Capturing</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guide;

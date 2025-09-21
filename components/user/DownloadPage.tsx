"use client";

import React, { useState } from "react";
import { Download, QrCode } from "lucide-react";
import Image from "next/image";
import {
  RiBarChartLine,
  RiShieldCheckLine,
  RiSparklingLine,
} from "react-icons/ri";
import { QRCodeCanvas } from "qrcode.react";

const DownloadPage = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const appURL = "https://www.npmjs.com/package/qrcode.react";

  const handleDownload = async () => {
    setIsDownloading(true);

    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, trigger the APK download here
      console.log("Downloading APK...");
      // const link = document.createElement('a');
      // link.href = '/path/to/your-app.apk';
      // link.download = 'YourApp_v2.1.0.apk';
      // link.click();
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="bg-light/20 flex h-20 w-20 items-center justify-center rounded-lg border border-gray-300">
          <Image
            src="/img/BananaCare-Logomark.svg"
            width={50}
            height={50}
            alt="BananaCare Logomark"
          />
        </div>
        <h1 className="font-clash-grotesk text-secondary text-4xl font-semibold">
          Banana<span className="text-primary">Care</span>
        </h1>
        <p className="text-gray-600">Detect Banana Disease with Ease</p>
      </div>

      {/* Features */}
      <div className="flex items-center justify-center gap-10">
        <div className="text-center">
          <div className="bg-primary/20 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
            <RiSparklingLine className="text-primary h-6 w-6" />
          </div>
          <p className="text-xs font-medium text-gray-600">AI Powered</p>
        </div>
        <div className="text-center">
          <div className="bg-primary/20 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
            <RiShieldCheckLine className="text-primary h-6 w-6" />
          </div>
          <p className="text-xs font-medium text-gray-600">Instant Results</p>
        </div>
        <div className="text-center">
          <div className="bg-primary/20 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
            <RiBarChartLine className="text-primary h-6 w-6" />
          </div>
          <p className="text-xs font-medium text-gray-600">Crop Protection</p>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-primary text-light flex w-[70%] transform items-center justify-center gap-3 rounded-md px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-md"
        >
          {isDownloading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Downloading APK...
            </>
          ) : (
            <>
              <Download className="h-6 w-6" />
              Download APK
            </>
          )}
        </button>

        {/* Download Info */}
        <div className="mt-4 text-center">
          {/* Show QR Code Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="text-primary mb-2 flex items-center gap-2 px-4 text-sm font-medium underline transition-colors hover:cursor-pointer hover:opacity-70"
            >
              <QrCode className="h-4 w-4" />
              {showQRCode ? "Hide QR Code" : "Download via QR"}
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Compatible with Android 6.0 and above • No ads • Free forever
          </p>
        </div>
      </div>

      {showQRCode && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 space-y-2 bg-black/80">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="bg-light rounded-md p-4">
              <QRCodeCanvas
                value={appURL}
                size={150}
                fgColor="#22b123"
                bgColor="#ffff"
              />
            </div>

            <div className="text-light flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5" />
              <span className="text-sm font-semibold">Instant Download</span>
            </div>

            <p className="text-light text-center text-xs">
              Scan with your phone's camera to download directly.
            </p>
          </div>

          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="text-light bg-primary w-[40%] gap-2 rounded-md px-10 py-2 text-sm font-medium transition-colors hover:cursor-pointer hover:opacity-70"
          >
            {showQRCode ? "Close" : "Download via QR"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;

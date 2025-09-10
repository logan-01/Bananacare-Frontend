import React from "react";

import Image from "next/image";
import PlatformWrapper from "../wrapper/PlatformWrapper";

interface NotBananaModalProps {
  open?: boolean;
  onClose: () => void;
}

function NotBananaModal({ open = true, onClose }: NotBananaModalProps) {
  return (
    <PlatformWrapper
      open={open}
      onOpenChange={onClose}
      showHeader={false}
      className="h-full bg-black/60 backdrop-blur-sm transition-all duration-300"
    >
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <Image
          src={"/img/Not_Banana.png"}
          // fill
          width={300}
          height={300}
          // className="h-40 w-40"
          alt="Not a Banana"
          unoptimized
        />

        {/* Title & Subtitle */}
        <div className="space-y-1 text-center">
          <h2 className="text-light text-2xl font-bold">Oops! Not a Banana</h2>
          <p className="text-sm text-gray-300">
            Please try scanning again with a banana image.
          </p>
        </div>

        <button
          className="text-light w-60 rounded-md border border-red-600 bg-red-600 px-2 py-2 shadow-none"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </PlatformWrapper>
  );
}

export default NotBananaModal;

// ============  Modal Wrapper ============
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  children: React.ReactNode;
}

function Modal({
  open,
  onOpenChange,
  trigger,
  title = "Modal",
  size = "md",
  className = "",
  children,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const sizeClasses = {
    sm: "md:min-w-[25vw]",
    md: "md:min-w-[48vw]",
    lg: "md:min-w-[65vw]",
    xl: "md:min-w-[80vw]",
    full: "md:min-w-[95vw]",
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent
        className={`flex h-[95vh] flex-col overflow-y-auto border-none bg-white ${sizeClasses[size]} md:px-10 ${className}`}
      >
        <AlertDialogTitle className="sticky top-0 flex items-center bg-white">
          <p className="flex-1">{title}</p>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          >
            ✕
          </button>
        </AlertDialogTitle>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Modal;

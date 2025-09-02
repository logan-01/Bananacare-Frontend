import React from "react";
import { ScanForm } from "@/components/client/ScanForm";
import { MdClose } from "react-icons/md";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ScanModalProps {
  trigger: React.ReactNode;
  className?: string;
}

function ScanModal({ trigger, className = "" }: ScanModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>{trigger}</AlertDialogTrigger>

      <AlertDialogContent
        className={`bg-light flex max-h-[96vh] flex-col border-none md:min-w-[48vw] md:px-10`}
      >
        <AlertDialogHeader className="flex-shrink-0 text-left">
          <AlertDialogTitle className="flex items-center">
            <p className="text-dark font-clash-grotesk flex-1 text-xl font-semibold">
              Scan Banana Disease
            </p>
            <AlertDialogCancel className="border-none text-right shadow-none hover:cursor-pointer hover:opacity-70">
              <MdClose className="size-6" />
            </AlertDialogCancel>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          <ScanForm />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ScanModal;

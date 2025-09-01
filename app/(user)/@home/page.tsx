import React from "react";
import Image from "next/image";

//Client Components
import { ScanForm } from "@/components/client/ScanForm";
import MoreInfoButton from "@/components/user/MoreInfoButton";
import { auth } from "@/lib/auth";

import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { MdClose, MdLock } from "react-icons/md";

async function page() {
  const session = await auth();

  return (
    <section
      className="flex flex-1 scroll-mt-20 flex-col justify-between px-6 md:flex-row-reverse md:px-10 lg:px-28"
      id="home"
    >
      <div className="flex flex-1 items-center justify-center">
        <Image
          src="/img/BananaTree-Hero.svg"
          width={400}
          height={400}
          alt="Banana Tree Hero"
          className="w-[98%] md:w-[95%]"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 text-center md:text-left">
        <Image
          src="/img/BananaCare-Wordmark.svg"
          width={120}
          height={50}
          alt="BananaCare Wordmark"
          className="hidden md:block"
        />

        <h1 className="font-clash-grotesk text-2xl font-semibold whitespace-pre-line md:text-3xl lg:text-4xl">
          Detect Banana Disease with Ease
        </h1>
        <p>
          <span className="text-primary font-medium">
            Snap. Upload. Diagnose.
          </span>{" "}
          Instantly detect banana tree diseases with AI-powered analysis.
          Protect your crops, maximize your yield, and farm smarter—all in just
          a few clicks.
        </p>

        <div className="flex justify-center gap-5 lg:w-[70%]">
          <AlertDialog>
            <AlertDialogTrigger className="bg-primary text-light flex-1 rounded-md px-8 py-2 font-medium hover:cursor-pointer hover:opacity-70">
              Scan Now
            </AlertDialogTrigger>

            <AlertDialogContent
              className={`bg-light border-none md:min-w-[48vw] md:px-10 ${session?.user ? "overflow-y-auto" : "overflow-hidden"}`}
            >
              <AlertDialogHeader className="text-left">
                <AlertDialogTitle className="flex items-center">
                  <p className="text-dark font-clash-grotesk flex-1 text-xl font-semibold">
                    Scan Banana Disease
                  </p>
                  <AlertDialogCancel className="border-none text-right shadow-none hover:cursor-pointer hover:opacity-70">
                    <MdClose className="size-6" />
                  </AlertDialogCancel>
                </AlertDialogTitle>
              </AlertDialogHeader>

              <ScanForm />
            </AlertDialogContent>
          </AlertDialog>

          <MoreInfoButton />
        </div>
      </div>
    </section>
  );
}

export default page;

"use client";

import React from "react";

export default function ErrorPage() {
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div className="bg-light flex h-screen w-screen flex-col items-center justify-center -space-y-20">
      <img src="/img/404.svg" alt="404" width={450} height={450} className="" />
      <div className="text-center">
        <p className="font-clash-grotesk text-primary text-7xl font-medium md:text-9xl">
          404 PAGE
        </p>
        <p className="">The page you were looking for could not be found</p>
        <button
          className="bg-primary text-light mt-4 w-full rounded-md py-2 text-lg font-medium hover:cursor-pointer hover:opacity-70"
          onClick={handleBackClick}
        >
          Back to previous page
        </button>
      </div>
    </div>
  );
}

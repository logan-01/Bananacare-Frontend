import React from "react";
import { MdArrowBack } from "react-icons/md";

interface StackProps {
  children: React.ReactNode;
}

function Stack({ children }: StackProps) {
  return (
    <div className="bg-light fixed inset-0 flex h-screen w-screen flex-col">
      <div className="bg-primary text-light flex items-center gap-4 px-2 py-4 font-semibold">
        <MdArrowBack className="text-xl" />

        <p>Result</p>
      </div>

      <div className="flex-1 px-4 py-4">{children}</div>
    </div>
  );
}

export default Stack;

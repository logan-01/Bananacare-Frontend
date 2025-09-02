"use client";

import React from "react";

function MoreInfoButton() {
  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      className="bg-secondary text-dark w-1/2 rounded-md px-8 py-2 font-medium hover:cursor-pointer hover:opacity-70"
      onClick={() => handleNavClick("disease")}
    >
      More Info
    </button>
  );
}

export default MoreInfoButton;

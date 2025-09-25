// src/components/LogoFallback.jsx
import React from "react";

export default function LogoFallback({ className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <h1
        className="text-lg md:text-2xl font-extrabold bg-clip-text text-transparent
                   bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
        aria-label="Hamza Furnitures"
      >
        Hamza Furnitures
      </h1>
    </div>
  );
}

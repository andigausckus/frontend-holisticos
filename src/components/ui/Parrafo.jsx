// src/components/ui/Parrafo.jsx
import React from "react";

export default function Parrafo({ children }) {
  return (
    <p className="text-base font-montserrat text-[#333333] mb-4">
      {children}
    </p>
  );
}
// src/components/ui/TituloPrincipal.jsx
import React from "react";

export default function TituloPrincipal({ children }) {
  return (
    <h1 className="text-3xl md:text-5xl font-bold font-playfair text-[#333333] mb-6 pt-6">
      {children}
    </h1>
  );
}
// src/components/ui/Subtitulo.jsx
import React from "react";

export default function Subtitulo({ children }) {
  return (
    <h2 className="text-xl md:text-3xl font-semibold font-playfair text-violetaPrincipal mt-10 mb-4">
      {children}
    </h2>
  );
}
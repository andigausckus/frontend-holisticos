import React from "react";
import { Link } from "react-router-dom";

export default function PaginaPagoFallido() {
  return (
    <div className="bg-white pt-12 pb-16 px-4 max-w-xl mx-auto mb-24 text-[#333] text-center">
      <h2 className="text-2xl font-bold text-red-600">⚠️ Pago no realizado</h2>
      <p className="mt-4">Ocurrió un error al procesar tu pago.</p>
      <Link to="/pago" className="mt-6 inline-block text-[#009EE3] hover:underline">Volver al pago</Link>
    </div>
  );
}
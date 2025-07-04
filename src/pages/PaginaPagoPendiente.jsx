import React from "react";
import { Link } from "react-router-dom";

export default function PaginaPagoPendiente() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-xl mx-auto bg-white text-[#333] text-center">
      <h2 className="text-2xl font-bold text-yellow-600">⏳ Pago pendiente</h2>
      <p className="mt-4">El pago está en estado pendiente. Una vez autorizado, la reserva será confirmada automáticamente.</p>
      <Link to="/" className="mt-6 inline-block text-[#009EE3] hover:underline">Volver al inicio</Link>
    </div>
  );
}
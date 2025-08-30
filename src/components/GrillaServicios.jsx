import React from "react";
import { Link } from "react-router-dom";
import servicios from "../data/servicios";

export default function GrillaServicios() {
  return (
    <section className="py-16 px-4 sm:px-8 lg:px-32 bg-[#f9faf8]">
      <h2 className="text-3xl font-bold mb-8 text-[#333] text-center">
        Servicios disponibles
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={servicio.imagen}
              alt={servicio.titulo}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-[#333] mb-2">
                {servicio.titulo}
              </h3>
              {/* ⭐ Estrellas ficticias y reseñas */}
              <div className="flex justify-center items-center gap-2 mb-2 text-[#f59e0b] text-sm">
                <span>⭐️⭐️⭐️⭐️⭐️</span>
                <span className="text-gray-500 text-xs">(23 reseñas)</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Impartido por: {servicio.terapeuta}
              </p>
              <p className="text-lg font-bold text-[#333] mb-4">
                ${servicio.precio.toLocaleString("es-AR")}
              </p>
              <Link
                to={`/servicio/${servicio.id}`}
                className="inline-block bg-[#ec4899] text-white px-6 py-2 rounded-full hover:opacity-90 transition font-medium"
              >
                Ver más
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
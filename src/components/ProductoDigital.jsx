import React from "react";

export default function ProductoDigital({
  titulo,
  descripcion,
  imagen,
  enlace,
  categoria,
}) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full sm:w-[320px] hover:shadow-lg transition">
      <img
        src={imagen}
        alt={titulo}
        className="w-full h-48 object-cover rounded-xl mb-3"
      />
      <div className="text-sm text-gray-500 mb-1">{categoria}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{titulo}</h3>
      <p className="text-sm text-gray-600 mb-4">{descripcion}</p>
      <a
        href={enlace}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm hover:bg-violet-200 transition"
      >
        Ver producto
      </a>
    </div>
  );
}
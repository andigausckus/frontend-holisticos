import React from "react";

const categorias = [
  { nombre: "Meditación", icono: <span className="text-3xl">🧘‍♂️</span> },
  { nombre: "Reiki", icono: <span className="text-3xl">🙌</span> },
  { nombre: "Yoga", icono: <span className="text-3xl">✨</span> },
  { nombre: "Tarot", icono: <span className="text-xl">🔮</span> },
];

export default function Categorias() {
  return (
    <section className="my-12 px-4 sm:px-8 lg:px-16 bg-[#f3ece7] py-12 rounded-xl mx-auto">
      <h2 className="text-xl font-bold text-[#444444] mb-6 text-center">Explorá por categoría</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center mx-auto">
        {categorias.map((cat) => (
          <div
            key={cat.nombre}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-center w-32"
          >
            {cat.icono}
            <p className="mt-2 text-lg font-medium text-[#333]">{cat.nombre}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
import React from "react";

export default function Testimonios() {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-semibold text-purple-700 mb-6">Testimonios</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-white shadow-md p-6 rounded-xl">
          <p className="text-gray-800 italic">
            “Gracias a Servicios Holísticos encontré una terapeuta excelente. ¡Me ayudó muchísimo en mi proceso!”
          </p>
          <p className="text-right text-purple-600 font-semibold mt-4">— Mariana G.</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl">
          <p className="text-gray-800 italic">
            “Muy fácil de usar y con opciones realmente variadas. Lo recomiendo totalmente.”
          </p>
          <p className="text-right text-purple-600 font-semibold mt-4">— Lucía A.</p>
        </div>
      </div>
    </section>
  );
}
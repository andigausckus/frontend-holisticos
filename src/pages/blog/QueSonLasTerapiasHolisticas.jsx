import React from "react";

export default function QueEsTerapiaHolistica() {
  return (
    <section className="bg-white text-[#333] px-6 md:px-12 py-12 pt-12 flex justify-center">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-24 pt-12 text-center text-[#7F56D9]">
          ¿Qué son las terapias holísticas?
        </h1>

        <img
          src="https://i.postimg.cc/mDqm5fqc/rocks-7354363-1280.jpg"
          alt="Terapia holística"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <p className="text-base mb-6 leading-relaxed">
          Las terapias holísticas abordan al ser humano como una unidad integrada de cuerpo, mente y espíritu. No se enfocan únicamente en tratar síntomas aislados, sino que buscan restablecer el equilibrio general de la persona, considerando sus emociones, energía y entorno. Este enfoque integral reconoce que el bienestar físico está estrechamente relacionado con nuestro estado mental y emocional.
        </p>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline decoration-[#7F56D9] decoration-2 font-normal">
          Principios fundamentales
        </h2>
        <p className="text-base mb-4 leading-relaxed">
          El enfoque holístico parte de la idea de que todos los aspectos del ser humano están interconectados. La salud óptima se logra cuando cuerpo, mente y espíritu funcionan en armonía. Por ello, las terapias holísticas se centran en:
        </p>

        <ul className="text-base mb-6 list-disc list-inside leading-relaxed">
          <li>
            <span className="underline text-[#444444] decoration-[#444444] decoration-2">Mente clara:</span> reducir el estrés y mejorar la concentración mediante técnicas de relajación y mindfulness.
          </li>
          <li>
            <span className="underline text-[#444444] decoration-[#444444] decoration-2">Cuerpo activo:</span> promover hábitos saludables como la alimentación consciente, ejercicio y descanso adecuado.
          </li>
          <li>
            <span className="underline text-[#444444] decoration-[#444444] decoration-2">Emociones equilibradas:</span> trabajar en la gestión emocional para superar bloqueos y alcanzar la paz interior.
          </li>
          <li>
            <span className="underline text-[#444444] decoration-[#444444] decoration-2">Espiritualidad:</span> conectar con uno mismo a través de prácticas que fomenten la autoconciencia y el crecimiento personal.
          </li>
        </ul>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline decoration-[#7F56D9] decoration-2 font-normal">
          Tipos de terapias holísticas más populares
        </h2>

        <h3 className="text-lg mt-6 mb-2 text-[#7F56D9] underline decoration-[#7F56D9] decoration-2 font-normal">
          Reiki
        </h3>
        <p className="text-base mb-4 leading-relaxed">
          Técnica energética que canaliza la energía universal para promover la sanación y el equilibrio. El terapeuta transmite energía a través de sus manos, ayudando a liberar bloqueos y reducir el estrés.
        </p>

        <h3 className="text-lg mt-6 mb-2 text-[#7F56D9] underline decoration-[#7F56D9] decoration-2 font-normal">
          Meditación guiada
        </h3>
        <p className="text-base mb-4 leading-relaxed">
          Práctica enfocada en la atención plena y la respiración consciente para calmar la mente, mejorar la concentración y fomentar el bienestar emocional.
        </p>

        <h3 className="text-lg mt-6 mb-2 text-[#7F56D9] underline decoration-[#7F56D9] decoration-2 font-normal">
          Terapia con cristales
        </h3>
        <p className="text-base mb-4 leading-relaxed">
          Uso de minerales y piedras con fines energéticos para equilibrar el aura y promover la sanación física y emocional. Cada cristal tiene propiedades específicas que ayudan en diferentes áreas.
        </p>

        <h3 className="text-lg mt-6 mb-2 text-[#7F56D9] underline decoration-[#7F56D9] decoration-2 font-normal">
          Yoga terapéutico
        </h3>
        <p className="text-base mb-4 leading-relaxed">
          Combina posturas físicas, respiración y meditación para fortalecer el cuerpo, aliviar tensiones y mejorar la salud integral.
        </p>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline decoration-[#7F56D9] decoration-2 font-normal">
          ¿Para quiénes están recomendadas?
        </h2>
        <p className="text-base mb-4 leading-relaxed">
          Las terapias holísticas son aptas para cualquier persona interesada en mejorar su bienestar general y vivir de manera más consciente. Son especialmente útiles para quienes buscan aliviar estrés, mejorar su salud emocional, o encontrar un camino de crecimiento personal.
        </p>
        <p className="text-base mb-4 leading-relaxed">
          No sustituyen tratamientos médicos convencionales, sino que funcionan como complemento para fortalecer la salud integral y prevenir desequilibrios.
        </p>

        <p className="text-sm text-gray-500 mt-10 leading-relaxed">
          Este contenido es solo informativo y no reemplaza la consulta con profesionales de la salud.
        </p>
      </div>
    </section>
  );
}
import React from "react";

export default function QueEsElYoga() {
  return (
    <section className="bg-white text-[#333] px-6 md:px-12 py-12 flex justify-center">
      <div className="max-w-3xl">
        <h1 className="text-3xl pt-12 mb-24 text-center md:text-5xl font-bold text-[#7F56D9]">
          ¿Qué es el Yoga?
        </h1>

        <img
          src="https://i.postimg.cc/x8FFQ86k/woman-2573216-1280.jpg"
          alt="Yoga"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <p className="text-base mb-6">
          El Yoga es una práctica milenaria originaria de la India que busca la unión armoniosa entre el cuerpo, la mente y el espíritu. Más que una serie de posturas físicas, es un camino integral que integra ejercicios corporales, respiratorios y de meditación para promover la salud y el bienestar global. A lo largo de miles de años, el Yoga ha evolucionado y se ha adaptado a distintas culturas y corrientes, manteniendo siempre su esencia como una disciplina de transformación personal.
        </p>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline">
          Orígenes y filosofía del Yoga
        </h2>
        <p className="text-base mb-6">
          El Yoga tiene sus raíces en los antiguos textos sagrados de la India, como los Vedas y los Upanishads, que datan de más de cinco mil años atrás. Su filosofía está basada en la conexión profunda entre el ser humano y el universo, entendiendo que el bienestar nace de equilibrar todas las dimensiones del ser. El término "Yoga" significa "unión" o "integración", reflejando esta idea central de armonizar cuerpo, mente y espíritu.
        </p>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline">
          Los ocho caminos del Yoga
        </h2>
        <p className="text-base mb-6">
          Según la tradición del Yoga, existen ocho caminos (Ashtanga Yoga) que guían al practicante hacia la autorrealización y la paz interior. Estos incluyen:
        </p>
        <ul className="list-disc list-inside text-base mb-6">
          <li>Yamas: principios éticos y morales para vivir en armonía con los demás.</li>
          <li>Niyamas: disciplinas personales para el autocuidado y la purificación.</li>
          <li>Asanas: posturas físicas que fortalecen y flexibilizan el cuerpo.</li>
          <li>Pranayama: técnicas de control de la respiración para manejar la energía vital.</li>
          <li>Pratyahara: retirada de los sentidos para concentrarse en el interior.</li>
          <li>Dharana: concentración en un solo punto o idea.</li>
          <li>Dhyana: meditación profunda que lleva a la contemplación y el estado de calma.</li>
          <li>Samadhi: estado supremo de unión con el ser y la conciencia universal.</li>
        </ul>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline">
          Beneficios físicos y mentales del Yoga
        </h2>
        <p className="text-base mb-6">
          La práctica regular del Yoga ofrece múltiples beneficios para la salud física y mental. Entre los más destacados se encuentran:
        </p>
        <ul className="list-disc list-inside text-base mb-6">
          <li>Mejora de la flexibilidad y fuerza muscular.</li>
          <li>Reducción del estrés y ansiedad mediante técnicas de respiración y meditación.</li>
          <li>Mejora de la postura y alivio de dolores musculares y articulares.</li>
          <li>Estimulación de la circulación sanguínea y mejor oxigenación del cuerpo.</li>
          <li>Mejora de la concentración y claridad mental.</li>
          <li>Promoción de un estado general de bienestar y equilibrio emocional.</li>
        </ul>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline">
          Estilos y tipos de Yoga
        </h2>
        <p className="text-base mb-6">
          Existen muchas ramas y estilos de Yoga que se adaptan a diferentes objetivos y características personales. Algunos de los estilos más conocidos incluyen:
        </p>
        <ul className="list-disc list-inside text-base mb-6">
          <li><u>Hatha Yoga:</u> Enfocado en las posturas físicas y la respiración, ideal para principiantes.</li>
          <li><u>Vinyasa Yoga:</u> Flujo dinámico que sincroniza movimiento y respiración.</li>
          <li><u>Ashtanga Yoga:</u> Práctica intensa y estructurada con secuencias fijas de posturas.</li>
          <li><u>Kundalini Yoga:</u> Enfocado en la energía espiritual y la meditación.</li>
          <li><u>Yin Yoga:</u> Posturas mantenidas por más tiempo para trabajar tejidos profundos.</li>
          <li><u>Yoga Restaurativo:</u> Suave y relajante, ideal para recuperación y estrés.</li>
        </ul>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline">
          Cómo empezar a practicar Yoga
        </h2>
        <p className="text-base mb-6">
          Para comenzar, es recomendable buscar un instructor calificado que guíe la práctica y ayude a realizar las posturas correctamente, evitando lesiones. También existen numerosos recursos online confiables para quienes prefieren la práctica en casa. Lo importante es avanzar con paciencia, respetando los límites del cuerpo y manteniendo una constancia regular para obtener resultados significativos.
        </p>

        <h2 className="text-xl mt-10 mb-3 text-[#7F56D9] underline">
          Yoga y vida diaria
        </h2>
        <p className="text-base mb-6">
          Más allá de la práctica física, el Yoga invita a integrar sus principios en la vida cotidiana: vivir con atención plena, cultivar la paciencia, la compasión y el respeto por uno mismo y los demás. Esta filosofía promueve una vida más consciente y equilibrada, ayudando a enfrentar los desafíos con mayor serenidad.
        </p>

        <p className="text-sm text-gray-500 mt-10">
          📌 Este contenido es solo informativo y no reemplaza la consulta con profesionales de la salud.
        </p>
      </div>
    </section>
  );
}
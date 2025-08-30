import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const frases = [
  "Toda sanación comienza con un sí. Un sí a vos mismo.",
  "No estás perdido. Estás en el camino de recordar quién sos.",
  "Elegir tu bienestar no es egoísmo, es amor propio en acción.",
  "Dentro tuyo ya está la paz que estás buscando afuera.",
  "Sanar no es volver al pasado, es abrazarlo con nueva conciencia."
];

export default function FrasesInspiradoras() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % frases.length);
    }, 10000); // Cambio cada 5 segundos
    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="mt-12 px-4">
      <div className="bg-emerald-800 rounded-3xl py-12 px-6 max-w-5xl mx-auto shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-white mb-6">
          Frases que inspiran tu camino de sanación 💫
        </h2>

        <div className="min-h-[100px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={indice}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white text-lg italic"
            >
              “{frases[indice]}”
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
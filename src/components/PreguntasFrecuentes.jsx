import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-100 py-4">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left text-[#6B21A8] font-semibold text-base md:text-lg transition-colors duration-200 focus:outline-none"
    >
      {question}
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full bg-[#444444] transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-GrisPrincipal flex items-center justify-center">
          <ChevronDown
            className={`w-4 h-4 text-white transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </span>
    </button>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "max-h-[300px] mt-2" : "max-h-0"
      }`}
    >
      <p className="text-[#444444]">{answer}</p>
    </div>
  </div>
);

const PreguntasFrecuentes = () => {
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  const secciones = [
    {
      titulo: "Usuarios",
      preguntas: [
        {
          q: "¿Cómo reservo una sesión?",
          a: "Elegí el servicio que te interesa, seleccioná día y horario disponibles, y realizá el pago para confirmar la reserva.",
        },
        {
          q: "¿Qué pasa si no puedo asistir?",
          a: "Podés cancelar con al menos 24h de anticipación. Si la sesión es para el mismo día, no se realizan reembolsos.",
        },
        {
          q: "¿Cómo me comunico con el terapeuta para la sesión?",
          a: "Una vez realizado el pago, verás los datos de contacto del terapeuta en la página de confirmación.",
        },
        {
          q: "¿Cómo pago mi sesión?",
          a: "Podés pagar con tarjeta de crédito, débito o saldo en tu cuenta de Mercado Pago. 🔒 Tu pago se procesa de forma segura y la confirmación es instantánea.",
        },
        {
          q: "¿Debo registrarme para reservar una sesión?",
          a: "No, no es necesario crear una cuenta para reservar. Solo completás tus datos básicos al momento de reservar.",
        },
      ],
    },
    {
      titulo: "Terapeutas",
      preguntas: [
        {
          q: "¿Cómo me registro como terapeuta?",
          a: "Completá el formulario con tus datos. Luego podrás acceder a tu panel privado para editar tu perfil.",
        },
        {
          q: "¿Tengo que pagar para publicar mis servicios?",
          a: "No, publicar es gratis. Solo se aplica una comisión del 10% cuando se concreta una reserva.",
        },
        {
          q: "¿Cómo recibo los pagos de mis sesiones?",
          a: "Cuando un usuario paga, el monto se acredita primero en la cuenta de Servicios Holísticos. Luego te transferimos el pago correspondiente, descontando la comisión del 10%, poco después de la reserva.",
        },
        {
          q: "¿Qué pasa si no puedo asistir a una sesión?",
          a: "Debés contactar al usuario para reprogramar la sesión. Si no es posible, desde Servicios Holísticos gestionamos el reembolso. En ese caso, te pediremos devolver el pago si ya fue transferido.",
        },
      ],
    },
    {
      titulo: "Sobre la plataforma",
      preguntas: [
        {
          q: "¿Cómo garantizan la seguridad del pago?",
          a: "Trabajamos con Mercado Pago, una de las plataformas más seguras de América Latina. Tus datos están protegidos.",
        },
        {
          q: "¿Dónde se realizan las sesiones?",
          a: "Cada terapeuta indica el medio por el cual brindará la sesión (WhatsApp, Zoom, Skype o Google Meet). Revisalo en la descripción del servicio.",
        },
        {
          q: "¿Qué tipo de terapias puedo encontrar?",
          a: "Desde Reiki, Yoga y Meditación hasta terapias alternativas como registros akáshicos, astrología y más.",
        },
      ],
    },
  ];

  return (
    <section className="bg-[#FFF9DB] mt-12 py-12 px-6 md:px-12 rounded-2xl max-w-6xl mx-auto mb-16">
      <h2 className="text-xl md:text-2xl font-semibold text-[#333333] mb-8 text-center">
        Preguntas Frecuentes
      </h2>

      {/* Secciones */}
      <div className="flex flex-col gap-4 mb-8 max-w-md mx-auto">
        {secciones.map((sec, i) => (
          <button
            key={i}
            onClick={() => {
              setSeccionActiva(seccionActiva === i ? null : i);
              setPreguntaAbierta(null);
            }}
            className={`text-lg font-semibold py-2 px-4 rounded-md border border-[#333333] transition-colors duration-200 text-left text-[#444444] focus:outline-none`}
          >
            {sec.titulo}
          </button>
        ))}
      </div>

      {/* Preguntas */}
      {seccionActiva !== null && (
        <div>
          {secciones[seccionActiva].preguntas.map((item, idx) => {
            const isOpen = preguntaAbierta === idx;
            return (
              <AccordionItem
                key={idx}
                question={item.q}
                answer={item.a}
                isOpen={isOpen}
                onClick={() =>
                  setPreguntaAbierta(isOpen ? null : idx)
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PreguntasFrecuentes;
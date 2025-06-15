import React, { useEffect, useState } from "react";

function PaginaPagoSimple() {
  const [minutos, setMinutos] = useState(10);
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (segundos > 0) {
        setSegundos(segundos - 1);
      } else if (minutos > 0) {
        setMinutos(minutos - 1);
        setSegundos(59);
      } else {
        clearInterval(intervalo);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [minutos, segundos]);

  return (
    <div className="pt-24 pb-16 px-4 max-w-xl mx-auto bg-gray-50 min-h-screen text-[#333]">
      <h2 className="text-2xl font-bold text-center mb-6">Completá con tus datos 🍃</h2>

      {/* Formulario */}
      <form className="bg-white rounded-3xl shadow-md p-6 mt-4">
        <input
          type="text"
          placeholder="Nombre y Apellido"
          className="w-full p-2 mb-4 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 mb-4 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
        <input
          type="tel"
          placeholder="Teléfono"
          className="w-full p-2 mb-4 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
        <textarea
          placeholder="¿Querés dejarle un mensaje al terapeuta?"
          rows={3}
          className="w-full p-2 mb-4 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
      </form>

      {/* Temporizador */}
      <div className="flex justify-center mt-6">
        <div className="w-28 h-28 border border-[#009EE3] rounded-full flex items-center justify-center">
          <span className="text-3xl text-[#009EE3] font-mono">
            {minutos}:{segundos.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      <p className="text-center text-[#009EE3] mt-2 font-medium">
        Tiempo restante para completar el pago
      </p>
      <p className="text-center text-sm text-gray-500 mt-1 mb-4 px-6">
        Si no realizás el pago antes de que finalice el tiempo, la reserva será cancelada automáticamente.
      </p>

      {/* Opciones de pago */}
      <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
        <button
          type="submit"
          className="w-full bg-[#009EE3] text-white py-2 rounded-3xl text-lg hover:bg-[#007dc1] transition"
        >
          Pagar con Mercado Pago
        </button>

        {/* Enlaces legales */}
        <div className="text-sm text-center mt-4 space-x-4 underline text-[#009EE3]">
          <a href="/aviso-legal" target="_blank" rel="noopener noreferrer">Aviso Legal</a>
          <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
        </div>
      </div>
    </div>
  );
}

export default PaginaPagoSimple;
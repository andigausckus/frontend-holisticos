import React from "react";

const PaginaGracias = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-semibold text-violet-600 mb-4">¡Gracias por tu reserva!</h1>
        <p className="text-gray-700 mb-4">
          Hemos recibido tu comprobante de pago. En breve confirmaremos la reserva.
        </p>
        <p className="text-gray-700 mb-6">
          Te enviaremos por correo electrónico los datos del terapeuta, el enlace de contacto
          y toda la información necesaria para tu sesión.
        </p>

        <div className="bg-violet-50 p-4 rounded-xl border border-violet-200 mb-6">
          <p className="text-violet-800 font-medium">🧘 Mientras esperás...</p>
          <p className="text-sm text-gray-700 mt-2">
            Te recomendamos explorar otros servicios o productos que complementan tu bienestar.
            <br />
            (Muy pronto vamos a ofrecer sugerencias personalizadas aquí)
          </p>
        </div>

        <a
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default PaginaGracias;
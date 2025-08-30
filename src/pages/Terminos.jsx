import React from "react";

export default function Terminos() {
  return (
    <div className="bg-white max-w-4xl mx-auto pt-24 px-6 py-12 text-[#333]">
      <h1 className="text-2xl text-center font-semibold text-[#7F56D9] mb-6">
        Términos y Condiciones
      </h1>

      <p className="mb-4 text-base">
        Bienvenido/a a Servicios Holísticos. Al utilizar esta plataforma, aceptás cumplir con los siguientes términos y condiciones. Te recomendamos leerlos atentamente antes de continuar.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. Uso de la plataforma</h2>
      <p className="mb-4 text-sm">
        Este sitio permite a los usuarios reservar sesiones con terapeutas y profesionales del bienestar. Los terapeutas son responsables por los servicios que ofrecen, y los usuarios por el uso adecuado de los mismos.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">2. Registro y datos</h2>
      <p className="mb-4 text-sm">
        Para acceder a ciertos servicios, es necesario registrarse. Los datos proporcionados deben ser verídicos. Nos reservamos el derecho de suspender cuentas que incumplan con nuestras políticas.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. Pagos y comisiones</h2>
      <p className="mb-4 text-sm">
        El sitio cobra una comisión del 10% sobre el valor de cada sesión concretada. Los pagos se procesan a través de plataformas seguras de terceros.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. Cancelaciones</h2>
      <p className="mb-4 text-sm">
        Las sesiones pueden cancelarse hasta 24 horas antes del horario pactado. Pasado ese plazo, no se realizarán reembolsos. En reservas del mismo día, no aplica reembolso.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. Conducta de los usuarios</h2>
      <p className="mb-4 text-sm">
        Se espera que los usuarios mantengan una conducta respetuosa y apropiada durante toda interacción dentro de la plataforma. Cualquier conducta ofensiva, fraudulenta o abusiva podrá resultar en la suspensión o eliminación de la cuenta.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">6. Responsabilidad</h2>
      <p className="mb-4 text-sm">
        Servicios Holísticos actúa como intermediario entre terapeutas y usuarios. No somos responsables por los resultados de las sesiones, ni garantizamos la eficacia de los tratamientos ofrecidos.
      </p>

      <p className="mt-10 text-sm text-gray-600">
        Estos términos pueden ser modificados en cualquier momento. Recomendamos revisarlos periódicamente para estar al tanto de posibles actualizaciones.
      </p>
    </div>
  );
}
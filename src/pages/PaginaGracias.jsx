import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Gracias() {
  const [servicio, setServicio] = useState(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  useEffect(() => {
    const datosGuardados = localStorage.getItem("datosTerapeuta");
    const fechaGuardada = localStorage.getItem("fechaReserva");
    const horaGuardada = localStorage.getItem("horaReserva");

    if (datosGuardados) {
      setServicio(JSON.parse(datosGuardados));
    }
    if (fechaGuardada) setFecha(fechaGuardada);
    if (horaGuardada) setHora(horaGuardada);
  }, []);

  return (
    <div className="pt-12 pb-20 px-6 max-w-xl mx-auto text-center text-[#333] bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">¡Gracias por tu reserva! 🌟</h1>
      <p className="mb-4">
        Tu pago fue procesado con éxito. El terapeuta ya fue notificado de tu sesión.
      </p>
      <p className="mb-4">
        Si aún no lo hiciste, podés contactarlo directamente para confirmar cualquier detalle.
      </p>

      {servicio && (
        <div className="bg-gray-100 rounded-xl p-5 mb-6 text-left text-sm">
          <h2 className="text-lg font-semibold mb-2">Datos del terapeuta:</h2>
          <p><span className="font-semibold">Nombre:</span> {servicio.terapeuta}</p>
          <p><span className="font-semibold">Email:</span> {servicio.email || "Email no disponible"}</p>
          <p><span className="font-semibold">Teléfono:</span> {servicio.telefono || "Teléfono no disponible"}</p>
          <p><span className="font-semibold">Modalidad:</span> {servicio.modalidad}</p>
          <p><span className="font-semibold">Plataforma:</span> {servicio.plataforma}</p>
          <p><span className="font-semibold">Día y hora:</span> {new Date(fecha).toLocaleDateString("es-AR")} a las {hora}</p>
        </div>
      )}

      <p className="mb-6">
        Ante cualquier duda, podés escribirnos desde el{" "}
        <Link to="/contacto" className="text-[#009EE3] underline">
          formulario de contacto
        </Link>.
      </p>

      <Link
        to="/"
        className="inline-block mt-4 bg-pink-500 text-white py-2 px-6 rounded-3xl hover:bg-pink-600 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default Gracias;
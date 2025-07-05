import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Gracias() {
  const location = useLocation();

  const [servicio, setServicio] = useState(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mensaje, setMensaje] = useState("Procesando tu reserva...");
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentId = query.get("payment_id");
    const status = query.get("status");
    const preferenceId = query.get("preference_id");

    const datosGuardados = localStorage.getItem("datosTerapeuta");
    const fechaGuardada = localStorage.getItem("fechaReserva");
    const horaGuardada = localStorage.getItem("horaReserva");
    const nombre = localStorage.getItem("nombreUsuario");
    const datosReserva = localStorage.getItem("datosReserva"); // lo usamos para guardar en BD

    if (fechaGuardada) setFecha(fechaGuardada);
    if (horaGuardada) setHora(horaGuardada);
    if (nombre) setNombreUsuario(nombre);

    if (datosGuardados) {
      const servicio = JSON.parse(datosGuardados);
      setServicio(servicio);

      // Obtener datos completos del terapeuta
      if (servicio?.terapeuta?._id) {
        fetch(`https://servicios-holisticos-backend.onrender.com/api/terapeutas/publico/${servicio.terapeuta._id}`)
          .then((res) => res.json())
          .then((data) => {
            setServicio((prev) => ({ ...prev, terapeutaCompleto: data }));
          })
          .catch((err) => console.error("❌ Error al obtener terapeuta completo:", err));
      }
    }

    // Si el pago fue exitoso, registrar la reserva
    if (paymentId && status === "approved" && datosReserva) {
      const payload = {
        ...JSON.parse(datosReserva),
        usuarioNombre: nombre,
        usuarioEmail: localStorage.getItem("emailUsuario") || "",
        usuarioTelefono: localStorage.getItem("telefonoUsuario") || "",
        paymentId,
        preferenceId,
        estado: "confirmada",
      };

      fetch("https://servicios-holisticos-backend.onrender.com/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          setMensaje("✅ ¡Reserva confirmada!");
          setReservaConfirmada(true);
          localStorage.removeItem("datosReserva");
        })
        .catch((err) => {
          console.error("❌ Error al guardar reserva:", err);
          setMensaje("❌ Hubo un error al registrar tu reserva.");
        });
    } else {
      setMensaje("❌ El pago no fue aprobado o faltan datos.");
    }
  }, [location.search]);

  const mensajeWA = `Hola ${nombreUsuario}, te escribo respecto a la sesión "${servicio?.titulo}" que tengo agendada el ${new Date(fecha).toLocaleDateString("es-AR")} a las ${hora}. ¡Gracias y quedo atent@ a cualquier detalle!`;

  const urlWhatsApp = servicio?.terapeutaCompleto?.whatsapp
    ? `https://wa.me/549${servicio.terapeutaCompleto.whatsapp}?text=${encodeURIComponent(mensajeWA)}`
    : null;

  return (
    <div className="pt-12 pb-20 px-6 max-w-xl mx-auto text-center text-[#333] bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{mensaje}</h1>

      {reservaConfirmada && servicio?.terapeutaCompleto && (
        <>
          <p className="mb-4">
            Tu pago fue procesado con éxito. El terapeuta ya fue notificado de tu sesión.
          </p>
          <p className="mb-4">
            Si aún no lo hiciste, podés contactarlo directamente para confirmar cualquier detalle previo a la sesión.
          </p>
          <p className="mb-6">
            También te enviamos un email con la confirmación de tu reserva y los datos del terapeuta. Revisá tu bandeja de entrada 📩
          </p>

          <div className="bg-gray-100 rounded-xl p-5 mb-6 text-left text-sm">
            <h2 className="text-lg font-semibold mb-2">Datos del terapeuta:</h2>
            <p>
              <span className="text-pink-500 underline">Nombre</span><br />
              {servicio.terapeutaCompleto.nombreCompleto || "No disponible"}
            </p>
            <p className="mt-3">
              <span className="text-pink-500 underline">Email</span><br />
              {servicio.terapeutaCompleto.email || "No disponible"}
            </p>
            <p className="mt-3">
              <span className="text-pink-500 underline">WhatsApp</span><br />
              {urlWhatsApp ? (
                <a
                  href={urlWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-medium hover:underline"
                >
                  Escribir por WhatsApp
                </a>
              ) : (
                <span className="text-gray-500">No disponible</span>
              )}
            </p>
          </div>
        </>
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
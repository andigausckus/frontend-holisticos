import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

function Gracias() {
  const location = useLocation();

  const [servicio, setServicio] = useState(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [titulo, setTitulo] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");

  const [mensaje, setMensaje] = useState("Procesando tu reserva...");
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  useEffect(() => {
    const tituloServicio = localStorage.getItem("tituloServicio");
    const fechaGuardada = localStorage.getItem("fechaReserva");
    const horaGuardada = localStorage.getItem("horaReserva");

    console.log("📅 Datos cargados de localStorage:", {
      tituloServicio,
      fechaGuardada,
      horaGuardada,
    });

    if (tituloServicio) setTitulo(tituloServicio);
    if (fechaGuardada) setFecha(fechaGuardada);
    if (horaGuardada) setHora(horaGuardada);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentId = query.get("payment_id");
    const status = query.get("status");
    const preferenceId = query.get("preference_id");

    const nombre = localStorage.getItem("nombreUsuario");
    const datosReserva = localStorage.getItem("datosReserva");

    if (nombre) setNombreUsuario(nombre);

    const servicioGuardado = datosReserva ? JSON.parse(datosReserva) : null;

    if (servicioGuardado) {
      setServicio(servicioGuardado);

      const terapeutaId = servicioGuardado?.terapeutaId;
      console.log("🧘 ID del terapeuta:", terapeutaId);

      if (terapeutaId) {
        fetch(
          `https://servicios-holisticos-backend.onrender.com/api/terapeutas/publico/${terapeutaId}`
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Datos del terapeuta desde backend:", data);
            setServicio((prev) => ({
              ...prev,
              terapeutaCompleto: data,
            }));
          })
          .catch((err) => {
            console.error("❌ Error al obtener terapeuta completo:", err);
          });
      }
    }

    if (paymentId && status === "approved" && datosReserva) {
      const payload = {
        ...JSON.parse(datosReserva),
        usuarioNombre: nombre,
        usuarioEmail: localStorage.getItem("emailUsuario") || "",
        usuarioTelefono: localStorage.getItem("telefonoUsuario") || "",
        fechaReserva: localStorage.getItem("fechaReserva") || "",
        horaReserva: localStorage.getItem("horaReserva") || "",
      };
      
console.log("📤 Payload enviado al backend:", payload);
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
localStorage.removeItem("nombreUsuario");
localStorage.removeItem("emailUsuario");
localStorage.removeItem("telefonoUsuario");
localStorage.removeItem("tituloServicio");
localStorage.removeItem("fechaReserva");
localStorage.removeItem("horaReserva");
        })
        .catch((err) => {
          console.error("❌ Error al guardar reserva:", err);
          setMensaje("❌ Ocurrió un error al guardar la reserva.");
        });
    }
  }, [location.search]);

  const nombreTerapeuta =
    servicio?.terapeutaCompleto?.nombreCompleto?.split(" ")[0] || "terapeuta";

  const mensajeWA = `👋 Hola ${nombreTerapeuta}, soy ${nombreUsuario}. Reservé tu sesión en serviciosholisticos.com.ar. ¡Quedo atent@ a cualquier detalle previo!`;

  const urlWhatsApp = servicio?.terapeutaCompleto?.whatsapp
    ? `https://wa.me/549${servicio.terapeutaCompleto.whatsapp}?text=${encodeURIComponent(mensajeWA)}`
    : null;

  return (
    <div className="bg-white pt-24 pb-20 px-6 max-w-xl mx-auto text-center text-[#333] min-h-screen">
      {!reservaConfirmada ? (
        <h1 className="text-2xl font-bold mb-4 text-gray-600">
          Procesando tu reserva...
        </h1>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
            ✅ ¡Reserva confirmada!
          </h2>

          <p className="mb-4 text-center text-[#333]">
            Tu pago fue procesado con éxito. El terapeuta ya fue notificado de
            tu sesión.
          </p>

          <p className="mb-4 text-center text-[#333]">
            Podés contactarlo directamente para confirmar cualquier detalle
            previo a la sesión.
          </p>

          <p className="mb-6 text-center text-[#333]">
            También te enviamos un email con la confirmación de tu reserva y los
            datos del terapeuta. Revisá tu bandeja de entrada 📩
          </p>

          {servicio?.terapeutaCompleto &&
          servicio?.terapeutaCompleto?.email ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-[#333] max-w-md mx-auto shadow-sm mt-4">
              <h3 className="text-lg font-semibold text-center mb-4 text-[#009EE3]">
                Datos del terapeuta
              </h3>

              <p>
                <strong>👤 Nombre y apellido</strong>{" "}
                {servicio.terapeutaCompleto.nombreCompleto}
              </p>

              <p>
                <strong>📧 Email</strong>{" "}
                {servicio.terapeutaCompleto.email}
              </p>

              {urlWhatsApp ? (
                <p>
                  <strong>📱 WhatsApp</strong>{" "}
                  <a
                    href={urlWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#009EE3] underline"
                  >
                    {servicio.terapeutaCompleto.whatsapp}
                  </a>
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Cargando número de WhatsApp...
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 mt-4">
              Cargando datos del terapeuta...
            </p>
          )}
        </>
      )}

      <Link
        to="/"
        className="inline-block mt-4 mb-6 bg-pink-500 text-white py-2 px-6 rounded-3xl hover:bg-pink-600 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default Gracias;
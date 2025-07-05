import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

import {
  FaWhatsapp,
  FaVideo,
  FaGoogle,
  FaSkype
} from "react-icons/fa";

// ✅ Función para mostrar ícono según la plataforma
const obtenerIconoPlataforma = (nombre) => {
  if (!nombre) return null;
  switch (nombre.toLowerCase()) {
    case "whatsapp":
      return <FaWhatsapp className="inline-block text-2xl text-green-600 ml-1" title="WhatsApp" />;
    case "zoom":
      return <FaVideo className="inline-block text-2xl text-blue-500 ml-1" title="Zoom" />;
    case "meet":
      return <FaGoogle className="inline-block text-2xl text-red-500 ml-1" title="Google Meet" />;
    case "skype":
      return <FaSkype className="inline-block text-2xl text-sky-600 ml-1" title="Skype" />;
    default:
      return (
        <span className="inline-block text-gray-500 ml-1" title={nombre}>
          {nombre}
        </span>
      );
  }
};

function formatearDuracion(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h > 0 && m > 0) return `${h} h ${m} min`;
  if (h > 0) return `${h} h`;
  return `${m} min`;
}

function PaginaPagoSimple() {
  const location = useLocation();
  const { servicio, fecha, hora } = location.state || {};
  servicio.duracion = parseInt(servicio.duracion || servicio.duracionMinutos || 0);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [minutos, setMinutos] = useState(10);
  const [segundos, setSegundos] = useState(0);

  function calcularHoraFin(horaInicio, duracionMinutos) {
  const [h, m] = horaInicio.split(":").map(Number);
  const inicio = new Date();
  inicio.setHours(h, m);

  const fin = new Date(inicio.getTime() + duracionMinutos * 60000);
  const hora = fin.getHours().toString().padStart(2, "0");
  const minutos = fin.getMinutes().toString().padStart(2, "0");

  return `${hora}:${minutos}`;
  }

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (segundos > 0) {
        setSegundos((s) => s - 1);
      } else if (minutos > 0) {
        setMinutos((m) => m - 1);
        setSegundos(59);
      } else {
        clearInterval(intervalo);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [minutos, segundos]);

  const iniciarPago = async () => {
    if (!aceptaTerminos) return;

    const payload = {
      items: [
        {
          title: servicio?.titulo || "Sesión",
          description: `Sesión con ${servicio?.terapeuta?.nombreCompleto} el ${fecha} a las ${hora}`,
          quantity: 1,
          currency_id: "ARS",
          unit_price: Number(servicio?.precio) || 1000,
          servicioId: servicio?._id,
          terapeutaId: servicio?.terapeuta?._id,
          fechaReserva: fecha,
          horaReserva: hora,
          terapeutaNombre: servicio?.terapeuta?.nombreCompleto,
          terapeutaEmail: servicio?.terapeuta?.email,
        },
      ],
      payer: {
        name: nombre || "Sin nombre",
        email: email || "test_user_949091583@testuser.com",
        phone: {
          number: telefono || "0000000000",
        },
      },
      marketplace_fee: 500,
      additional_info: "Reserva generada desde el sitio web",
    };

    console.log("📤 Enviando payload a backend:", payload);

    try {
      const response = await fetch(
        "https://servicios-holisticos-backend.onrender.com/api/pagos/crear-preferencia",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.init_point) {
  // 🟡 Guardar info para registrar reserva si el pago es exitoso
  localStorage.setItem("datosReserva", JSON.stringify({
    servicioId: servicio?._id,
    terapeutaId: servicio?.terapeuta?._id,
    fecha,
    hora,
  }));

  // 🔁 Redirigir a Mercado Pago
  window.location.href = data.init_point;
}
      } else {
        alert("Error al generar el link de pago.");
        console.error("⚠️ Respuesta inesperada:", data);
      }
    } catch (err) {
      console.error("❌ Error al iniciar el pago:", err);
      alert("Ocurrió un error al iniciar el pago.");
    }
  };

  return (
    <div className="pt-12 pb-16 px-4 max-w-xl mx-auto bg-gray-50 min-h-screen text-[#333]">
      {/* 🧾 Resumen */}
      <div className="bg-white rounded-xl p-5 mb-8 shadow-md text-sm">
  <h3 className="text-lg font-semibold mb-4 text-center">Resumen de tu reserva 🌸</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 items-start">
          {/* Columna izquierda */}
          <div className="flex flex-col justify-between h-full space-y-4 p-4 divide-y divide-gray-200">
            <p className="pt-1">
              <span className="text-pink-500 underline-offset-4 decoration-[1px]">Servicio</span><br />
              {servicio?.titulo}
            </p>
            <p className="pt-4">
              <span className="text-pink-500 underline-offset-4 decoration-[1px]">Modalidad</span><br />
              {servicio?.modalidad}
            </p>
            <p className="pt-4">
              <span className="text-pink-500 underline-offset-4 decoration-[1px]">Fecha</span><br />
              {fecha
                ? new Date(fecha).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                  })
                : "-"}
            </p>
            <p className="pt-4">
              <span className="text-pink-500 underline-offset-4 decoration-[1px]">Duración</span><br />
              {typeof servicio?.duracion === "number"
                ? formatearDuracion(servicio.duracion)
                : "Duración no disponible"}
            </p>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col justify-between h-full space-y-4 p-4 divide-y divide-gray-200">
            <p className="pt-1">
              <span className="text-pink-500 underline-offset-4 decoration-[1px]">Terapeuta</span><br />
              {servicio?.terapeuta?.nombreCompleto || "Sin definir"}
            </p>
            <p className="pt-4">
              <span className="text-pink-500 underline-offset-4 decoration-[1px]">Precio</span><br />
              ${servicio?.precio}
            </p>
            <p className="pt-4">
              <span className="text-pink-500 underline-offset-4 decoration-[1px]">Hora</span><br />
              {hora} a {calcularHoraFin(hora, servicio?.duracion)} hs
            </p>
            <div className="pt-4">
              <span className="text-pink-500 underline-offset-4 decoration-[1px]">Plataforma</span><br />
              {Array.isArray(servicio?.plataformas) && servicio.plataformas.length > 0 ? (
                <div className="flex gap-2 mt-1 text-[22px]">
                  {servicio.plataformas.map((p, i) => (
                    <span key={i}>{obtenerIconoPlataforma(p)}</span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">No especificada</span>
              )}
            </div>
          </div>
        </div>
</div>

      {/* Formulario */}
      <form className="bg-white rounded-3xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-center mb-6">Completá con tus datos 🪴</h2>
        <input
          type="text"
          placeholder="Nombre y apellido"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-2 mb-4 bg-white border border-[#444444] rounded-lg outline-none"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 bg-white border border-[#444444] rounded-lg outline-none"
        />
        <input
          type="tel"
          placeholder="Teléfono"
          pattern="[0-9]{10}"
          maxLength={10}
          required
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}

          className="w-full p-2 mb-4 bg-white border border-[#444444] rounded-lg outline-none"
          title="Ingresá exactamente 10 dígitos (sin 15, sin +54)"
        
        />
      </form>

      {/* Temporizador */}
      <div className="flex justify-center mt-10">
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

      {/* Botón y términos */}
      <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="terminos"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="terminos" className="text-sm text-[#333]">
            Acepto la{" "}
            <Link
              to="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#009EE3]"
            >
              Política de Privacidad
            </Link>
          </label>
        </div>

        <button
          type="button"
          disabled={!aceptaTerminos}
          onClick={iniciarPago}
          className={`w-full py-2 rounded-3xl text-lg transition ${
            aceptaTerminos
              ? "bg-[#009EE3] text-white hover:bg-[#007dc1]"
              : "bg-gray-300 text-white cursor-not-allowed"
          }`}
        >
          Pagar con Mercado Pago
        </button>
      </div>
    </div>
  );
}

export default PaginaPagoSimple;
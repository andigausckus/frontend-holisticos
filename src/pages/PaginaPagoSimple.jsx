import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaVideo, FaGoogle, FaSkype } from "react-icons/fa";

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
  const navigate = useNavigate();
  const { servicio, fecha, hora } = location.state || {};
  const [bloqueado, setBloqueado] = useState(false);
const [mensajeBloqueo, setMensajeBloqueo] = useState("");

useEffect(() => {
  const verificarBloqueo = async () => {
    try {
      const res = await fetch(`https://servicios-holisticos-backend.onrender.com/api/bloqueos/verificar?servicioId=${servicio._id}&fecha=${fecha}&hora=${hora}`);
      const data = await res.json();

      if (!data.libre) {
        
      } else {
        // Creamos el bloqueo temporal de 10 minutos
        await fetch("https://servicios-holisticos-backend.onrender.com/api/bloqueos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            servicioId: servicio._id,
            fecha,
            hora,
          }),
        });
      }
    } catch (error) {
      console.error("❌ Error al verificar o crear bloqueo:", error);
    }
  };

  if (servicio && fecha && hora) {
    verificarBloqueo();
  }
  }, [servicio, fecha, hora]); 

  const [expirado, setExpirado] = useState(false);
  servicio.duracion = parseInt(servicio.duracion || servicio.duracionMinutos || 0);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [minutos, setMinutos] = useState(0);
const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const reservaPendiente = JSON.parse(localStorage.getItem("reservaPendiente"));
    const ahora = Date.now();

    if (reservaPendiente?.expiracion) {
      const diferencia = reservaPendiente.expiracion - ahora;

      if (diferencia <= 0) {
        setExpirado(true);
      } else {
        const totalSegundos = Math.floor(diferencia / 1000);
        setMinutos(Math.floor(totalSegundos / 60));
        setSegundos(totalSegundos % 60);
      }
    } else {
      // No había reserva → marcar como expirada
      setExpirado(true);
    }
  }, []);

  function calcularHoraFin(horaInicio, duracionMinutos) {
    if (!horaInicio || typeof horaInicio !== "string" || !horaInicio.includes(":")) {
      return "--:--";
    }

    const [h, m] = horaInicio.split(":").map(Number);
    const inicio = new Date();
    inicio.setHours(h, m);
    const fin = new Date(inicio.getTime() + duracionMinutos * 60000);
    const hora = fin.getHours().toString().padStart(2, "0");
    const minutos = fin.getMinutes().toString().padStart(2, "0");
    return `${hora}:${minutos}`;
  }

  // ⏳ Temporizador
  useEffect(() => {
    const intervalo = setInterval(() => {
      const reservaPendiente = JSON.parse(localStorage.getItem("reservaPendiente"));
      const ahora = Date.now();

      if (reservaPendiente?.expiracion) {
        const diferencia = reservaPendiente.expiracion - ahora;

        if (diferencia <= 0) {
          setExpirado(true);
          window.scrollTo({ top: 0, behavior: "smooth" });

          // Liberar turno desde el backend
          if (servicio?._id && fecha && hora) {
            fetch("https://servicios-holisticos-backend.onrender.com/api/reservas/liberar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ servicioId: servicio._id, fecha, hora }),
            }).then(() => {
              console.log("⛔ Reserva liberada por tiempo expirado");
            });
          }

          // Redirigir a los servicios después de 10 segundos
          setTimeout(() => {
            navigate("/servicios");
          }, 10000);
        } else {
          const totalSegundos = Math.floor(diferencia / 1000);
          setMinutos(Math.floor(totalSegundos / 60));
          setSegundos(totalSegundos % 60);
        }
      } else {
        setExpirado(true);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [servicio, fecha, hora]);

  const iniciarPago = async () => {
    if (!aceptaTerminos) {
      alert("Debés aceptar la política de privacidad para continuar.");
      return;
    }

    if (!nombre.trim()) {
      alert("Por favor, completá tu nombre.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      alert("Por favor, ingresá un correo electrónico válido.");
      return;
    }

    if (!/^\d{10}$/.test(telefono)) {
      alert("Ingresá un número de teléfono válido (sin 0 ni 15).");
      return;
    }

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
        name: nombre,
        email: email,
        phone: {
          number: telefono,
        },
      },
      additional_info: "Reserva generada desde el sitio web",
    };

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
        localStorage.setItem("datosReserva", JSON.stringify({
          servicioId: servicio?._id,
          terapeutaId: servicio?.terapeuta?._id,
          precio: Number(servicio?.precio) || 0,
          fechaReserva: fecha,
          horaReserva: hora,
        }));

        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("emailUsuario", email);
        localStorage.setItem("telefonoUsuario", telefono);

        window.location.href = data.init_point;
      } else {
        alert("Error al generar el link de pago.");
      }
    } catch (err) {
      console.error("❌ Error al iniciar el pago:", err);
      alert("Ocurrió un error al iniciar el pago.");
    }
  };

  if (expirado) {
    return (
      <div className="bg-white pt-24 pb-24 px-6 max-w-xl mx-auto text-center text-[#333] min-h-screen">
        <h2 className="text-2xl pt-24 font-bold text-red-600 mb-4">⏱️ Tiempo expirado</h2>
        <p className="mb-4">La reserva fue cancelada automáticamente por falta de pago.</p>
        <p className="mb-6">Estás siendo redirigid@ a los servicios disponibles...</p>
        <Link to="/servicios" className="text-[#009EE3] underline">
          Ir ahora
        </Link>
      </div>
    );
  }

return (
  <div className="bg-white pt-24 pb-16 px-4 max-w-xl mx-auto min-h-screen text-[#333]">
    {/* Resumen */}
    <div className="bg-white rounded-xl p-5 mb-8 shadow-md text-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">Resumen de tu reserva 🌸</h3>
      <div className="grid grid-cols-2 gap-4 items-start">
        <div className="flex flex-col justify-between h-full space-y-4 p-4 divide-y">
          <p className="pt-1"><span className="text-pink-500">Servicio</span><br />{servicio?.titulo}</p>
          <p className="pt-4"><span className="text-pink-500">Modalidad</span><br />{servicio?.modalidad}</p>
         <p className="pt-4">
<span className="text-pink-500">Fecha</span><br />
{fecha ? new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long" }) : "-"}
</p>

          <p className="pt-4"><span className="text-pink-500">Duración</span><br />{typeof servicio?.duracion === "number" ? formatearDuracion(servicio.duracion) : "Duración no disponible"}</p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-4 p-4 divide-y">
          <p className="pt-1"><span className="text-pink-500">Terapeuta</span><br />{servicio?.terapeuta?.nombreCompleto || "Sin definir"}</p>
          <p className="pt-4"><span className="text-pink-500">Precio</span><br />${servicio?.precio}</p>
          <p className="pt-4"><span className="text-pink-500">Hora</span><br />{hora} a {calcularHoraFin(hora, servicio?.duracion)} hs</p>
          
          <div className="pt-4">
            <span className="text-pink-500">Plataforma</span><br />
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
      <h2 className="text-lg font-semibold text-center outline-none mb-6">Completá con tus datos 🪴</h2>
      <input 
        type="text" 
        placeholder="Nombre y apellido" 
        value={nombre} 
        onChange={(e) => setNombre(e.target.value)} 
        required 
      className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-0 outline-none" 
      />

      <input 
        type="email" 
        placeholder="Correo electrónico" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-0 outline-none" 
      />

      <input 
        type="tel" 
        placeholder="Teléfono (sin el 15)" 
        pattern="[0-9]{10}" 
        maxLength={10} 
        value={telefono} 
        onChange={(e) => setTelefono(e.target.value)} 
        required 
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-0 outline-none" 
      />
    </form>

    {/* Temporizador */}
    <div className="flex justify-center mt-10">
      <div className="w-28 h-28 border border-[#009EE3] rounded-full flex items-center justify-center">
        <span className="text-3xl text-[#009EE3] font-mono">{minutos}:{segundos.toString().padStart(2, "0")}</span>
      </div>
    </div>
    <p className="text-center text-[#009EE3] mt-2 font-medium">Tiempo restante para completar el pago</p>
    <p className="text-center text-sm text-gray-500 mt-1 mb-4 px-6">Si no realizás el pago antes de que finalice el tiempo, la reserva será cancelada automáticamente.</p>

    {/* Términos y botón */}
    <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
      <div className="flex items-center mb-4">
        <input type="checkbox" id="terminos" checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} className="mr-2" />
        <label htmlFor="terminos" className="text-sm text-[#333]">
          Acepto la{" "}
          <Link to="/privacidad" target="_blank" rel="noopener noreferrer" className="underline text-[#009EE3]">
            Política de Privacidad
          </Link>
        </label>
      </div>
      <button type="button" disabled={!aceptaTerminos} onClick={iniciarPago} className={`w-full mb-24 py-2 rounded-3xl text-lg transition ${aceptaTerminos ? "bg-[#009EE3] text-white hover:bg-[#007dc1]" : "bg-gray-300 text-white cursor-not-allowed"}`}>
        Pagar con Mercado Pago
      </button>
    </div>
  </div>
);
}

export default PaginaPagoSimple;
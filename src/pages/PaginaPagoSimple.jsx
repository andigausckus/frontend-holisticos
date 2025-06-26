import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

function PaginaPagoSimple() {
  const location = useLocation();
  const { servicio, fecha, hora } = location.state || {};

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [minutos, setMinutos] = useState(10);
  const [segundos, setSegundos] = useState(0);

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
          title: servicio?.nombre || "Sesión",
          description: `Sesión con ${servicio?.terapeuta} el ${fecha} a las ${hora}`,
          quantity: 1,
          currency_id: "ARS",
          unit_price: Number(servicio?.precio) || 1000,
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
      additional_info: mensaje || "Sin mensaje",
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
        window.location.href = data.init_point;
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
        <div className="grid grid-cols-2 divide-x divide-gray-200 border rounded-[5px] overflow-hidden">
          <div className="space-y-4 p-4 divide-y divide-gray-200">
            <p className="pt-1"><span className="font-semibold">Servicio:</span><br />{servicio?.nombre}</p>
            <p className="pt-4"><span className="font-semibold">Terapeuta:</span><br />{servicio?.terapeuta}</p>
            <p className="pt-4"><span className="font-semibold">Modalidad:</span><br />{servicio?.modalidad}</p>
            <p className="pt-4"><span className="font-semibold">Día:</span><br />{fecha ? new Date(fecha).toLocaleDateString("es-AR") : "-"}</p>
          </div>
          <div className="space-y-4 p-4 divide-y divide-gray-200">
            <p className="pt-1"><span className="font-semibold">Hora:</span><br />{hora}</p>
            <p className="pt-4"><span className="font-semibold">Duración:</span><br />{servicio?.duracion}</p>
            <p className="pt-4"><span className="font-semibold">Precio:</span><br />${servicio?.precio}</p>
            <p className="pt-4"><span className="font-semibold">Plataforma:</span><br />{servicio?.plataforma}</p>
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
          className="w-full p-2 mb-4 bg-white border border-[#444444] rounded-lg outline-none"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <textarea
          placeholder="¿Querés dejarle un mensaje al terapeuta?"
          rows={3}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full p-2 mb-4 bg-white border border-[#444444] rounded-lg outline-none"
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
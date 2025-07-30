import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { FaCheckCircle, FaCopy } from "react-icons/fa";

export default function Pago() {
  const location = useLocation();
  const navigate = useNavigate();
  const { servicio, fecha, hora, datosUsuario } = location.state || {};
  const [nombre, setNombre] = useState('');
const [email, setEmail] = useState('');

  const [reservaTemporal, setReservaTemporal] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(120);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  if (!servicio || !fecha || !hora) {
    return (
      <div className="p-6 pt-24 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">Datos inválidos</h2>
        <p>Faltan datos para confirmar la reserva.</p>
        <p className="mt-4 text-gray-600">Redirigiendo a servicios...</p>
      </div>
    );
  }

  const calcularHoraFin = (inicio, duracionMin) => {
  const [h, m] = inicio.split(":").map(Number);
  const inicioDate = new Date();
  inicioDate.setHours(h);
  inicioDate.setMinutes(m);
  inicioDate.setMinutes(inicioDate.getMinutes() + (duracionMin || 60)); // Duración por defecto 60 min
  return inicioDate.toTimeString().slice(0, 5); // "HH:MM"
};

  useEffect(() => {
    const verificarBloqueo = async () => {
      try {
        const resp = await fetch(
          `${API_URL}/api/bloqueos/temporales/expiracion?servicioId=${servicio._id}&fecha=${fecha}&hora=${hora}`
        );
        const data = await resp.json();
        if (data.expirado) {
          alert("El tiempo para confirmar esta reserva expiró.");
          navigate("/servicios");
        }
      } catch (error) {
        console.error("Error verificando bloqueo:", error);
      }
    };

    const intervalo = setInterval(verificarBloqueo, 5000);
    return () => clearInterval(intervalo);
  }, [servicio, fecha, hora, navigate]);

  useEffect(() => {
    if (reservaTemporal) return;

    const crearReservaTemporal = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/bloqueos/temporales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            servicioId: servicio._id,
            terapeutaId: servicio.terapeutaId,
            nombreUsuario: datosUsuario?.nombre || "",
            emailUsuario: datosUsuario?.email || "",
            mensaje: datosUsuario?.mensaje || "",
            fecha,
            hora,
          }),
        });
        const data = await resp.json();
        setReservaTemporal(data);
      } catch (error) {
        console.error("Error al crear reserva temporal:", error);
      }
    };

    crearReservaTemporal();
  }, [servicio, fecha, hora, datosUsuario, reservaTemporal]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          alert("El tiempo para completar esta reserva expiró.");
          navigate("/servicios");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [navigate]);

  const confirmarReserva = async () => {
    try {
      const resp = await fetch(`${API_URL}/api/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicioId: servicio._id,
          terapeutaId: servicio.terapeutaId,
          fecha,
          hora,
          nombreUsuario: nombre,
          emailUsuario: email,
          mensaje: datosUsuario?.mensaje || "",
        }),
      });

      const data = await resp.json();
      setReservaConfirmada(true);
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
    }
  };

  const copiarTexto = (texto) => {
    navigator.clipboard.writeText(texto);
  };

  const formatTiempo = (s) => {
    const min = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (reservaConfirmada) {
    return (
      <div className="p-6 pt-24 text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">¡Reserva confirmada!</h2>
        <p className="mb-4">
          Gracias por reservar. El terapeuta se pondrá en contacto contigo.
        </p>
        <button
          className="bg-violet-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
  <div className="p-6 pt-24 max-w-xl mx-auto space-y-6">
    
    {/* Detalles del servicio en una línea */}
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h3 className="mb-4 text-base font-semibold text-left text-[#444444]">Detalles del servicio</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-800 text-base space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-1">
          <span>🌿</span>
          <span>{servicio.titulo}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>🗓️</span>
          <span>{new Date(fecha).toLocaleDateString("es-AR")}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>⏰</span>
          <span>
  {hora} a {calcularHoraFin(hora, servicio.duracion)} hs
</span>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h3 className="text-base text-[#444444] font-semibold">Tus datos</h3>

      <input
        type="text"
        name="nombre"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full border border-[#444444] rounded-[5px] px-3 py-2 text-sm text-[#333] focus:outline-none focus:border-[#444444]"
      />

      <input
        type="email"
        name="email"
        placeholder="Tu correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border border-[#444444] rounded-[5px] px-3 py-2 text-sm text-[#333] focus:outline-none focus:border-[#444444]"
      />
    </div>

    {/* Datos para la transferencia */}
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-base font-semibold text-left mb-4">Datos para la transferencia</h3>
      <div className="text-sm space-y-1 divide-y divide-gray-200">
        {[
          { label: "Titular admin", value: "Andres Nazareth Olivera Gausckus", copiar: false },
          { label: "CVU", value: "0000003100010544642813", copiar: true },
          { label: "Alias", value: "ServiciosHolisticos.", copiar: true },
          { label: "CUIT/CUIL", value: "20349950007", copiar: false },
        ].map(({ label, value, copiar }, idx) => (
          <div key={idx} className="pt-2">
            <p className="text-sm font-semibold text-gray-600">{label}</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-800 text-base">{value}</p>
              {copiar && (
                <FaCopy
                  className="cursor-pointer ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => copiarTexto(value)}
                  title="Copiar"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Subir comprobante de pago */}
    <div>
      <h3 className="text-base text-left font-semibold mb-2">Subí el comprobante de pago</h3>
      <input type="file" className="border p-2 w-full rounded" />
    </div>

    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 36 36"
        >
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-sky-500"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${(tiempoRestante / 120) * 100}, 100`}
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm">
          {formatTiempo(tiempoRestante)}
        </div>
      </div>
      <p className="mt-2 text-sm text-[#444]">Tiempo para completar tu reserva</p>
    </div>

    <button
      onClick={confirmarReserva}
      className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 w-full"
    >
      Confirmar y enviar pago
    </button>
  </div>
);
}
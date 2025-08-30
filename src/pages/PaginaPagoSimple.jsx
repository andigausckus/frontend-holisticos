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
  const [comprobantePago, setComprobantePago] = useState(null);
const [urlComprobante, setUrlComprobante] = useState("");

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
            terapeutaId: servicio.terapeuta._id || servicio.terapeuta,
            nombreUsuario: datosUsuario?.nombre || "",
            emailUsuario: datosUsuario?.email || "",
            mensaje: datosUsuario?.mensaje || "",
            fecha,
            hora,
            precio: servicio.precio,        // <-- AÑADIR
            duracion: servicio.duracion     // <-- AÑADIR
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
  const claveStorage = "limitePago";

  let horaLimite = localStorage.getItem(claveStorage);

  if (!horaLimite) {
    const nuevaHoraLimite = Date.now() + 5 * 60 * 1000; // 5 minutos
    localStorage.setItem(claveStorage, nuevaHoraLimite);
    horaLimite = nuevaHoraLimite;
  }

  const idIntervalo = setInterval(() => {
    const ahora = Date.now();
    const diferencia = parseInt(horaLimite) - ahora;

    if (diferencia <= 0) {
      setTiempoRestante(0);
      clearInterval(idIntervalo);
      localStorage.removeItem(claveStorage);
      window.location.href = "/#/servicios"; // redirige a servicios
    } else {
      setTiempoRestante(Math.floor(diferencia / 1000));
    }
  }, 1000);

  return () => clearInterval(idIntervalo);
}, []);

  // ⬆️ otras imports arriba

const subirACloudinary = async (archivo) => {
  const data = new FormData();
  data.append("file", archivo);
  data.append("upload_preset", "servicios_holisticos");

  try {
    const resp = await fetch("https://api.cloudinary.com/v1_1/dbu5cfqzf/image/upload", {
      method: "POST",
      body: data,
    });

    const json = await resp.json();
    return json.secure_url;
  } catch (err) {
    console.error("❌ Error subiendo a Cloudinary:", err);
    return null;
  }
};

  const confirmarReserva = async () => {
    console.log("⏳ Intentando confirmar reserva con los siguientes datos:");
    console.log("servicio._id:", servicio._id);
    console.log("servicio.terapeuta._id:", servicio.terapeuta?._id);
    console.log("servicio.precio:", servicio.precio);
    console.log("servicio.duracion:", servicio.duracion);

    if (
      !servicio ||
      !servicio._id ||
      !(servicio.terapeuta?._id || servicio.terapeuta) ||
      !servicio.precio ||
      !servicio.duracion
    ) {
      console.error("❌ Datos de servicio incompletos");
      alert("Hubo un problema con los datos del servicio. Recargá la página.");
      return;
    }

    try {
      if (
        !servicio ||
        !servicio._id ||
        !(servicio.terapeuta?._id || servicio.terapeuta) ||
        !servicio.precio ||
        !servicio.duracion
      ) {
        console.error("❌ Datos de servicio incompletos");
        return alert("Hubo un problema con los datos del servicio. Recargá la página.");
      }

      console.log("✅ URL del comprobante:", urlComprobante);

      console.log("🟡 servicio:", servicio);
console.log("🟡 servicio.terapeutaId:", servicio?.terapeutaId);

      console.log("🟡 Terapeuta que se envía:", servicio.terapeutaId);

      const datosParaEnviar = {
        servicioId: servicio._id,
        terapeutaId: servicio.terapeuta._id || servicio.terapeuta,
        fecha,
        hora,
        nombreUsuario: nombre,
        emailUsuario: email,
        mensaje: datosUsuario?.mensaje || "",
        precio: servicio.precio,
        duracion: servicio.duracion,
        comprobantePago: urlComprobante,
        cbuTerapeuta: servicio.cbu,
        bancoTerapeuta: servicio.banco
      };

      console.log("🧪 Enviando datos:", datosParaEnviar);

      const resp = await fetch(`${API_URL}/api/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar),
      });

      const data = await resp.json();
      console.log("✅ Reserva confirmada:", data);
      setReservaConfirmada(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      localStorage.removeItem("limitePago");
    } catch (error) {
      console.error("❌ Error al confirmar reserva:", error);
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
        <h2 className="text-2xl font-bold mb-2">¡Reserva confirmada! 🎊</h2>
        <p className="mb-4">
          Te hemos enviado un email con la confirmación de tu reserva y los datos del terapeuta holístico. Revisá tu bandeja de entrada y tu carpeta de spam. 
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

  const botonDeshabilitado = !nombre.trim() || !email.trim() || !urlComprobante.trim();

  return (
  <div className="p-6 pt-24 max-w-xl mx-auto space-y-6">
    
    {/* Detalles del servicio en una línea */}
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h3 className="mb-4 text-base font-medium text-left text-[#444444]">Detalles del servicio</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-800 text-base space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-1">
          <span>🌿</span>
          <span>{servicio.titulo}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>🗓️</span>
          <span>{(() => {
            const [year, month, day] = fecha.split("-").map(Number);
            const fechaObj = new Date(year, month - 1, day);
            return fechaObj.toLocaleDateString("es-AR");
          })()}</span>
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
      <h3 className="text-base text-[#444444] font-medium">Tus datos</h3>

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
        <h3 className="text-base font-medium text-left mb-1">Datos para la transferencia</h3>
        <p className="text-sm text-gray-600 mb-4">
          Sugerimos pagar con una billetera virtual (MercadoPago, Ualá, etc) para una acreditación inmediata
        </p>
      <div className="text-sm space-y-1 divide-y divide-gray-200">
        {[
          { label: "Titular admin", value: "Andres Nazareth Olivera Gausckus", copiar: false },
          { label: "CVU", value: "0000003100010544642813", copiar: true },
          { label: "Alias", value: "ServiciosHolisticos.", copiar: true },
          { label: "CUIT/CUIL", value: "20349950007", copiar: false },
        ].map(({ label, value, copiar }, idx) => (
          <div key={idx} className="pt-2">
            <p className="text-sm font-normal text-gray-600">{label}</p>
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
      <h3 className="text-base text-left font-medium mb-2">Subí el comprobante de tu pago</h3>
      <input
  type="file"
  accept="image/*"
  className="border p-2 w-full rounded"
  onChange={async (e) => {
    const archivo = e.target.files[0];
    setComprobantePago(archivo);
    const url = await subirACloudinary(archivo);
    if (url) {
      setUrlComprobante(url);
      console.log("✅ URL del comprobante:", url);
    } else {
      alert("Error al subir comprobante");
    }
  }}
/>
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
            strokeDasharray={`${(tiempoRestante / 300) * 100}, 100`}
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
      disabled={botonDeshabilitado}
      className={`mt-4 px-4 py-2 rounded w-full font-semibold transition-colors duration-200 ${
        botonDeshabilitado
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-sky-500 hover:bg-sky-600 text-white'
      }`}
    >
      Confirmar reserva
    </button>
    <div className="h-24"></div> {/* Agrega un espacio de 8 unidades */}
  </div>
);
}
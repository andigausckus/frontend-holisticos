import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

function PaginaPagoSimple() {
  const location = useLocation();
  const navigate = useNavigate();
  const intervaloCuentaRegresiva = useRef(null);
  const { servicio, fecha, hora } = location.state || {};

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comprobanteURL, setComprobanteURL] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [expirado, setExpirado] = useState(false);
  const [minutos, setMinutos] = useState(1);
  const [segundos, setSegundos] = useState(0);
  const [error, setError] = useState("");

  // Guardar reserva temporal con expiración a 1 minuto
  useEffect(() => {
    const ahora = Date.now();
    const expiracion = ahora + 1 * 60 * 1000; // ⏱️ 1 minuto para pruebas
    const reservaTemporal = {
      servicioId: servicio?._id,
      fecha,
      hora,
      expiracion,
    };
    localStorage.setItem("reservaTemporal", JSON.stringify(reservaTemporal));
  }, [servicio, fecha, hora]);

  // Manejar temporizador y redirección si expira
  useEffect(() => {
    intervaloCuentaRegresiva.current = setInterval(() => {
      const reserva = JSON.parse(localStorage.getItem("reservaTemporal"));
      const ahora = Date.now();

      if (!reserva || reserva.expiracion < ahora) {
        setExpirado(true);
        clearInterval(intervaloCuentaRegresiva.current);
        localStorage.removeItem("reservaTemporal");
        setTimeout(() => navigate("/servicios"), 5000);
      } else {
        const diff = Math.floor((reserva.expiracion - ahora) / 1000);
        setMinutos(Math.floor(diff / 60));
        setSegundos(diff % 60);
      }
    }, 1000);

    return () => clearInterval(intervaloCuentaRegresiva.current);
  }, [navigate]);

  const handleComprobanteChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "servicios_holisticos"); // Reemplazá por el tuyo
    formData.append("cloud_name", "dbu5cfqzf"); // Reemplazá por el tuyo

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dbu5cfqzf/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("📦 Respuesta de Cloudinary:", data); // LOG 1

      if (data.secure_url) {
        setComprobanteURL(data.secure_url);
      } else {
        console.log("❌ Error esperado:", data); // LOG 2
        setError("Error al subir el comprobante.");
      }
    } catch (err) {
      console.error("❌ Error inesperado al subir a Cloudinary:", err); // LOG 3
      setError("Error al subir el comprobante.");
    }
  };

  const handleSubmit = async () => {
    if (!nombre || !email || !telefono || !comprobanteURL) {
      alert("Completá todos los campos y subí el comprobante.");
      return;
    }

    clearInterval(intervaloCuentaRegresiva.current);
    localStorage.removeItem("reservaTemporal");

    try {
      console.log("📤 Enviando datos al backend con:");
      console.log({
        nombre,
        email,
        telefono,
        servicioId: servicio._id,
        fecha,
        hora,
        comprobanteURL,
      });

      const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/reservas/con-comprobante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          servicioId: servicio._id,
          fecha,
          hora,
          comprobanteURL,
        }),
      });

      const data = await res.json();
      console.log("📥 Respuesta del backend:", data);

      if (res.ok) {
        setEnviado(true);
      } else {
        alert("Error al enviar el comprobante.");
      }
    } catch (err) {
      console.error("❌ Error al enviar:", err);
      alert("Ocurrió un error.");
    }
  };

  if (expirado) {
    return (
      <div className="p-6 pt-24 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">⏱️ Tiempo expirado</h2>
        <p>La reserva fue cancelada automáticamente.</p>
        <p className="mt-4 text-gray-600">Redirigiendo a servicios...</p>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="p-6 pt-24 text-center text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Comprobante enviado 🎉</h2>
        <p>Gracias por tu pago. Revisaremos el comprobante y te contactaremos pronto.</p>
        <Link to="/" className="mt-6 inline-block text-blue-600 underline">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="bg-white pt-24 pb-16 px-4 max-w-xl mx-auto min-h-screen text-[#333]">
      <h2 className="text-2xl font-semibold mb-6 text-center">Confirmá tu reserva</h2>

      <div className="bg-gray-50 p-4 rounded-xl shadow mb-6">
        <h3 className="font-bold text-[#009EE3] mb-2">Datos para transferencia</h3>
        <p>CBU: <span className="font-mono">0000003100000001234567</span></p>
        <p>Alias: <span className="font-mono">holistico.mp</span></p>
        <p>Titular: <strong>Servicios Holísticos</strong></p>
        <p className="mt-2 text-sm text-gray-500">* Una vez hecho el pago, subí el comprobante abajo.</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Teléfono (sin 15)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Subí el comprobante de pago:</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleComprobanteChange}
            className="w-full"
          />
          {subiendo && <p className="text-sm text-blue-600 mt-1">Subiendo comprobante...</p>}
          {comprobanteURL && <p className="text-sm text-green-600 mt-1">✅ Comprobante subido</p>}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      </form>

      <div className="flex justify-center mt-6">
        <div className="w-24 h-24 border-2 border-[#009EE3] rounded-full flex items-center justify-center">
          <span className="text-xl font-mono text-[#009EE3]">
            {minutos}:{segundos.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-2 mb-6">Tiempo restante para enviar el comprobante</p>

      <button
        onClick={handleSubmit}
        className={`w-full py-2 rounded-lg text-white ${comprobanteURL ? "bg-[#009EE3] hover:bg-[#007bbd]" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={!comprobanteURL}
      >
        Ya realicé el pago
      </button>
    </div>
  );
}

export default PaginaPagoSimple;
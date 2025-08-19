import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPagos = () => {
  console.log("🧠 Componente AdminPagos montado");
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerReservas = async () => {
    console.log("⏳ Llamando a obtenerReservas()...");

    try {
      const res = await axios.get(
        "https://servicios-holisticos-backend.onrender.com/api/reservas/admin/reservas-confirmadas"
      );
      console.log("✅ Respuesta axios:", res.data);
      setReservas(res.data);
    } catch (error) {
      console.error("❌ Error al obtener reservas confirmadas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  // 🔍 Prueba paralela con fetch
  useEffect(() => {
    console.log("🔍 useEffect de prueba con fetch...");
    fetch(
      "https://servicios-holisticos-backend.onrender.com/api/reservas/admin/reservas-confirmadas"
    )
      .then((res) => res.json())
      .then((data) =>
        console.log("✅ Respuesta directa con fetch:", data)
      )
      .catch((err) => console.error("❌ Error con fetch:", err));
  }, []);

  if (loading) return <p className="text-center">Cargando reservas...</p>;
  if (reservas.length === 0)
    return <p className="text-center">No hay reservas confirmadas.</p>;

return (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-center mb-6">
      📅 Reservas confirmadas
    </h1>

    <div className="space-y-6">
      {reservas.map((reserva) => (
        <div key={reserva._id} className="p-4 bg-white rounded-xl shadow">
          <p><strong>Usuario:</strong> {reserva.nombreUsuario}</p>
          <a
            href={reserva.comprobantePago}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-pink-600 underline"
          >
            Ver comprobante
          </a>
        </div>
      ))}
    </div>
  </div>
);
};

export default AdminPagos;
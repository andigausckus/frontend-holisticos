import React, { useEffect, useState } from "react";
import axios from "axios";

// 🔧 Aseguramos que todas las peticiones vayan al backend en Render
axios.defaults.baseURL = "https://servicios-holisticos-backend.onrender.com";

const PagosPendientes = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerReservas = async () => {
    try {
      const res = await axios.get("/api/admin/reservas-pendientes");
      setReservas(res.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error al obtener reservas pendientes:", error);
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`/api/admin/reserva/${id}`, {
        estado: nuevoEstado,
      });

      // Eliminamos la reserva aprobada/rechazada del estado local
      setReservas(reservas.filter((r) => r._id !== id));
    } catch (error) {
      console.error("❌ Error al actualizar reserva:", error);
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  if (loading) return <p className="text-center">Cargando reservas...</p>;
  if (reservas.length === 0)
    return <p className="text-center">No hay pagos pendientes.</p>;

  return (
    <div className="space-y-6">
      {reservas.map((reserva) => (
        <div key={reserva._id} className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-bold">🧾 Comprobante de pago</h3>
          <p><strong>Usuario:</strong> {reserva.usuario?.nombre}</p>
          <p><strong>Email:</strong> {reserva.usuario?.email}</p>
          <p><strong>Terapeuta:</strong> {reserva.terapeuta?.nombre}</p>
          <p><strong>Servicio:</strong> {reserva.servicio?.titulo}</p>
          <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleString()}</p>
          <a
            href={reserva.comprobantePago}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-pink-600 underline"
          >
            Ver comprobante
          </a>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => actualizarEstado(reserva._id, "aprobada")}
              className="px-4 py-1 bg-green-500 text-white rounded"
            >
              ✅ Aprobar
            </button>
            <button
              onClick={() => actualizarEstado(reserva._id, "rechazada")}
              className="px-4 py-1 bg-red-500 text-white rounded"
            >
              ❌ Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PagosPendientes;
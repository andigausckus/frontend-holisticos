// src/components/Admin/EmailsResenasPendientes.jsx
import React, { useState, useEffect } from "react";

const EmailsResenasPendientes = ({ actualizarCantidad }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservasPendientes = async () => {
    try {
      const res = await fetch(
        "https://servicios-holisticos-backend.onrender.com/api/admin/emails-resenas-pendientes"
      );
      if (!res.ok) throw new Error("Error al obtener reservas pendientes de reseña");
      const data = await res.json();
      setReservas(data);
      actualizarCantidad && actualizarCantidad(data.length);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error al cargar reservas pendientes de reseña:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservasPendientes();
    const intervalo = setInterval(fetchReservasPendientes, 30000); // refrescar cada 30s
    return () => clearInterval(intervalo);
  }, []);

  const enviarEmailResena = async (reservaId) => {
    try {
      const res = await fetch(
        `https://servicios-holisticos-backend.onrender.com/api/admin/enviar-email-resena/${reservaId}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Error al enviar email de reseña");
      alert("Email de reseña enviado ✅");
      fetchReservasPendientes(); // refrescar lista
    } catch (error) {
      console.error("❌ Error al enviar email de reseña:", error);
    }
  };

  if (loading) return <p>Cargando reservas pendientes...</p>;
  if (reservas.length === 0) return <p>No hay reservas pendientes de email de reseña.</p>;

  return (
    <div className="space-y-4">
      {reservas.map((reserva) => {
        // Formatear fecha a DD/MM/YYYY
        const fechaParts = reserva.fecha.split("-");
        const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;

        // Calcular hora final si no está definida
        let horaFinal = reserva.horaFinal;
        if (!horaFinal && reserva.duracion) {
          const [h, m] = reserva.hora.split(":").map(Number);
          const fechaTemp = new Date();
          fechaTemp.setHours(h);
          fechaTemp.setMinutes(m + reserva.duracion);
          const hh = fechaTemp.getHours().toString().padStart(2, "0");
          const mm = fechaTemp.getMinutes().toString().padStart(2, "0");
          horaFinal = `${hh}:${mm}`;
        }

        return (
          <div key={reserva._id} className="p-4 bg-white rounded-lg shadow">
            <div className="text-sm space-y-1">
              <p>Cliente: {reserva.nombreUsuario} ({reserva.emailUsuario})</p>
              <p>Terapeuta: {reserva.terapeutaId.nombreCompleto}</p>
              <p>Servicio: {reserva.servicioId.titulo}</p>
              <p>Sesión: {fechaFormateada} | {reserva.hora} - {horaFinal || "-"}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => enviarEmailResena(reserva._id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Enviar email
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmailsResenasPendientes;
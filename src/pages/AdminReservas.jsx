import { useEffect, useState } from "react";

function AdminReservas() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/reservas");
        const data = await res.json();
        setReservas(data);
      } catch (err) {
        console.error("❌ Error al obtener reservas:", err);
      }
    };

    fetchReservas();
  }, []);

  return (
    <div className="pt-12 px-6 max-w-5xl mx-auto text-[#333]">
      <h1 className="text-2xl font-bold mb-6">📋 Reservas registradas</h1>

      {reservas.length === 0 ? (
        <p>No hay reservas aún.</p>
      ) : (
        <div className="grid gap-4">
          {reservas.map((reserva) => (
            <div
              key={reserva._id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
            >
              <p><strong>Usuario:</strong> {reserva.usuarioNombre}</p>
              <p><strong>Email:</strong> {reserva.usuarioEmail}</p>
              <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleString("es-AR")}</p>
              <p><strong>Terapeuta ID:</strong> {reserva.terapeutaId}</p>
              {reserva.servicioId && (
                <p><strong>Servicio ID:</strong> {reserva.servicioId}</p>
              )}
              {reserva.precio && (
                <p><strong>Precio:</strong> ${reserva.precio}</p>
              )}
              {reserva.paymentId && (
                <p><strong>Pago:</strong> ID {reserva.paymentId}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReservas;
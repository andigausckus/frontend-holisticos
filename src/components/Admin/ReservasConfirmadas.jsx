import { useEffect, useState } from "react";
import axios from "axios";

const ReservasConfirmadas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerReservas = async () => {
    try {
      const res = await axios.get(
        "https://servicios-holisticos-backend.onrender.com/api/admin/reservas-confirmadas"
      );
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

  if (loading) return <p>Cargando reservas confirmadas...</p>;

  if (reservas.length === 0) return <p>No hay reservas confirmadas.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reservas confirmadas</h2>
      <ul className="space-y-4">
        {reservas.map((reserva) => (
          <li key={reserva._id} className="bg-white p-4 rounded shadow">
            <p><strong>Cliente:</strong> {reserva.nombreUsuario}</p>
            <p><strong>Servicio:</strong> {reserva.servicio?.titulo || "Sin título"}</p>
            <p><strong>Fecha:</strong> {reserva.fecha} - {reserva.hora}</p>
            {reserva.comprobantePago && (
              <div className="mt-2">
                <a
                  href={reserva.comprobantePago}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver comprobante
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservasConfirmadas;
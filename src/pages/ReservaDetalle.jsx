import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReservaDetalle() {
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch(`https://servicios-holisticos-backend.onrender.com/api/reservas`)
      .then(res => res.json())
      .then(data => {
        const encontrada = data.find(r => r._id === id);
        if (encontrada) setReserva(encontrada);
        else navigate("/panel");
      })
      .catch(err => {
        console.error("❌ Error al cargar reserva:", err);
        navigate("/panel");
      });
  }, [id, navigate]);

  if (!reserva) return <p className="p-6 text-gray-600">Cargando reserva...</p>;

  return (
    <div className="bg-white pt-24 p-6 max-w-xl mx-auto min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-4">📝 Detalles de la reserva</h1>

      <p className="text-sm mb-2"><strong>Fecha y hora:</strong> {new Date(reserva.fecha).toLocaleString("es-AR")}</p>
      <p className="text-sm mb-2"><strong>Nombre:</strong> {reserva.usuarioNombre}</p>
      <p className="text-sm mb-2"><strong>Email:</strong> {reserva.usuarioEmail}</p>
      <div className="mb-4">
        <label className="text-sm block mb-1 text-[#333] font-medium">Estado de la reserva</label>
        <select
          value={reserva.estado || "pendiente"}
          onChange={async (e) => {
            const nuevoEstado = e.target.value;
            try {
              const res = await fetch(
                `https://servicios-holisticos-backend.onrender.com/api/reservas/${reserva._id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({ estado: nuevoEstado }),
                }
              );
              const data = await res.json();
              if (res.ok) {
                setReserva((prev) => ({ ...prev, estado: nuevoEstado }));
                alert("✅ Estado actualizado correctamente");
              } else {
                alert("❌ Error al actualizar: " + data.mensaje);
              }
            } catch (error) {
              console.error("❌ Error al actualizar estado:", error);
              alert("❌ Error al conectar con el servidor");
            }
          }}
          className="w-full p-2 border border-gray-400 rounded-lg"
        >
          <option value="pendiente">⏳ Pendiente</option>
          <option value="confirmada">✅ Confirmada</option>
          <option value="cancelada">❌ Cancelada</option>
          <option value="completada">🎉 Completada</option>
        </select>
      </div>
      <p className="text-sm mb-2"><strong>Servicio:</strong> {reserva.servicioId?.titulo || "No especificado"}</p>
      
      {reserva.comentario && (
        <p className="text-sm mb-2">
          <strong>Comentario del usuario:</strong><br />
          {reserva.comentario}
        </p>
      )}

      <button
        onClick={() => navigate("/panel")}
        className="mt-6 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Volver al panel
      </button>
    </div>
  );
}
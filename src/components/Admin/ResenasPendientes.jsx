// src/components/Admin/ResenasPendientes.jsx
import React, { useEffect, useState } from "react";

const ResenasPendientes = () => {
  const [resenas, setResenas] = useState([]);

  // Traer reseñas pendientes
  useEffect(() => {
    fetch("https://servicios-holisticos-backend.onrender.com/api/admin/resenas-pendientes")
      .then(res => res.json())
      .then(data => setResenas(data))
      .catch(err => console.error("❌ Error:", err));
  }, []);

  // Aprobar reseña
  const aprobarResena = (id) => {
    fetch(`https://servicios-holisticos-backend.onrender.com/api/admin/aprobar-resena/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobado: true }),
    })
      .then(res => res.json())
      .then(() => {
        setResenas(prev => prev.filter(r => r._id !== id));
      })
      .catch(err => console.error("❌ Error al aprobar reseña:", err));
  };

  // Rechazar reseña (eliminar de la DB)
  const rechazarResena = (id) => {
    fetch(`https://servicios-holisticos-backend.onrender.com/api/admin/rechazar-resena/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        setResenas(prev => prev.filter(r => r._id !== id));
      })
      .catch(err => console.error("❌ Error al rechazar reseña:", err));
  };

  return (
    <div>
      <h2 className="bg-white text-xl mb-4">Reseñas pendientes</h2>
      {resenas.length === 0 ? (
        <p>No hay reseñas para revisar.</p>
      ) : (
        resenas.map(r => (
          <div key={r._id} className="bg-white rounded-xl p-4 shadow mb-4">
            <p>Nombre: {r.nombre}</p>
            <p>Valoración: {r.puntaje} ⭐</p>
            <p>Comentario: {r.comentario}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => aprobarResena(r._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Aprobar
              </button>
              <button
                onClick={() => rechazarResena(r._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResenasPendientes;
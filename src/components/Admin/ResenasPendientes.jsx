// src/components/Admin/ResenasPendientes.jsx
import React, { useEffect, useState } from "react";

const ResenasPendientes = () => {
  const [resenas, setResenas] = useState([]);

  useEffect(() => {
    fetch("https://servicios-holisticos-backend.onrender.com/api/admin/resenas-pendientes")
      .then(res => res.json())
      .then(data => setResenas(data))
      .catch(err => console.error("❌ Error:", err));
  }, []);

  const manejarAccion = (id, aprobado) => {
    fetch(`https://servicios-holisticos-backend.onrender.com/api/admin/aprobar-resena/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobado }),
    })
      .then(res => res.json())
      .then(() => {
        setResenas(prev => prev.filter(r => r._id !== id));
      });
  };

  return (
    <div>
      <h2 className="bg-white text-xl font-semibold mb-4">Reseñas pendientes</h2>
      {resenas.length === 0 ? (
        <p>No hay reseñas para revisar.</p>
      ) : (
        resenas.map(r => (
          <div key={r._id} className="bg-white rounded-xl p-4 shadow mb-4">
            <p><strong>Nombre:</strong> {r.nombre}</p>
            <p><strong>Valoración:</strong> {r.puntaje} ⭐</p>
            <p><strong>Comentario:</strong> {r.comentario}</p>
            <p><strong>Terapeuta:</strong> {r.terapeuta?.nombreCompleto || "ID: " + r.terapeuta}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => manejarAccion(r._id, true)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Aprobar
              </button>
              <button
                onClick={() => manejarAccion(r._id, false)}
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
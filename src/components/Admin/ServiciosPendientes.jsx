// src/components/Admin/ServiciosPendientes.jsx
import React, { useEffect, useState } from "react";

const ServiciosPendientes = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    fetch("https://servicios-holisticos-backend.onrender.com/api/admin/servicios-pendientes")
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(err => console.error("❌ Error:", err));
  }, []);

  const manejarAccion = (id, aprobado) => {
    fetch(`https://servicios-holisticos-backend.onrender.com/api/admin/aprobar-servicio/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobado }),
    })
      .then(res => res.json())
      .then(() => {
        setServicios(prev => prev.filter(s => s._id !== id));
      });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Servicios pendientes</h2>
      {servicios.length === 0 ? (
        <p>No hay servicios para revisar.</p>
      ) : (
        servicios.map(s => (
          <div
            key={s._id}
            className="bg-white rounded-xl p-4 shadow mb-4 flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <p><strong>Título:</strong> {s.titulo}</p>
              <p><strong>Precio:</strong> ${s.precio}</p>
              <p><strong>Modalidad:</strong> {s.modalidad}</p>
              <p><strong>Terapeuta:</strong> {s.terapeuta?.nombreCompleto}</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => manejarAccion(s._id, true)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Aprobar
              </button>
              <button
                onClick={() => manejarAccion(s._id, false)}
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

export default ServiciosPendientes;
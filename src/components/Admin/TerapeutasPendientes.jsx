import React, { useEffect, useState } from "react";

const TerapeutasPendientes = () => {
  const [terapeutas, setTerapeutas] = useState([]);

  useEffect(() => {
    fetch("https://servicios-holisticos-backend.onrender.com/api/admin/terapeutas-pendientes")
      .then(res => res.json())
      .then(data => setTerapeutas(data))
      .catch(err => console.error("❌ Error:", err));
  }, []);

  const manejarAccion = (id, aprobado) => {
    fetch(`https://servicios-holisticos-backend.onrender.com/api/admin/aprobar-terapeuta/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobado }),
    })
      .then(res => res.json())
      .then(() => {
        setTerapeutas(prev => prev.filter(t => t._id !== id));
      })
      .catch(err => console.error("❌ Error:", err));
  };

  return (
    <div>
      <h2 className="bg-white text-xl font-semibold mb-4">Terapeutas pendientes</h2>
      {terapeutas.length === 0 ? (
        <p>No hay terapeutas para revisar.</p>
      ) : (
        terapeutas.map(t => (
          <div
            key={t._id}
            className="bg-white rounded-xl p-4 shadow mb-4 flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <p><strong>Nombre:</strong> {t.nombreCompleto}</p>
              <p><strong>Email:</strong> {t.email}</p>
              <p><strong>Especialidades:</strong> {t.especialidades}</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => manejarAccion(t._id, true)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Aprobar
              </button>
              <button
                onClick={() => manejarAccion(t._id, false)}
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

export default TerapeutasPendientes;
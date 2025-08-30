// src/components/Admin/ServiciosPendientes.jsx
import React, { useEffect, useState } from "react";

const ServiciosPendientes = ({ actualizarCantidad }) => {
  const [servicios, setServicios] = useState([]);
  const [verTodos, setVerTodos] = useState(false);

  useEffect(() => {
    fetch("https://servicios-holisticos-backend.onrender.com/api/admin/servicios-pendientes")
      .then(res => res.json())
      .then(data => {
        const pendientes = data.filter(s => !s.aprobado && !s.rechazado);
        setServicios(pendientes);
      })
      .catch(err => console.error("❌ Error:", err));
  }, []);

  useEffect(() => {
    if (actualizarCantidad) actualizarCantidad(servicios.length);
  }, [servicios, actualizarCantidad]);

  const manejarAccion = (id, aprobado) => {
    const url = aprobado
      ? `https://servicios-holisticos-backend.onrender.com/api/admin/aprobar-servicio/${id}`
      : `https://servicios-holisticos-backend.onrender.com/api/admin/rechazar-servicio/${id}`;

    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobado: aprobado || false }),
    })
      .then(res => res.json())
      .then(() => {
        // 🔹 Remover el servicio aprobado o rechazado del estado local
        setServicios(prev => prev.filter(s => s._id !== id && !s.rechazado));
        if (actualizarCantidad) actualizarCantidad(prev => prev.length - 1);
      })
      .catch(err => console.error("❌ Error al actualizar servicio:", err));
  };

  const serviciosAMostrar = verTodos ? servicios : servicios.slice(0, 3);

  return (
    <div>
      <h2 className="bg-white text-xl font-semibold mb-4 p-3 rounded-md shadow">
        Servicios pendientes
      </h2>

      {servicios.length === 0 ? (
        <p className="text-gray-600">No hay servicios para revisar.</p>
      ) : (
        <>
          {serviciosAMostrar.map(s => (
            <div
              key={s._id}
              className="bg-white rounded-xl p-5 shadow mb-6 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <p className="text-lg font-semibold text-gray-800">{s.titulo}</p>
                <p className="text-sm text-gray-500">Precio: ${s.precio}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Terapeuta: {s.terapeuta?.nombreCompleto}
                </p>

                {s.imagen && (
                  <div className="w-full md:w-64">
                    <img
                      src={s.imagen}
                      alt="Preview del servicio"
                      className="rounded-lg border shadow-sm max-h-56 object-cover"
                    />
                    <p className="text-xs text-gray-500 mt-1">📷 Ver imagen</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => manejarAccion(s._id, true)}
                  className="bg-green-200 text-green-800 px-3 py-1 rounded shadow hover:bg-green-300 transition"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => manejarAccion(s._id, false)}
                  className="bg-red-200 text-red-800 px-3 py-1 rounded shadow hover:bg-red-300 transition"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}

          {servicios.length > 3 && (
            <button
              onClick={() => setVerTodos(!verTodos)}
              className="mt-2 text-sm text-gray-600 hover:underline"
            >
              {verTodos ? "Mostrar menos" : `Ver más servicios (${servicios.length - 3})`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ServiciosPendientes;
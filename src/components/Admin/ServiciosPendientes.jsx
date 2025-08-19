// src/components/Admin/ServiciosPendientes.jsx
import React, { useEffect, useState } from "react";

const ServiciosPendientes = ({ actualizarCantidad }) => {
  const [servicios, setServicios] = useState([]);
  const [verTodos, setVerTodos] = useState(false);

  useEffect(() => {
    fetch("https://servicios-holisticos-backend.onrender.com/api/admin/servicios-pendientes")
      .then(res => res.json())
      .then(data => {
        // 🔹 Filtramos solo los servicios pendientes
        const pendientes = data.filter(s => !s.aprobado);
        setServicios(pendientes);
      })
      .catch(err => console.error("❌ Error:", err));
  }, []);

  // 🔹 Actualizar badge del padre solo cuando servicios cambien
  useEffect(() => {
    if (actualizarCantidad) actualizarCantidad(servicios.length);
  }, [servicios, actualizarCantidad]);

  const manejarAccion = (id, aprobado) => {
    fetch(`https://servicios-holisticos-backend.onrender.com/api/admin/aprobar-servicio/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobado }),
    })
      .then(res => res.json())
      .then(() => {
        setServicios(prev => prev.filter(s => s._id !== id));
        if (aprobado) alert("Servicio aprobado 🎊 ¡Ahora es visible online!");
      })
      .catch(err => console.error("❌ Error al aprobar/rechazar:", err));
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
              className="bg-white rounded-xl p-4 shadow mb-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex-1 mb-3 md:mb-0">
                <p className="text-lg text-gray-800">{s.titulo}</p>
                <p className="text-sm text-gray-500">Precio: ${s.precio}</p>
                <p className="text-sm text-gray-500">Modalidad: {s.modalidad}</p>
                <p className="text-sm text-gray-500">Terapeuta: {s.terapeuta?.nombreCompleto}</p>
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
                {s._id && (
                  <button
                    onClick={() => window.open(`https://www.serviciosholisticos.com.ar/servicio/${s._id}`, "_blank")}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded shadow hover:bg-blue-300 transition"
                  >
                    ¡Servicio aprobado! 🎊 Ver online
                  </button>
                )}
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
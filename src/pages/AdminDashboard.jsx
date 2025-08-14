import React, { useState, useEffect } from "react";
import TerapeutasPendientes from "../components/Admin/TerapeutasPendientes";
import ServiciosPendientes from "../components/Admin/ServiciosPendientes";
import ResenasPendientes from "../components/Admin/ResenasPendientes";

const AdminDashboard = () => {
  const [vista, setVista] = useState("terapeutas");
  const [resenasPendientes, setResenasPendientes] = useState(0);

  useEffect(() => {
    const fetchResenasPendientes = async () => {
      try {
        const res = await fetch(
          "https://servicios-holisticos-backend.onrender.com/api/resenas/pendientes-count"
        );
        const data = await res.json();
        setResenasPendientes(data.count || 0);
      } catch (error) {
        console.error("Error al cargar reseñas pendientes:", error);
      }
    };

    fetchResenasPendientes();

    // Opcional: actualizar cada 30s
    const interval = setInterval(fetchResenasPendientes, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50 text-[#333]">
      <h1 className="text-2xl font-bold mb-6 text-center">Panel de Administración 🛠️</h1>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setVista("terapeutas")}
          className={`px-4 py-2 rounded-xl ${
            vista === "terapeutas" ? "bg-pink-500 text-white" : "bg-gray-200"
          }`}
        >
          Terapeutas
        </button>
        <button
          onClick={() => setVista("servicios")}
          className={`px-4 py-2 rounded-xl ${
            vista === "servicios" ? "bg-pink-500 text-white" : "bg-gray-200"
          }`}
        >
          Servicios
        </button>
        <button
          onClick={() => setVista("resenas")}
          className={`relative px-4 py-2 rounded-xl ${
            vista === "resenas" ? "bg-pink-500 text-white" : "bg-gray-200"
          }`}
        >
          Reseñas
          {resenasPendientes > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white"
              title={`${resenasPendientes} reseñas pendientes`}
            >
              {resenasPendientes}
            </span>
          )}
        </button>
      </div>

      {vista === "terapeutas" && <TerapeutasPendientes />}
      {vista === "servicios" && <ServiciosPendientes />}
      {vista === "resenas" && <ResenasPendientes />}
    </div>
  );
};

export default AdminDashboard;
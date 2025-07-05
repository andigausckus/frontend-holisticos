// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import TerapeutasPendientes from "../components/Admin/TerapeutasPendientes";
import ServiciosPendientes from "../components/Admin/ServiciosPendientes";
import ResenasPendientes from "../components/Admin/ResenasPendientes";

const AdminDashboard = () => {
  const [vista, setVista] = useState("terapeutas");

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50 text-[#333]">
      <h1 className="text-2xl font-bold mb-6 text-center">Panel de Administración 🛠️</h1>

      <div className="flex justify-center gap-4 mb-8">
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
          className={`px-4 py-2 rounded-xl ${
            vista === "resenas" ? "bg-pink-500 text-white" : "bg-gray-200"
          }`}
        >
          Reseñas
        </button>
      </div>

      {vista === "terapeutas" && <TerapeutasPendientes />}
      {vista === "servicios" && <ServiciosPendientes />}
      {vista === "resenas" && <ResenasPendientes />}
    </div>
  );
};

export default AdminDashboard;
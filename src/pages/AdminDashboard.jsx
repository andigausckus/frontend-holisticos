// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import TerapeutasPendientes from "../components/Admin/TerapeutasPendientes";
import ServiciosPendientes from "../components/Admin/ServiciosPendientes";
import ResenasPendientes from "../components/Admin/ResenasPendientes";



const AdminDashboard = () => {
const [vista, setVista] = useState("terapeutas");
const [resenasPendientes, setResenasPendientes] = useState(0);
const [serviciosPendientes, setServiciosPendientes] = useState(0);

// Traer la cantidad de servicios pendientes
useEffect(() => {
const fetchServiciosPendientes = async () => {
try {
const res = await fetch(
"https://servicios-holisticos-backend.onrender.com/api/admin/servicios-pendientes"
);
if (!res.ok) throw new Error("Error al obtener servicios pendientes");
const data = await res.json();
setServiciosPendientes(data.length); // cantidad de servicios pendientes
} catch (error) {
console.error("❌ Error al cargar servicios pendientes:", error);
}
};

fetchServiciosPendientes();  

// Actualizar cada 30s  
const intervalo = setInterval(fetchServiciosPendientes, 30000);  
return () => clearInterval(intervalo);

}, []);

// Traer la cantidad de servicios pendientes
useEffect(() => {
const fetchServiciosPendientes = async () => {
try {
const res = await fetch(
"https://servicios-holisticos-backend.onrender.com/api/admin/servicios-pendientes"
);
if (!res.ok) throw new Error("Error al obtener servicios pendientes");
const data = await res.json();
setServiciosPendientes(data.length); // data es un array
} catch (error) {
console.error("❌ Error al cargar servicios pendientes:", error);
}
};

fetchServiciosPendientes();  
const intervalo = setInterval(fetchServiciosPendientes, 30000);  
return () => clearInterval(intervalo);

}, []);

  // Traer cantidad de reseñas pendientes
useEffect(() => {
  const fetchResenasPendientes = async () => {
    try {
      const res = await fetch(
        "https://servicios-holisticos-backend.onrender.com/api/admin/resenas-pendientes"
      );
      if (!res.ok) throw new Error("Error al obtener reseñas pendientes");
      const data = await res.json();
      setResenasPendientes(data.length); // cantidad de reseñas pendientes
    } catch (error) {
      console.error("❌ Error al cargar reseñas pendientes:", error);
    }
  };

  fetchResenasPendientes();

  // Actualizar cada 30s
  const intervalo = setInterval(fetchResenasPendientes, 30000);
  return () => clearInterval(intervalo);
}, []);

return (
<div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50 text-[#333]">
<h1 className="text-2xl font-bold mb-6 text-center">
Panel de Administración 🛠️
</h1>

<div className="flex justify-center gap-4 mb-8 flex-wrap">  
    {/* Botón Terapeutas */}  
    <button  
      onClick={() => setVista("terapeutas")}  
      className={`px-4 py-2 rounded-xl ${  
        vista === "terapeutas" ? "bg-pink-500 text-white" : "bg-gray-200"  
      }`}  
    >  
      Terapeutas  
    </button>  

    {/* Botón Servicios con badge */}  
    <div className="relative">  
      <button  
        onClick={() => setVista("servicios")}  
        className={`px-4 py-2 rounded-xl ${  
          vista === "servicios" ? "bg-pink-500 text-white" : "bg-gray-200"  
        }`}  
      >  
        Servicios  
      </button>  

      {serviciosPendientes > 0 && (  
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">  
          {serviciosPendientes}  
        </span>  
      )}  
    </div>  

    {/* Botón Reseñas con badge */}  
    <div className="relative">  
      <button  
        onClick={() => setVista("resenas")}  
        className={`px-4 py-2 rounded-xl ${  
          vista === "resenas" ? "bg-pink-500 text-white" : "bg-gray-200"  
        }`}  
      >  
        Reseñas  
      </button>  

      {resenasPendientes > 0 && (  
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">  
          {resenasPendientes}  
        </span>  
      )}  
    </div>  
  </div>  

  {/* Vistas */}  
  {vista === "terapeutas" && <TerapeutasPendientes />}  
  {vista === "servicios" && <ServiciosPendientes actualizarCantidad={setServiciosPendientes} />}  
  {vista === "resenas" && <ResenasPendientes actualizarCantidad={setResenasPendientes} />}  
</div>

);
};

export default AdminDashboard;
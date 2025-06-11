// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [terapeuta, setTerapeuta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://servicios-holisticos-backend.onrender.com/api/terapeutas/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => setTerapeuta(data))
      .catch(err => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

  if (!terapeuta) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Panel del Terapeuta</h1>
      <p><strong>Nombre:</strong> {terapeuta.nombre}</p>
      <p><strong>Email:</strong> {terapeuta.email}</p>
      <p><strong>Especialidad:</strong> {terapeuta.especialidad}</p>
      <p><strong>Modalidad:</strong> {terapeuta.modalidad}</p>
      <p><strong>Ubicación:</strong> {terapeuta.ubicacion}</p>
    </div>
  );
}
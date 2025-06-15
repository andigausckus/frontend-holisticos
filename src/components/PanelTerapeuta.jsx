import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PanelTerapeuta() {
  const [terapeuta, setTerapeuta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchPerfil = async () => {
      try {
        const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/terapeutas/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTerapeuta(data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        navigate("/login");
      }
    };

    fetchPerfil();
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!terapeuta) return <p className="p-6 text-gray-600">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-white relative px-4 py-8">
      {/* Cerrar sesión */}
      <div className="absolute top-4 right-6 text-sm text-red-500 font-semibold cursor-pointer" onClick={cerrarSesion}>
        Cerrar sesión
      </div>

      {/* Saludo */}
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Hola, {terapeuta.nombreCompleto}! 👋</h1>
        <p className="text-gray-600 text-lg mb-10">¿Qué deseas hacer hoy?</p>

        {/* Botones */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/nuevo-servicio")}
            className="bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold shadow"
          >
            ➕ Agregar un servicio
          </button>

          <button
            onClick={() => navigate("/mis-servicios")}
            className="bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-xl font-semibold shadow"
          >
            ✏️ Editar mis servicios
          </button>

          <button
            onClick={() => navigate(`/terapeutas/${terapeuta._id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold shadow"
          >
            👁️ Ver mi perfil público
          </button>
        </div>
      </div>
    </div>
  );
}
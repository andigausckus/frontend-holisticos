import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PanelTerapeuta() {
  const [terapeuta, setTerapeuta] = useState(null);
  const [misServicios, setMisServicios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchPerfil = async () => {
      try {
        const res = await fetch(
          "https://servicios-holisticos-backend.onrender.com/api/terapeutas/perfil",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTerapeuta(data);
        setMisServicios(data.servicios || []); // esto depende de cómo guardes los servicios
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        navigate("/login");
      }
    };

    fetchPerfil();
  }, [navigate]);

  if (!terapeuta) return <p className="p-6 text-gray-600">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-white relative px-4 py-8">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-2xl pt-12 font-bold text-gray-600 mb-4">
          ¡Hola, {terapeuta.nombreCompleto}! 👋
        </h1>
        <p className="text-gray-600 text-base mb-10">¿Qué deseas hacer hoy?</p>

        <div className="flex flex-col gap-4 mb-12">

          <button
  onClick={() => navigate("/nuevo-servicio")}
  className="w-full bg-pink-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-pink-500 hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-0"
>
  ➕ Agregar un servicio
</button>
          
          <button
            onClick={() => navigate("/editar-mis-servicios")}
            className="w-full bg-teal-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-teal-500 hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-0"
          >
            ✏️ Editar mis servicios
          </button>
        </div>

        {/* Mostrar servicios agregados */}
        <div className="text-left">
          <h2 className="text-xl font-semibold text-[#444] mb-4">Tus servicios</h2>
          {misServicios.length === 0 ? (
            <p className="text-gray-500 text-gl">Aún no cargaste ningún servicio</p>
          ) : (
            <ul className="space-y-4">
              {misServicios.map((serv, i) => (
                <li key={i} className="bg-[#f9f6ff] p-4 rounded-xl shadow-sm">
                  <p className="text-lg font-semibold text-[#333]">{serv.titulo}</p>
                  <p className="text-sm text-gray-600">{serv.descripcion?.slice(0, 100)}...</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
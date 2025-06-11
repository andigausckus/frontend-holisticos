import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Panel() {
  const [terapeuta, setTerapeuta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://servicios-holisticos-backend.onrender.com/api/terapeutas/perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        return res.json();
      })
      .then(data => setTerapeuta(data))
      .catch(error => {
        console.error("Error al obtener el perfil:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!terapeuta) return <p className="text-center mt-10">Cargando datos...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <h1 className="text-3xl font-semibold mb-4">Hola, {terapeuta.nombre}</h1>
      <p className="mb-2"><strong>Email:</strong> {terapeuta.email}</p>
      <p className="mb-2"><strong>Especialidades:</strong> {terapeuta.especialidades.join(", ")}</p>
      <p className="mb-2"><strong>Modalidad:</strong> {terapeuta.modalidad}</p>
      <p className="mb-2"><strong>Ubicación:</strong> {terapeuta.ubicacion}</p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
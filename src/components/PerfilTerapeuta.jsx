import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PerfilTerapeuta() {
  const { id } = useParams();
  const [terapeuta, setTerapeuta] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [totalResenas, setTotalResenas] = useState(0);

  useEffect(() => {
    // Obtener datos básicos del terapeuta
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/terapeutas/publico/${id}`)
      .then((res) => res.json())
      .then((data) => setTerapeuta(data))
      .catch((err) => console.error("Error al cargar terapeuta:", err));

    // Obtener reseñas y promedio
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/terapeutas/publico/${id}/resenas`)
      .then((res) => res.json())
      .then((data) => {
        setPromedio(data.promedio || 0);
        setTotalResenas(data.total || 0);
        setResenas(data.resenas || []);
      })
      .catch((err) => console.error("Error al cargar reseñas:", err));
  }, [id]);

  if (!terapeuta) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white rounded-2xl shadow">
      <h1 className="text-3xl font-bold text-[#333] mb-2">{terapeuta.nombreCompleto}</h1>
      
      <div className="text-[#333] mb-6">
        <p>📍 <strong>Ubicación:</strong> {terapeuta.ubicacion}</p>
        <p>📞 <strong>WhatsApp:</strong> {terapeuta.whatsapp}</p>
        <p>📧 <strong>Email:</strong> {terapeuta.email}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold text-[#333] mb-2">🌟 Reseñas de usuarios</h2>
        {totalResenas === 0 ? (
          <p className="text-gray-600">Aún no hay reseñas.</p>
        ) : (
          <>
            <p className="text-[#333] mb-4">
              Puntaje promedio: <strong>{promedio} / 5</strong> ({totalResenas} reseñas)
            </p>
            <ul className="space-y-4">
              {resenas.map((resena) => (
                <li
                  key={resena._id}
                  className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm"
                >
                  <p className="font-semibold text-[#333]">{resena.nombre}</p>
                  <p className="text-sm text-yellow-600">⭐ {resena.puntaje} / 5</p>
                  <p className="text-gray-700 mt-1">{resena.comentario}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
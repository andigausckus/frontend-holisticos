import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaDollarSign, FaClock, FaMapMarkerAlt, FaLaptop } from "react-icons/fa";

function formatearDuracion(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h > 0) {
    return `${h}h${m > 0 ? ` ${m}min` : ""}`;
  }
  return `${m}min`;
}

export default function ServicioDetalle() {
  const { servicioId } = useParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const res = await fetch(
          `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al cargar servicio");
        setServicio(data);
      } catch (error) {
        console.error("Error al cargar servicio:", error);
        alert("No se pudo cargar el servicio");
      } finally {
        setLoading(false);
      }
    };
    fetchServicio();
  }, [servicioId]);

  if (loading) return <p className="text-center mt-20">Cargando...</p>;
  if (!servicio) return <p className="text-center mt-20">Servicio no encontrado</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md my-10">
      {/* Imagen */}
      {servicio.imagenUrl && (
        <img
          src={servicio.imagenUrl}
          alt={`Imagen de ${servicio.titulo}`}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      {/* Título */}
      <h1 className="text-3xl font-bold mb-4 text-center">{servicio.titulo}</h1>

      {/* Descripción */}
      <p className="text-gray-700 mb-6 whitespace-pre-line">{servicio.descripcion}</p>

      {/* Detalles */}
      <div className="flex justify-around text-gray-600 mb-8">
        <div className="flex items-center gap-1">
          <FaClock className="text-pink-500" />
          <span>{formatearDuracion(servicio.duracion)}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaDollarSign className="text-pink-500" />
          <span>${servicio.precio}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaLaptop className="text-pink-500" />
          <span>{servicio.modalidad}</span>
        </div>
      </div>

      {/* Reseñas (vacías) */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-3">Reseñas</h2>
        <div className="flex space-x-1 mb-2">
          {/* 5 estrellas vacías */}
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.974c.3.92-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.927 9.402c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.975z"
              ></path>
            </svg>
          ))}
        </div>
        <p className="text-gray-500 italic">Este servicio aún no tiene reseñas.</p>
      </div>
    </div>
  );
}
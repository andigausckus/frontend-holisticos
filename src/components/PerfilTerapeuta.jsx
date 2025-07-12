import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaUserMd, FaVideo } from "react-icons/fa";

export default function PerfilTerapeuta() {
  const { id } = useParams();
  const [terapeuta, setTerapeuta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://servicios-holisticos-backend.onrender.com/api/terapeutas/${id}`)
      .then(res => res.json())
      .then(data => {
        setTerapeuta(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar el terapeuta:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando perfil del terapeuta...</p>;
  if (!terapeuta) return <p className="text-center mt-10">No se encontró el terapeuta.</p>;

  return (
    <div className="w-full shadow-lg overflow-hidden relative -mt-4">
      
      {/* Foto de portada */}
      <div className="relative w-full h-46 sm:h-42 md:h-50 bg-white">
        <img
          src={terapeuta.fotoPortada || "https://i.postimg.cc/RF28z3dx/lotus-614421-1280.jpg"}
          alt="Portada"
          className="w-full h-full object-cover object-top"
        />

        {/* Imagen de perfil centrada sobre el banner */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-20">
          <img
            src={terapeuta.fotoPerfil || "https://i.postimg.cc/YCSvJjsS/Logo-Centro-Hol-stico-Minimalista-Beige-y-Caf-20250606-132545-0000.png"}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl"
          />
        </div>
      </div>
      {/* Nombre */}
      <div className="flex justify-end px-6 mt-6">
        <h1 className="text-3xl font-bold text-gray-800">{terapeuta.nombre}</h1>
      </div>

      {/* Contenido principal */}
      <div className="pt-20 pb-10 px-6">
        
        {/* Info básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-pink-500" />
            <span className="font-semibold">Ubicación:</span> {terapeuta.ubicacion}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FaVideo className="text-pink-500" />
            <span className="font-semibold">Modalidad:</span> {terapeuta.modalidad || "No especificada"}
          </div>
          <div className="flex items-center gap-2 text-gray-700 col-span-full">
            <FaUserMd className="text-pink-500" />
            <span className="font-semibold">Especialidades:</span>{" "}
            {terapeuta.especialidades?.join(", ") || "No especificadas"}
          </div>
        </div>

        {/* Sobre mí */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Sobre mí</h2>
          <p className="text-gray-700 leading-relaxed">
            {terapeuta.descripcion || "Este terapeuta aún no ha completado su biografía profesional."}
          </p>
        </div>

        {/* Servicios disponibles */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Servicios disponibles</h2>
          {terapeuta.servicios?.length > 0 ? (
            <div className="grid gap-4">
              {terapeuta.servicios.map((servicio, i) => (
                <div key={i} className="p-4 border rounded-xl shadow-sm bg-gray-50">
                  <h3 className="text-xl font-semibold text-pink-600">{servicio.titulo}</h3>
                  <p className="text-gray-700 mb-1"><strong>Duración:</strong> {servicio.duracion}</p>
                  <p className="text-gray-700 mb-1"><strong>Modalidad:</strong> {servicio.modalidad}</p>
                  <p className="text-gray-700"><strong>Precio:</strong> ${servicio.precio}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Este terapeuta aún no tiene servicios publicados.</p>
          )}
        </div>

        {/* Disponibilidad */}
        {terapeuta.disponibilidad?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🗓️ Disponibilidad</h2>
            <div className="space-y-4">
              {terapeuta.disponibilidad.map((diaObj, index) => (
                <div key={index}>
                  <h3 className="text-lg font-bold text-pink-600">{diaObj.dia}</h3>
                  {diaObj.rangos.length > 0 ? (
                    <ul className="ml-4 list-disc text-gray-700">
                      {diaObj.rangos.map((rango, i) => (
                        <li key={i}>
                          {rango.horaInicio} - {rango.horaFin}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4 text-sm text-gray-500">Sin horarios cargados.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón reserva */}
        <div className="text-center mt-10">
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300">
            Reservar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";

export default function PerfilTerapeuta() {
  const { id } = useParams();
  const [terapeuta, setTerapeuta] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [totalResenas, setTotalResenas] = useState(0);
  const [mostrarSobreMi, setMostrarSobreMi] = useState(false);
  const [mostrarServicios, setMostrarServicios] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Refs para los inputs de archivo
  const fileInputPerfilRef = useRef(null);
  const fileInputPortadaRef = useRef(null);

  // Funciones para abrir galería
  const handleEditarPerfil = () => fileInputPerfilRef.current.click();
  const handleEditarPortada = () => fileInputPortadaRef.current.click();

  // Manejo de archivos seleccionados
  const handleArchivoSeleccionado = async (e, tipo) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    // Preview inmediato en el frontend
    const urlTemporal = URL.createObjectURL(archivo);
    if (tipo === "perfil") setTerapeuta(prev => ({ ...prev, fotoPerfil: urlTemporal }));
    if (tipo === "portada") setTerapeuta(prev => ({ ...prev, fotoPortada: urlTemporal }));

    try {
      // Subir a Cloudinary
      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("upload_preset", "TU_UPLOAD_PRESET"); // 🔹 cambialo por tu upload_preset de Cloudinary

      const resCloud = await fetch(`https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload`, {
        method: "POST",
        body: formData,
      });
      const dataCloud = await resCloud.json();

      if (!dataCloud.secure_url) throw new Error("Error al subir a Cloudinary");

      // Llamada al backend para guardar la URL en MongoDB
      const endpoint =
        tipo === "perfil"
          ? `${BACKEND_URL}/terapeutas/${id}/foto-perfil`
          : `${BACKEND_URL}/terapeutas/${id}/foto-portada`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: dataCloud.secure_url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar en backend");

      // Actualiza con URL final de Cloudinary
      if (tipo === "perfil") setTerapeuta(prev => ({ ...prev, fotoPerfil: data.url }));
      if (tipo === "portada") setTerapeuta(prev => ({ ...prev, fotoPortada: data.url }));

    } catch (err) {
      console.error("Error al subir imagen:", err);
      alert("No se pudo actualizar la imagen. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    // Obtener datos básicos del terapeuta
    fetch(`${BACKEND_URL}/terapeutas/publico/${id}`)
      .then((res) => res.json())
      .then((data) => setTerapeuta(data))
      .catch((err) => console.error("Error al cargar terapeuta:", err));

    // Obtener reseñas y promedio
    fetch(`${BACKEND_URL}/terapeutas/publico/${id}/resenas`)
      .then((res) => res.json())
      .then((data) => {
        setPromedio(data.promedio || 0);
        setTotalResenas(data.total || 0);
        setResenas(data.resenas || []);
      })
      .catch((err) => console.error("Error al cargar reseñas:", err));
  }, [id, BACKEND_URL]);

  if (!terapeuta) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow">  
      {/* Banner */}
      <div className="relative h-80 bg-gray-200 flex items-center justify-center">  
        <img  
          src={  
            terapeuta.fotoPortada ||  
            "https://i.postimg.cc/DzKhPkkG/IMG-20250607-170740-893.webp"  
          }  
          alt="Portada"  
          className="w-full h-full object-cover"  
        />  
        {/* Botón editar portada */}
        <button
          onClick={handleEditarPortada}
          className="absolute bottom-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded shadow text-sm"
        > 
          Editar
        </button>  
        <input
          type="file"
          ref={fileInputPortadaRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleArchivoSeleccionado(e, "portada")}
        />
      </div>

      {/* Foto de perfil circular */}
      <div className="relative flex justify-start -mt-16 pl-6 z-10">
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">  
            <img  
              src={  
                terapeuta.fotoPerfil ||  
                "https://i.postimg.cc/DzKhPkkG/IMG-20250607-170740-893.webp"  
              }  
              alt="Perfil"  
              className="w-full h-full object-cover"  
            />  
          </div>  
          {/* Botón de editar */}  
          <button  
            onClick={handleEditarPerfil}  
            className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded shadow"  
          >  
            Editar  
          </button>  
          <input  
            type="file"  
            ref={fileInputPerfilRef}  
            style={{ display: "none" }}  
            accept="image/*"  
            onChange={(e) => handleArchivoSeleccionado(e, "perfil")}  
          />  
        </div>
      </div>
    

        {/* Datos del terapeuta */}
<div className="pt-16 px-6 pb-8">
<h1 className="text-xl font-semibold text-[#444]">
{terapeuta.nombreCompleto}
</h1>
<p className="text-gray-600">{terapeuta.especialidades?.join(", ")}</p>

        {/* Promedio de reseñas */}
        <div className="mt-3">
          {totalResenas === 0 ? (
            <p className="text-gray-600">Aún no tiene reseñas.</p>
          ) : (
            <p className="text-[#333]">
              ⭐ <strong>{promedio.toFixed(1)}</strong> / 5 ({totalResenas} reseñas)
            </p>
          )}
        </div>

        {/* Sobre mí */}
        <div className="mt-6 bg-gray-50 rounded-xl shadow p-4">
          <button
            onClick={() => setMostrarSobreMi(!mostrarSobreMi)}
            className="w-full text-left text-md font-semibold text-[#444] flex justify-between"
          >
            Sobre mí
            <span>{mostrarSobreMi ? "▲" : "▼"}</span>
          </button>
          {mostrarSobreMi && (
            <p className="mt-3 text-gray-700 text-sm">
              {terapeuta.descripcion ||
                "Este terapeuta aún no agregó información personal."}
            </p>
          )}
        </div>

        {/* Mis servicios */}
        <div className="mt-6 bg-gray-50 rounded-xl shadow p-4">
          <button
            onClick={() => setMostrarServicios(!mostrarServicios)}
            className="w-full text-left text-md font-semibold text-[#444] flex justify-between"
          >
            Mis servicios
            <span>{mostrarServicios ? "▲" : "▼"}</span>
          </button>
          {mostrarServicios && (
            <div className="mt-3 space-y-3">
              {terapeuta.servicios?.length > 0 ? (
                terapeuta.servicios.map((servicio) => (
                  <div
                    key={servicio._id}
                    className="bg-white border rounded-lg p-3 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-[#333]">
                        {servicio.titulo}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {servicio.descripcion}
                      </p>
                    </div>
                    <Link
                      to={`/servicio/${servicio._id}`}
                      className="text-sm bg-violet-600 text-white px-3 py-1 rounded-lg shadow hover:bg-violet-700"
                    >
                      Ir al servicio
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">
                  Aún no tiene servicios publicados.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
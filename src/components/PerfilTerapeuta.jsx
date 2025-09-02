import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";

export default function PerfilTerapeuta() {
const { id } = useParams();
const [terapeuta, setTerapeuta] = useState(null);
const [mostrarSobreMi, setMostrarSobreMi] = useState(false);
const [mostrarServicios, setMostrarServicios] = useState(false);
const [cargandoPerfil, setCargandoPerfil] = useState(false);
const [cargandoPortada, setCargandoPortada] = useState(false);
const [promedioResenas, setPromedioResenas] = useState(0);
const [totalResenas, setTotalResenas] = useState(0);
const [resenas, setResenas] = useState([]);
const [editandoDescripcion, setEditandoDescripcion] = useState(false);
const [descripcionTemporal, setDescripcionTemporal] = useState("");
  const [mostrarModalFotos, setMostrarModalFotos] = useState(false);
const [tipoFoto, setTipoFoto] = useState(null); // "perfil" o "portada"
  const [esDueñoPerfil, setEsDueñoPerfil] = useState(false);
  const [sobreMiExpandido, setSobreMiExpandido] = useState(false);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Refs para inputs de archivo
const fileInputPerfilRef = useRef(null);
const fileInputPortadaRef = useRef(null);

const guardarDescripcion = async () => {
try {
  const res = await fetch(`${BACKEND_URL}/terapeutas/${id}/descripcion`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ descripcion: descripcionTemporal }),
  });

const data = await res.json();  
  if (!res.ok) throw new Error(data.message || "Error al actualizar descripción");  

  setTerapeuta(prev => ({ ...prev, descripcion: descripcionTemporal }));  
  setEditandoDescripcion(false);  

} catch (err) {  
  console.error("Error al guardar descripción:", err);  
  alert("No se pudo actualizar la descripción. Intenta nuevamente.");  
}

};

  const handleEditarPerfil = () => {
    setTipoFoto("perfil");
    setMostrarModalFotos(true);
  };

  const handleEditarPortada = () => {
    setTipoFoto("portada");
    setMostrarModalFotos(true);
  };

  const abrirInputDesdeModal = () => {
  if (tipoFoto === "perfil") {
    fileInputPerfilRef.current?.click();
  } else if (tipoFoto === "portada") {
    fileInputPortadaRef.current?.click();
  }
  setMostrarModalFotos(false);
};

const handleArchivoSeleccionado = async (e, tipo) => {
const archivo = e.target.files[0];
if (!archivo) return;

const urlTemporal = URL.createObjectURL(archivo);  
if (tipo === "perfil") {  
  setTerapeuta(prev => ({ ...prev, fotoPerfil: urlTemporal }));  
  setCargandoPerfil(true);  
}  
if (tipo === "portada") {  
  setTerapeuta(prev => ({ ...prev, fotoPortada: urlTemporal }));  
  setCargandoPortada(true);  
}  

try {  
  // Subir a Cloudinary  
  const formData = new FormData();  
  formData.append("file", archivo);  
  formData.append("upload_preset", "servicios_holisticos"); // tu upload_preset  

  const resCloud = await fetch(  
    "https://api.cloudinary.com/v1_1/dbu5cfqzf/image/upload",  
    { method: "POST", body: formData }  
  );  
  const dataCloud = await resCloud.json();  
  if (!resCloud.ok) throw new Error(dataCloud.error?.message || "Error al subir a Cloudinary");  

  // Guardar URL en backend  
  const urlBackend = tipo === "perfil"  
    ? `${BACKEND_URL}/terapeutas/${id}/foto-perfil`  
    : `${BACKEND_URL}/terapeutas/${id}/foto-portada`;  

  const resBackend = await fetch(urlBackend, {  
    method: "PUT",  
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify({ url: dataCloud.secure_url }),  
  });  
  const dataBackend = await resBackend.json();  
  if (!resBackend.ok) throw new Error(dataBackend.message || "Error al actualizar imagen en backend");  

  if (tipo === "perfil") setTerapeuta(prev => ({ ...prev, fotoPerfil: dataCloud.secure_url }));  
  if (tipo === "portada") setTerapeuta(prev => ({ ...prev, fotoPortada: dataCloud.secure_url }));  
} catch (err) {  
  console.error("Error al subir imagen:", err);  
  alert("No se pudo actualizar la imagen. Intenta nuevamente.");  
} finally {  
  if (tipo === "perfil") setCargandoPerfil(false);  
  if (tipo === "portada") setCargandoPortada(false);  
}

};

useEffect(() => {
  const fetchTerapeuta = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/terapeutas/publico/${id}`);
      const data = await res.json();
      console.log("TERAPEUTA RECIBIDO:", data);
      setTerapeuta(data);

      // Verificar dueño
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.id && data && payload.id === data._id) {
            console.log("✅ Usuario es dueño del perfil");
            setEsDueñoPerfil(true);
          } else {
            console.log("❌ Usuario NO es dueño del perfil");
          }
        } catch (err) {
          console.error("Error al leer token:", err);
        }
      }
    } catch (err) {
      console.error("Error al cargar terapeuta:", err);
    }
  };

  const fetchResenas = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/terapeutas/publico/${id}/resenas`);
      const data = await res.json();
      setPromedioResenas(data.promedio || 0);
      setTotalResenas(data.total || 0);
      setResenas(data.resenas || []);
    } catch (err) {
      console.error("Error al cargar reseñas:", err);
    }
  };

  // Ejecutamos ambas funciones
  fetchTerapeuta();
  fetchResenas();
}, [id, BACKEND_URL]);

useEffect(() => {
if (terapeuta?.descripcion) {
setDescripcionTemporal(terapeuta.descripcion);
}
}, [terapeuta]);

if (!terapeuta) return <p className="text-center mt-10">Cargando perfil...</p>;

console.log("Servicios del terapeuta:", terapeuta.servicios);

return (
  <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow">

    {/* 📌 Foto de Portada */}
    <div className="relative">
      {cargandoPortada ? (
        <div className="w-full h-48 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      ) : (
    <img
      src={terapeuta.fotoPortada || "https://via.placeholder.com/800x200"}
      alt="Foto de portada"
      className={`w-full h-72 object-cover rounded-lg shadow ${esDueñoPerfil ? "cursor-pointer" : ""}`}
      onClick={esDueñoPerfil ? () => setMostrarModalFotos(true) : undefined}
    />
      )}

      {esDueñoPerfil && (
        <button
          onClick={handleEditarPortada}
          className="absolute bottom-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded shadow text-sm z-50"
        >
          Editar
        </button>
      )}

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
        <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 relative">
          <img
            src={terapeuta.fotoPerfil || "https://i.postimg.cc/DzKhPkkG/IMG-20250607-170740-893.webp"}
            alt="Perfil"
            className={`w-full h-full object-cover ${esDueñoPerfil ? "cursor-pointer" : ""}`}
            onClick={esDueñoPerfil ? () => setMostrarModalFotos(true) : undefined}
          />
          {cargandoPerfil && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="loader border-t-2 border-white w-6 h-6 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {esDueñoPerfil && (
          <button
            onClick={handleEditarPerfil}
            className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded shadow"
          >
            Editar
          </button>
        )}

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
    <div className="pt-2 px-6 pb-8">
      <h1 className="text-xl font-semibold text-[#444]">{terapeuta.nombreCompleto}</h1>
      <p className="text-gray-600">{terapeuta.especialidades?.join(", ")}</p>

      {/* Promedio de reseñas */}
      <div className="mt-3 flex items-center gap-2">
        {totalResenas === 0 ? (
          <p className="text-gray-600">Aún no tiene reseñas.</p>
        ) : (
          <>
            <span
              className="text-md font-bold text-white bg-yellow-600 px-2 py-1 rounded-md text-center"
              style={{ width: "4.5ch", display: "inline-block", textAlign: "center" }}
            >
              {promedioResenas.toFixed(promedioResenas === 5 ? 0 : 1)}
            </span>

            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`text-md ${n <= Math.round(promedioResenas) ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </span>
            ))}

            <span className="text-yellow-600 text-sm ml-2">({totalResenas} basado en reseñas)</span>
          </>
        )}
      </div>

      {/* Sobre mí */}
      <div className="mt-6 bg-gray-50 rounded-xl shadow p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold text-[#444]">Sobre mí 😀</h3>
          {esDueñoPerfil && (
            <button
              onClick={() => {
                setEditandoDescripcion(!editandoDescripcion);
                setDescripcionTemporal(terapeuta.descripcion || "");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {editandoDescripcion ? "Cancelar" : "Editar"}
            </button>
          )}
        </div>

        {editandoDescripcion ? (
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              className="border rounded-md p-2 w-full focus:outline-none focus:ring-0 focus:border-pink-200"
              rows={4}
              value={descripcionTemporal}
              onChange={(e) => setDescripcionTemporal(e.target.value)}
            />
            <button
              className="bg-pink-400 text-white px-2 py-1 rounded hover:bg-pink-500 w-max"
              onClick={guardarDescripcion}
            >
              Guardar
            </button>
          </div>
        ) : (
          <p className="mt-2 text-gray-700 text-sm">
            {terapeuta.descripcion.length > 150 && !sobreMiExpandido
              ? `${terapeuta.descripcion.slice(0, 150)}...`
              : terapeuta.descripcion
            }
            {terapeuta.descripcion.length > 150 && (
              <button
                onClick={() => setSobreMiExpandido(!sobreMiExpandido)}
                className="ml-1 text-blue-600 hover:underline text-sm"
              >
                {sobreMiExpandido ? "Ver menos" : "Ver más"}
              </button>
            )}
          </p>
        )}
      </div>

      {/* Mis servicios */}
      <div className="mt-12 mb-24 bg-gray-50 rounded-xl shadow p-4">
        <h3 className="text-md font-semibold text-[#444] mb-3">Mis servicios 🦋</h3>
        {terapeuta.servicios?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {terapeuta.servicios.map((servicio) => {
              const servicioId = servicio._id || servicio.id;
              return (
                <div key={servicioId} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                  {servicio.imagen && <img src={servicio.imagen} alt={servicio.titulo} className="w-full h-32 object-cover" />}
                  <div className="p-3 flex flex-col gap-1">
                    <p className="font-semibold text-[#333] text-sm">{servicio.titulo}</p>
                    <p className="text-gray-600 text-xs line-clamp-3">{servicio.descripcion}</p>

                    {/* Reseñas */}
                    {servicio.reseñas?.length > 0 ? (
                      <div className="mt-1 flex items-center gap-1 justify-center">
                        <span className="text-sm font-bold text-white bg-yellow-600 px-1 rounded text-center">
                          {(servicio.reseñas.reduce((sum, r) => sum + r.puntuacion, 0) / servicio.reseñas.length).toFixed(1)}
                        </span>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={`text-xs ${n <= Math.round(servicio.reseñas.reduce((sum, r) => sum + r.puntuacion, 0) / servicio.reseñas.length) ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-yellow-600 text-xs ml-1">({servicio.reseñas.length})</span>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs mt-1 text-center">Sin reseñas</p>
                    )}

                    {/* Botón centrado */}
                    <div className="mt-2 flex justify-center">
                      <Link
                        to={`/servicios/${(servicio.slug || servicio.titulo
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")
                          .replace(/^-+|-+$/g, "")) || "sin-titulo"}`}
                        className="bg-sky-500 text-white px-4 py-1 rounded-full text-base hover:bg-sky-500 transition-all text-center block"
                      >
                        Ver servicio
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-sm text-center">Aún no tiene servicios publicados.</p>
        )}
      </div>
    </div>

    {/* Modal de fotos */}
    {mostrarModalFotos && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-sm mx-auto text-center shadow-lg">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Ejemplos de buenas fotos</h3>
          <div className="space-y-1 text-xs text-gray-600 mb-4">
            <p>Subir buenas fotos ayuda a que las personas te conozcan y sientan confianza antes de reservar una sesión.</p>
            <p>😊 Una foto tuya sonriendo o con tu mascota</p>
            <p>🌿 Imagen de naturaleza o paisaje relajante</p>
            <p>🪷 Tu espacio de trabajo o sala de terapias</p>
          </div>
          <p className="text-red-500 font-medium text-sm mb-4">
            ❌ Evitá fotos con textos, logos o publicidad
          </p>
          <button
            className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600"
            onClick={abrirInputDesdeModal}
          >
            Aceptar
          </button>
        </div>
      </div>
    )}
  </div>
);
}
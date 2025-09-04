// EditarServicio.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { FaWhatsapp, FaSkype, FaVideo, FaGoogle } from "react-icons/fa";
import axios from "axios";

export default function EditarServicio() {
  const navigate = useNavigate();
  const { servicioId } = useParams();
const fileInputRef = useRef(null);
    // Estado para abrir/cerrar el modal
  


  const categorias = [
    "🌸 Aromaterapia",
    "🌸 Astrología",
    "🌸 Biodescodificación",
    "🌸 Carta Natal",
    "🌸 Chamanismo",
    "🌸 Coaching Holístico",
    "🌸 Constelaciones Familiares",
    "🌸 Hipnosis Regresiva",
    "🌸 Meditación",
    "🌸 Mindfulness",
    "🌸 Numerología",
    "🌸 Péndulo Hebreo",
    "🌸 Reiki",
    "🌸 Registros Akáshicos",
    "🌸 Revolución Solar",
    "🌸 Sanación Energética",
    "🌸 Sonoterapia",
    "🌸 Tarot",
    "🌸 Terapia Floral",
    "🌸 ThetaHealing",
    "🌸 Yoga"
  ];

  const cloudName = "dbu5cfqzf";
  const uploadPreset = "servicios_holisticos";

  const plataformasDisponibles = [
    { nombre: "WhatsApp", icono: <FaWhatsapp className="text-green-500 text-2xl" /> },
    { nombre: "Zoom", icono: <FaVideo className="text-blue-500 text-2xl" /> },
    { nombre: "Skype", icono: <FaSkype className="text-sky-500 text-2xl" /> },
    { nombre: "Google Meet", icono: <FaGoogle className="text-green-600 text-2xl" /> },
  ];

  const [imagenFile, setImagenFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false); // ⬅️ spinner
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formulario, setFormulario] = useState({
    titulo: "",
    descripcion: "",
    modalidad: ["Online"],
    duracionHoras: "",
    duracionMinutos: "",
    precio: "",
    categoria: "",
    plataformas: [],
    imagen: null,
  });

  const [alerta, setAlerta] = useState(null);
  const [cargando, setCargando] = useState(true);

  const mostrarAlerta = (mensaje) => {
    setAlerta(mensaje);
    setTimeout(() => setAlerta(null), 4000);
  };

  // Cargar datos del servicio al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const cargarServicio = async () => {
      try {
        const res = await axios.get(
          `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const s = res.data;
        const horas = Math.floor((s.duracionMinutos || 0) / 60);
        const minutos = (s.duracionMinutos || 0) % 60;

        setFormulario({
          titulo: s.titulo || "",
          descripcion: s.descripcion || "",
          modalidad: s.modalidad ? [s.modalidad] : ["Online"],
          duracionHoras: horas,
          duracionMinutos: minutos,
          precio: s.precio || "",
          categoria: s.categoria || "",
          plataformas: s.plataformas || [],
          imagen: s.imagen || null,
        });

        setCargando(false);
      } catch (err) {
        console.error("❌ Error al cargar servicio:", err);
        alert("No se pudo cargar el servicio.");
        setCargando(false);
      }
    };

    cargarServicio();
  }, [servicioId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileClick = () => {
  setMostrarModal(true); // abre el modal
};

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormulario((prev) => {
      const nuevasPlataformas = checked
        ? [...prev.plataformas, value]
        : prev.plataformas.filter((plataforma) => plataforma !== value);
      return { ...prev, plataformas: nuevasPlataformas };
    });
  };

  const handleCategoriaChange = (opcion) => {
    setFormulario((prev) => ({
      ...prev,
      categoria: opcion ? opcion.value : "",
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return alert("Solo se permiten archivos de imagen.");
    }

    setImagenFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "servicios");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setFormulario((prev) => ({ ...prev, imagen: data.secure_url }));
    } catch (error) {
      console.error("❌ Error al subir imagen a Cloudinary:", error);
      alert("No se pudo subir la imagen.");
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused || state.hasValue ? "#b481d9" : "#c7b6eb",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#b481d9",
      },
      borderRadius: "5px",
      backgroundColor: "#f6f0fe",
      padding: "2px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#b481d9" : state.isSelected ? "#b481d9" : "#f6f0fe",
      color: state.isFocused || state.isSelected ? "#fff" : "#333",
    }),
    placeholder: (base) => ({ ...base, color: "#888" }),
  };

  const opcionesCategoria = categorias.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formulario.titulo.trim() ||
      !formulario.descripcion.trim() ||
      !formulario.precio ||
      formulario.duracionHoras === "" ||
      formulario.duracionMinutos === "" ||
      !formulario.categoria ||
      formulario.plataformas.length === 0 ||
      !formulario.imagen
    ) {
      mostrarAlerta("❌ Por favor completá todos los campos obligatorios");
      return;
    }

    const duracionTotalMinutos = Number(formulario.duracionHoras) * 60 + Number(formulario.duracionMinutos);

    const servicioActualizado = {
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      modalidad: "Online",
      duracionMinutos: duracionTotalMinutos,
      precio: formulario.precio,
      categoria: formulario.categoria,
      plataformas: formulario.plataformas,
      imagen: formulario.imagen,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}`,
        servicioActualizado,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Servicio actualizado:", res.data);

      navigate(`/disponibilidad/${servicioId}`, {
        state: { servicioTemp: res.data.servicio },
      });
    } catch (error) {
      console.error("❌ Error al actualizar servicio:", error);
      mostrarAlerta("No se pudo actualizar el servicio, intentá nuevamente.");
    }
  };

  if (cargando) return <p className="p-6 text-gray-600">Cargando servicio...</p>;

  const handleConfirmModal = () => {
    setMostrarModal(false); // cierra el modal
  };

    return (
      <div className="bg-white pt-24 p-4 min-h-screen">
        {alerta && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-pink-100 text-[#333] px-8 py-4 rounded-lg shadow-md z-50 animate-fade-in max-w-xl w-full text-center">
            {alerta}
          </div>
        )}

        {/* Modal de advertencia */}
        {mostrarModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
              <h3 className="text-lg font-semibold mb-4">📸 Antes de subir tu imagen</h3>

              <p className="text-sm text-gray-700 pt-4">
                Subí una imagen clara y profesional para tu servicio
              </p>

              <ul className="text-sm text-gray-700 text-left mb-4 space-y-2">
                <li>❌ No incluyas información personal (teléfono, email, etc.)</li>
                <li>❌ No escribas otras terapias en la imagen</li>
                <li>✅ Usá una foto limpia, sin textos adicionales</li>
              </ul>

              <p className="text-sm text-gray-700 mb-4">
                🔎 Todas las imágenes son revisadas antes de publicarse para mantener 
                una estética visual ordenada y agradable para todos los usuarios 😊
              </p>

              <button
                onClick={() => {
                  handleConfirmModal(); // cierra el modal
                  if (fileInputRef.current) fileInputRef.current.click(); // abre el selector de archivos
                }}
                className="bg-pink-400 text-white py-2 px-6 rounded-xl hover:bg-violet-600 transition"
              >
                Aceptar y subir imagen
              </button>
            </div>
          </div>
        )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto mb-24">
        <h2 className="text-2xl font-normal pt-6 text-center mb-6">Editar servicio ✍️</h2>

        {/* Título */}
        <label className="block mb-4">
          <span className="block mb-2">Título *</span>
          <div className="text-xs text-[#444444] mb-2">
            <p>✍️ Escribí un título con 3-6 palabras máximo</p>
            <p>❌️ No incluyas la palabra "Online"</p>
            <p>🌸 Podés incluir un (1) emoji al final para darle un toque amigable (opcional)</p>
          </div>
          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            placeholder="Ej: Sesión de Reiki para adultos 🌟"
            className="w-full p-2 border border-[#c7b6eb] rounded focus:outline-none"
            required
          />
        </label>

        {/* Descripción */}
        <label className="block mb-4">
          <span className="block mb-2">Descripción *</span>
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            rows={4}
            placeholder="Describí de qué se trata tu servicio, a quién está dirigido, y qué beneficios ofrece."
            className="w-full p-2 border border-[#c7b6eb] rounded focus:outline-none"
            required
          />
        </label>

        {/* Modalidad y Precio */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1">Modalidad *</label>
            <div className="px-3 py-2 border border-[#c7b6eb] rounded">Online</div>
          </div>
          <div className="flex-1">
            <label className="block mb-1">Precio *</label>
            <div className="flex items-center border border-[#c7b6eb] rounded px-2">
              <span className="text-lg text-[#555]">$</span>
              <input
                type="number"
                name="precio"
                value={formulario.precio}
                onChange={handleChange}
                placeholder="Usá un valor real"
                className="w-full p-2 border-none focus:outline-none placeholder:text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Duración */}
        <div className="mb-2">
          <p className="text-base text-gray-600 mb-1">Duración de sesión</p>
        </div>

        <div className="flex gap-4 mb-4">
          <label className="flex-1">
            <span>Horas *</span>
            <input
              type="number"
              name="duracionHoras"
              value={formulario.duracionHoras}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-[#c7b6eb] rounded focus:outline-none"
              required
            />
          </label>
          <label className="flex-1">
            <span>Minutos *</span>
            <input
              type="number"
              name="duracionMinutos"
              value={formulario.duracionMinutos}
              onChange={handleChange}
              min="0"
              max="59"
              className="w-full p-2 border border-[#c7b6eb] rounded focus:outline-none"
              required
            />
          </label>
        </div>

        {/* Plataformas */}
        <label className="block mb-4">
          <span className="block mb-1">Plataforma para la sesión</span>
          
          <div className="flex flex-wrap justify-between p-3 border border-[#c7b6eb] rounded">
            {plataformasDisponibles.map(({ nombre, icono }) => (
              <label key={nombre} className="flex flex-col items-center text-center text-sm cursor-pointer w-1/4">
                <input
                  type="checkbox"
                  value={nombre}
                  checked={formulario.plataformas.includes(nombre)}
                  onChange={handleCheckboxChange}
                  className="mb-1"
                />
                {icono}
                <span className="text-xs mt-1">{nombre}</span>
              </label>
            ))}
          </div>
        </label>

        {/* Categoría */}
        <label className="block mb-4">
          <span className="block mb-1">Categoría *</span>
          <Select
            options={opcionesCategoria}
            value={
              formulario.categoria
                ? opcionesCategoria.find((op) => op.value === formulario.categoria)
                : null
            }
            onChange={handleCategoriaChange}
            placeholder="Seleccioná una categoría"
            styles={customSelectStyles}
            isClearable
          />
        </label>

        {/* Imagen */}
        <div className="block mb-8">
          <label>
            <span className="block mb-2">Imagen del servicio *</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleFileClick}
            className="bg-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
          >
            Seleccionar archivo
          </button>

          {subiendo && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-violet-500 mx-auto mb-2"></div>
              Subiendo imagen... 🐣
            </div>
          )}

          {formulario.imagen && !subiendo && (
            <div className="mt-4">
              <img
                src={formulario.imagen}
                alt="Vista previa"
                style={{ height: "250px", objectFit: "cover" }}
                className="w-full rounded-2xl"
              />
            </div>
          )}
        </div>

        {/* Botón */}
        <div className="w-full flex justify-center mt-10">
          <button
            type="submit"
            className="bg-violet-500 text-white py-2 px-6 rounded-3xl hover:bg-violet-600 transition"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
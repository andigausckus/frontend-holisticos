// NuevoServicio.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaWhatsapp, FaSkype, FaVideo, FaGoogle } from "react-icons/fa";
import imageCompression from "browser-image-compression";

export default function NuevoServicio() {
  const navigate = useNavigate();

  const categorias = [
    "Astrología", "Biodescodificación", "Meditación", "Numerología",
    "Reiki", "Registros Akáshicos", "Tarot", "Terapia Floral", "Yoga"
  ];

  const cloudName = "dbu5cfqzf";
const uploadPreset = "servicios_holisticos";

  const plataformasDisponibles = [
    { nombre: "WhatsApp", icono: <FaWhatsapp className="text-green-500 text-2xl" /> },
    { nombre: "Zoom", icono: <FaVideo className="text-blue-500 text-2xl" /> },
    { nombre: "Skype", icono: <FaSkype className="text-sky-500 text-2xl" /> },
    { nombre: "Google Meet", icono: <FaGoogle className="text-green-600 text-2xl" /> },
  ];

  const [imagenFile, setImagenFile] = useState(null); // para la preview

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("No estás autenticado");

    const duracionTotalMinutos = Number(formulario.duracionHoras) * 60 + Number(formulario.duracionMinutos);

    const body = {
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      modalidad: formulario.modalidad[0],
      duracionMinutos: duracionTotalMinutos,
      precio: formulario.precio,
      categoria: formulario.categoria,
      plataformas: formulario.plataformas,
      imagen: formulario.imagen, // 💡 es la URL de Cloudinary
    };

    try {
      const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/servicios", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // 💡 clave para que el backend lo entienda
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      alert("Servicio creado correctamente");
      navigate(`/disponibilidad/${data.id}`);
    } catch (err) {
      console.error("❌ Error:", err);
      alert(`No se pudo guardar el servicio. Motivo: ${err.message}`);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return alert("Solo se permiten archivos de imagen.");
    }

    setImagenFile(file); // 👈 guardar para preview

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
      setFormulario((prev) => ({ ...prev, imagen: data.secure_url })); // ✅ usar la URL para el backend
    } catch (error) {
      console.error("❌ Error al subir imagen a Cloudinary:", error);
      alert("No se pudo subir la imagen.");
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#b481d9" : "#c7b6eb",
      boxShadow: state.isFocused ? "0 0 0 1px #b481d9" : "none",
      borderRadius: "5px",
      backgroundColor: "#f6f0fe",
      padding: "2px",
    }),
    placeholder: (base) => ({ ...base, color: "#888" }),
  };

  const opcionesCategoria = categorias.map((cat) => ({
    value: cat,
    label: cat,
  }));


  return (
    <div className="bg-white pt-24 p-4 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 mb-24">
        <h2 className="text-2xl font-semibold pt-12 text-center mb-6">Crear nuevo servicio 🩷</h2>

        {/* Título */}
        <label className="block mb-4">
          <span className="block mb-2">Título *</span>
          <p className="text-sm text-gray-500 mb-1">Entre 4 y 6 palabras para armonia visual</p>
          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            placeholder="Ej: Sesión de Reiki para adultos"
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
                className="w-full p-2 border-none focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Duración */}
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
        <label className="block mb-8">
          <span className="block mb-2">Imagen del servicio *</span>
          <div className="border border-gray-300 rounded p-4 mb-4">
            <p className="text-sm text-gray-500">
              Subí una imagen clara y limpia de tu servicio. No está permitido imágenes escritas con nombres de otras terapias o número de WhatsApp, esto es para mantener una estética minimalista y simple de la plataforma.
              
            </p>
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2 pt-6" />
          {imagenFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <img
  src={formulario.imagen}
                alt="Vista previa"
                className="w-full aspect-video object-cover rounded-2xl"
              />
            </div>
          )}
        </label>

        {/* Botón */}
        <div className="text-center mt-10">
          <button
            type="submit"
            className="bg-violet-500 w-full text-white py-2 px-3 rounded-3xl hover:bg-violet-600 transition"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
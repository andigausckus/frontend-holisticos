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

  const plataformasDisponibles = [
    { nombre: "WhatsApp", icono: <FaWhatsapp className="text-green-500 text-2xl" /> },
    { nombre: "Zoom", icono: <FaVideo className="text-blue-500 text-2xl" /> },
    { nombre: "Skype", icono: <FaSkype className="text-sky-500 text-2xl" /> },
    { nombre: "Google Meet", icono: <FaGoogle className="text-green-600 text-2xl" /> },
  ];

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

    const formData = new FormData();
    formData.append("titulo", formulario.titulo);
    formData.append("descripcion", formulario.descripcion);
    formData.append("modalidad", formulario.modalidad[0]); // aseguramos string
    formData.append("duracion", duracionTotalMinutos);
    formData.append("precio", formulario.precio);
    formData.append("categoria", formulario.categoria);
    formData.append("plataformas", JSON.stringify(formulario.plataformas));
    if (formulario.imagen) {
      formData.append("imagen", formulario.imagen);
    }

    try {
      const res = await fetch(`https://servicios-holisticos-backend.onrender.com/api/servicios`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      alert("Servicio creado correctamente");
      navigate("/panel");
    } catch (err) {
      console.error("❌ Error:", err);
      alert("No se pudo guardar el servicio.");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return alert("Solo se permiten archivos de imagen.");
    }

    if (file.size > 5 * 1024 * 1024) {
      return alert("La imagen es muy grande. Máximo 5MB.");
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setFormulario((prev) => ({ ...prev, imagen: compressedFile }));
    } catch (error) {
      console.error("Error al comprimir imagen:", error);
      alert("No se pudo procesar la imagen.");
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
    <div className="bg-white min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 mb-40">
        <h2 className="text-2xl font-semibold pt-12 text-center mb-6">Crear nuevo servicio 🩷</h2>

        {/* Título */}
        <label className="block mb-4">
          <span className="block mb-2">Título *</span>
          <p className="text-sm text-gray-500 mb-1">Entre 4 y 8 palabras para armonia visual</p>
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
          <p className="text-sm pt-2 text-gray-500 mb-2">
            Subí una imagen clara y limpia de tu servicio. Evitá imágenes con nombres de otras terapias o número de WhatsApp, para mejorar la experiencia del usuario.
            Revisamos cada publicación para mantener un estilo minimalista y simple del Marketplace.
          </p>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2 pt-6" />
          {formulario.imagen && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <img
                src={URL.createObjectURL(formulario.imagen)}
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
            className="bg-pink-500 text-white py-3 px-6 rounded-3xl hover:bg-pink-600 transition"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
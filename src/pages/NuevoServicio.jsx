import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaWhatsapp, FaSkype, FaVideo, FaGoogle } from "react-icons/fa";
import axios from "axios";

export default function NuevoServicio() {
  const navigate = useNavigate();

  const categorias = [
    "🌺 Aromaterapia",
    "🌸 Astrología",
    "🌿 Biodescodificación",
    "🌳 Chamanismo",
    "🍃 Coaching Holístico",
    "🌲 Constelaciones Familiares",
    "🌴 Hipnosis Regresiva",
    "🍀 Meditación",
    "🌸 Mindfulness",
    "🌻 Numerología",
    "🍃 Péndulo Hebreo",
    "🌺 Reiki",
    "🌳 Registros Akáshicos",
    "🌿 Sanación Energética",
    "🎶 Sonoterapia",
    "🌸 Tarot",
    "🌺 Terapia Floral",
    "🌿 ThetaHealing",
    "🍀 Yoga"
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

  const [alerta, setAlerta] = useState(null); // null o string del mensaje

const mostrarAlerta = (mensaje) => {
  setAlerta(mensaje);
  setTimeout(() => setAlerta(null), 4000); // desaparece después de 4 segundos
};

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Solo se permiten imágenes.");

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

  const duracionTotalMinutos =
    Number(formulario.duracionHoras) * 60 + Number(formulario.duracionMinutos);

  // Validaciones personalizadas
  if (!formulario.titulo.trim()) {
    mostrarAlerta("✍️ Agregá un título al servicio");
    return;
  }
  if (!formulario.descripcion.trim()) {
    mostrarAlerta("📝 Agregá una descripción al servicio");
    return;
  }
  if (!formulario.precio) {
    mostrarAlerta("💲 Agregá un precio al servicio");
    return;
  }
  if (!formulario.duracionHoras && !formulario.duracionMinutos) {
    mostrarAlerta("⏳ Agregá la duración del servicio");
    return;
  }
  if (formulario.plataformas.length === 0) {
    mostrarAlerta("💻 Seleccioná al menos una plataforma");
    return;
  }
  if (!formulario.categoria) {
    mostrarAlerta("🍃 Seleccioná una categoría");
    return;
  }
  if (!formulario.imagen) {
    mostrarAlerta("📸 Subí una imagen para este servicio");
    return;
  }

  // Si todo está bien → enviar
  const nuevoServicio = {
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
    const res = await axios.post(
      "https://servicios-holisticos-backend.onrender.com/api/servicios",
      nuevoServicio,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const nuevoId = res.data.servicio ? res.data.servicio._id : res.data._id;
    navigate(`/disponibilidad/${nuevoId}`, {
      state: { servicioTemp: res.data.servicio },
    });
  } catch (error) {
    console.error("❌ Error al crear servicio:", error);
    alert("No se pudo crear el servicio, intentá nuevamente.");
  }
};

  return (
    <div className="bg-white pt-24 p-4 min-h-screen">

      {alerta && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-pink-100 text-[#333] px-8 py-4 rounded-lg shadow-md z-50 animate-fade-in max-w-xl w-full text-center">
          {alerta}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 mb-24">
        <h2 className="text-2xl font-normal pt-6 text-center mb-6">Nuevo servicio 🐥</h2>

        {/* Título */}
        <label className="block mb-4">
          <span className="block mb-2">Título *</span>
          <div className="text-xs text-[#444444] mb-2">
            <p>✍️ Escribí un título con 3-6 palabras máximo</p>
            <p>❌️ No incluyas la palabra "Online"</p>
            <p>🍃 Podes incluir un (1) emoji al final para darle un toque amigable (opcional)</p>
          </div>
          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            placeholder="Ej: Sesión de meditación guiada 💜"
            className="w-full p-2 border border-[#c7b6eb] rounded focus:outline-none"
            
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
            placeholder="Ingresa un valor real"
            className="w-full p-2 border-none focus:outline-none placeholder:text-xs"
            
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
              placeholder="Desde 0 a 59"
              max="59"
              className="w-full p-2 border border-[#c7b6eb] rounded focus:outline-none placeholder:text-xs"
              
            />
          </label>
        </div>

            {/* Plataformas */}
            <label className="block mb-4">
              <span className="block mb-1">Plataforma para la sesión</span>
              <span className="block text-xs text-[#444444] mb-2">Seleccioná al menos una</span>
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
          <div className="bg-gray-100 p-3 rounded-md text-xs text-gray-600 mb-2 whitespace-pre-line">
          {`Subí una imagen limpia para este servicio 🦋

          ❌ Sin información personal
          ❌ Sin otras terapias escritas

          Revisamos todos los servicios antes de ser publicados para mantener una estética visual prolija y ordenada en la plataforma 🌈

          `}
            <span className="font-semibold">
              Esto ayuda a evitar la confusión de los usuarios 😀
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2 pt-6"
          />
          {imagenFile || formulario.imagen ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Esperá a que cargue la vista previa 🦋</p>
              <img
                src={formulario.imagen}
                alt="Vista previa"
                style={{ height: "250px", objectFit: "cover" }}
                className="w-full rounded-2xl"
              />
            </div>
          ) : null}
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
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import imageCompression from "browser-image-compression";
import { FaWhatsapp, FaSkype, FaVideo, FaGoogle } from "react-icons/fa";

export default function EditarServicio() {
  const { servicioId } = useParams();
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
    modalidad: "Online",
    duracionHoras: "",
    duracionMinutos: "",
    precio: "",
    categoria: "",
    plataformas: [],
    imagen: null,
  });

  const [nuevaImagenPreview, setNuevaImagenPreview] = useState(null);

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al cargar servicio");

        const horas = Math.floor(data.duracion / 60);
        const minutos = data.duracion % 60;

        setFormulario({
          titulo: data.titulo,
          descripcion: data.descripcion,
          modalidad: data.modalidad,
          duracionHoras: horas,
          duracionMinutos: minutos,
          precio: data.precio,
          categoria: data.categoria,
          plataformas: data.plataformas || [],
          imagen: null,
        });

      } catch (err) {
        console.error("🔴 Error al cargar:", err);
        alert("No se pudo cargar el servicio");
      }
    };

    fetchServicio();
  }, [servicioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormulario((prev) => {
      const nuevas = checked
        ? [...prev.plataformas, value]
        : prev.plataformas.filter((p) => p !== value);
      return { ...prev, plataformas: nuevas };
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

    if (file.size > 5 * 1024 * 1024) {
      return alert("La imagen es muy grande. Máximo 5MB.");
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);
      setFormulario((prev) => ({ ...prev, imagen: compressed }));
      setNuevaImagenPreview(URL.createObjectURL(compressed));
    } catch (error) {
      alert("Error al procesar imagen");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formulario.plataformas.length === 0) {
      return alert("Debes seleccionar al menos una plataforma.");
    }

    const token = localStorage.getItem("token");
    const duracion = Number(formulario.duracionHoras) * 60 + Number(formulario.duracionMinutos);

    const formData = new FormData();
    formData.append("titulo", formulario.titulo);
    formData.append("descripcion", formulario.descripcion);
    formData.append("modalidad", formulario.modalidad);
    formData.append("duracion", duracion);
    formData.append("precio", formulario.precio);
    formData.append("categoria", formulario.categoria);
    formData.append("plataformas", JSON.stringify(formulario.plataformas));

    if (formulario.imagen instanceof File || formulario.imagen instanceof Blob) {
      formData.append("imagen", formulario.imagen);
    }

    try {
      const res = await fetch(
        `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");

      alert("Servicio actualizado");
      navigate("/panel");
    } catch (error) {
      console.error("❌", error);
      alert("No se pudo actualizar el servicio");
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: "#c7b6eb",
      backgroundColor: "#f6f0fe",
      borderRadius: "5px",
      boxShadow: state.isFocused ? "0 0 0 1px #b481d9" : "none",
    }),
    placeholder: (base) => ({ ...base, color: "#888" }),
    singleValue: (base) => ({ ...base, color: "#333" }),
  };

  const opcionesCategoria = categorias.map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <div className="bg-white min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 mb-40">
        <h2 className="text-2xl font-semibold pt-12 text-center mb-6">Editar servicio 🌿</h2>

        {/* Título */}
        <label className="block mb-4">
          <span className="block mb-2">Título *</span>
          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            required
            className="w-full p-2 border border-[#c7b6eb] rounded"
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
            required
            className="w-full p-2 border border-[#c7b6eb] rounded"
          />
        </label>

        {/* Modalidad y Precio */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1">Modalidad *</label>
            <div className="px-3 py-2 border border-[#c7b6eb] rounded">
              {formulario.modalidad}
            </div>
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
              className="w-full p-2 border border-[#c7b6eb] rounded"
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
              className="w-full p-2 border border-[#c7b6eb] rounded"
              required
            />
          </label>
        </div>

        {/* Plataformas */}
        <label className="block mb-4">
          <span className="block mb-1">Plataforma para la sesión*</span>
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
            value={opcionesCategoria.find((op) => op.value === formulario.categoria)}
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
    Si no subís una nueva imagen, se mantendrá la actual.
        
    Recordá subir una imagen clara y limpia de tu servicio, sin nombres de otras terapias ni número de WhatsApp, para mejorar la experiencia del usuario.
            
          </p>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {nuevaImagenPreview && (
            <div className="mt-4 pt-2">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <img
                src={nuevaImagenPreview}
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
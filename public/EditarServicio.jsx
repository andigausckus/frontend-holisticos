import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
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
    modalidad: "Online", // fija
    duracionHoras: "",
    duracionMinutos: "",
    precio: "",
    categoria: "",
    plataformas: [],
    disponibilidad: [], // 👈 lo agregamos
  });

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

        const duracionTotal = data.duracionMinutos || 0; // <-- usar el nombre correcto
const horas = Math.floor(duracionTotal / 60);
const minutos = duracionTotal % 60;

        setFormulario({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          modalidad: "Online",
          duracionHoras: horas,
          duracionMinutos: minutos,
          precio: data.precio || "",
          categoria: data.categoria || "",
          plataformas: data.plataformas || [],
          disponibilidad: data.horariosDisponibles || [],
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formulario.plataformas.length === 0) {
      return alert("Debes seleccionar al menos una plataforma.");
    }

    const token = localStorage.getItem("token");
    const duracion = Number(formulario.duracionHoras) * 60 + Number(formulario.duracionMinutos);

    const payload = {
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      modalidad: "Online",
      duracionMinutos: duracion,
      precio: formulario.precio,
      categoria: formulario.categoria,
      plataformas: formulario.plataformas,
    };

    try {
      const res = await fetch(
        `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Respuesta del backend:", data);
        throw new Error(data.error || "Error al actualizar");
      }

      // Simplemente redirige a disponibilidad sin mostrar alert
navigate(`/disponibilidad/${servicioId}`);
    } catch (error) {
      console.error("❌ Error completo:", error);
      alert(`Error: ${error.message}`);
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
    <div className="bg-white p-4 pt-24 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 mb-24">
        <h2 className="text-xl font-normal pt-12 text-center mb-6">Editar servicio 🌿</h2>

        {/* Título */}
        <label className="block mb-4">
          <span className="block mb-2">Título *</span>
          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            required
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
            required
            className="w-full p-2 border border-[#c7b6eb] rounded focus:outline-none"
          />
        </label>

        {/* Modalidad y Precio */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1">Modalidad *</label>
            <div className="px-3 py-2 border border-[#c7b6eb] rounded bg-gray-50">
              Online
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
          <span className="block mb-1">Plataforma para la sesión*</span>
          <div className="flex flex-wrap justify-between p-3 border border-[#c7b6eb] rounded">
            {plataformasDisponibles.map(({ nombre, icono }) => (
              <label key={nombre} className="flex flex-col items-center text-center text-sm cursor-pointer w-1/4">
                <input
                  type="checkbox"
                  value={nombre}
                  checked={formulario.plataformas.includes(nombre)}
                  onChange={handleCheckboxChange}
                  className="mb-1 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
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

        {/* Botón */}
        <div className="text-center mt-10">
          <button
            type="submit"
            className="bg-violet-500 text-white py-2 px-3 w-full rounded-3xl hover:bg-violet-600 transition"
          >
            Continuar 
          </button>
        </div>
      </form>
    </div>
  );
}
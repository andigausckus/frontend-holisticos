import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "react-select";
import { FaMapMarkerAlt, FaDollarSign, FaLaptop, FaUser } from "react-icons/fa";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function Servicios() {
  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [precioMinimo, setPrecioMinimo] = useState("");
  const [precioMaximo, setPrecioMaximo] = useState("");
  const [duracionSeleccionada, setDuracionSeleccionada] = useState(null);
  const normalizar = (texto) => texto.trim();

  const categoriaEmojis = {
    "Aromaterapia": "🌻",
    "Astrología": "🌻",
    "Biodescodificación": "🌻",
    "Chamanismo": "🌻",
    "Coaching Holístico": "🌻",
    "Constelaciones Familiares": "🌻",
    "Hipnosis Regresiva": "🌻",
    "Meditación": "🌻",
    "Mindfulness": "🌻",
    "Numerología": "🌻",
    "Péndulo Hebreo": "🌻",
    "Reiki": "🌻",
    "Registros Akáshicos": "🌻",
    "Sanación Energética": "🌻",
    "Sonoterapia": "🌻",
    "Tarot": "🌻",
    "Terapia Floral": "🌻",
    "ThetaHealing": "🌻",
    "Yoga": "🌻"
  };

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/servicios");
        const data = await res.json();

        console.log("Servicios recibidos para la grilla:", data); // <-- log más claro

        setServicios(data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      } finally {
        await delay(1000);
        setLoading(false);
      }
    };

    cargarServicios();
  }, []);

  const categorias = [...new Set(servicios.map((s) => s.categoria))].sort();
  const duraciones = [
  { value: "30-45", label: "🕒 30 a 45 minutos" },
  { value: "45-60", label: "🕒 45 a 60 minutos" },
  { value: "60+", label: "🕒 Más de 60 minutos" },
];

  // 🟩 Esta función convierte "60 minutos", "90 min", "45", etc. en números
const extraerMinutos = (duracion) => {
  if (typeof duracion === "number") return duracion;
  if (typeof duracion === "string") {
    const match = duracion.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
};

  const serviciosFiltrados = servicios.filter((s) => {
console.log("🧪 Servicio:", s);
const coincideCategoria = !categoriaSeleccionada || s.categoria === categoriaSeleccionada.value;
const coincidePrecio =
(!precioMinimo || s.precio >= parseInt(precioMinimo)) &&
(!precioMaximo || s.precio <= parseInt(precioMaximo));
const minutos = s.duracionMinutos;
const coincideDuracion =
!duracionSeleccionada ||
(duracionSeleccionada.value === "30-45" &&
minutos >= 30 &&
minutos <= 45) ||
(duracionSeleccionada.value === "45-60" &&
minutos >= 45 &&
minutos <= 60) ||
(duracionSeleccionada.value === "60+" && minutos > 60);
return coincideCategoria && coincidePrecio && coincideDuracion;
});

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#b481d9" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px #b481d9" : "none",
      "&:hover": { borderColor: "#b481d9" },
      borderRadius: "1rem",
      padding: "2px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f3e9fb" : "white",
      color: "#333",
      padding: 10,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#888",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }),
  };

  const opcionesConEmoji = (array) =>
    array.map((item) => {
      const key = normalizar(item);
      return {
        value: key,
        label: `${categoriaEmojis[key] || ""} ${key}`,
      };
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen max-w-4xl mb-24 mx-auto px-4 pt-24 pb-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-xl font-semibold text-[#333] mb-2">
          Reservá hoy tu sesión online y comenzá tu camino de transformación 🌟
        </h2>
      </div>

      {/* Filtros */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
  {/* Categoría */}
  <Select
    options={opcionesConEmoji(categorias)}
  placeholder="Seleccioná una categoría"
  value={categoriaSeleccionada}
  onChange={setCategoriaSeleccionada}
  styles={{
    ...customStyles,
    control: (base) => ({
      ...base,
      borderColor: "#D1D5DB",
      boxShadow: "none",
      borderRadius: "1.5rem", // Utiliza este valor para rounded-xl
      "&:hover": {
        borderColor: "#D1D5DB",
      },
      "&:focus-within": {
        borderColor: "#C7B8EA",
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottom: "1px solid #C7B8EA",
      },
    }),
  }}
  isClearable
  noOptionsMessage={() => "No hay servicios para esta categoría. ¡Muy pronto habrá!"}
/>

{/* Duración */}
<Select
  options={duraciones}
  placeholder="Seleccioná una duración"
  value={duracionSeleccionada}
  onChange={setDuracionSeleccionada}
  styles={{
    ...customStyles,
    control: (base) => ({
      ...base,
      borderColor: "#D1D5DB",
      boxShadow: "none",
      borderRadius: "1.5rem", // Utiliza este valor para rounded-xl
      "&:hover": {
        borderColor: "#D1D5DB",
      },
      "&:focus-within": {
        borderColor: "#C7B8EA",
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottom: "1px solid #C7B8EA",
      },
    }),
  }}
  isClearable
/>

  {/* Precio */}
<div className="flex gap-3 w-full">
{/* Campo precio mínimo */}
<div className="flex-1 border border-gray-300 rounded-3xl px-3 py-2 focus-within:border-b-[1px] focus-within:border-[#C7B8EA] transition duration-200">
<input
type="number"
placeholder="Mínimo ($)"
className="w-full border-none focus:outline-none text-sm"
value={precioMinimo}
onChange={(e) => setPrecioMinimo(e.target.value)}
min={0}
/>
</div>

{/* Campo precio máximo */}
<div className="flex-1 border border-gray-300 rounded-3xl px-3 py-2 focus-within:border-b-[1px] focus-within:border-[#C7B8EA] transition duration-200">
<input
type="number"
placeholder="Máximo ($)"
className="w-full border-none focus:outline-none text-sm"
value={precioMaximo}
onChange={(e) => setPrecioMaximo(e.target.value)}
min={0}
/>
</div>
</div>
</div>

      {/* Servicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviciosFiltrados.length === 0 ? (
          <p className="text-center text-[#333] mt-8">
            No se encontraron servicios con los filtros seleccionados.
          </p>
        ) : (
          serviciosFiltrados.map((servicio) => (
              <div
                key={servicio._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between"
                style={{ height: "550px" }}
              >
                {/* Contenedor relativo para poder colocar el badge */}
                <div className="relative w-full h-[60%]">
                  <img
                    src={servicio.imagen}
                    alt={servicio.titulo}
                    className="w-full h-full object-cover"
                  />

                  {/* Badge "NUEVO" */}
                  {(() => {
                    const fechaCreacion = new Date(servicio.createdAt); // <-- asume que existe este campo
                    const hoy = new Date();
                    const diasDiferencia = Math.floor((hoy - fechaCreacion) / (1000 * 60 * 60 * 24));
                    if (diasDiferencia <= 3) { // mostrar solo los primeros 3 días
                      return (
                        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-md">
                          NUEVO 
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              <div className="p-4 flex flex-col items-center justify-between flex-grow text-center">
                <div className="mb-2">
                  <h3 className="text-xl text-[#444] font-medium mb-2 mt-2">
  {servicio.titulo}
</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
  {/* Promedio grande con fondo amarillo oscuro */}
  <span 
  className="text-md font-bold text-white bg-yellow-500 px-2 py-1 rounded-md mr-3 text-center"
  style={{ 
    width: "4.5ch", 
    display: "inline-block",
    textAlign: "center"
  }}
>
  {servicio.promedioResenas?.toFixed(servicio.promedioResenas === 5 ? 0 : 1) || "0.0"}
</span>




                    {/* Estrellas */}
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`text-md ${
                          n <= Math.round(servicio.promedioResenas || 0)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}

                    {/* Cantidad de reseñas */}
                    <span className="text-yellow-500 text-sm ml-2">
                      ({servicio.cantidadResenas || 0} reseñas)
                    </span>
                  </div>

                  <div className="mt-3 pt-2 flex flex-row items-center justify-center gap-6 text-[#333] text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <FaUser className="text-pink-500 w-4 h-4" />
                      <span>{servicio.terapeuta?.nombreCompleto || "Terapeuta"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaLaptop className="text-pink-500 w-4 h-4" />
                      <span>{servicio.modalidad}</span>
                    </div>
                    <div className="flex items-center gap-1 font-normal text-[17px]">
                      <FaDollarSign className="text-pink-500 w-4 h-4" />
                      <span>{servicio.precio}</span>
                    </div>
                  </div>
                </div>

                 

                <Link
                  to={`/servicios/${servicio.slug || servicio._id}`}
                  className="bg-pink-400 text-white px-4 py-2 rounded-full text-base hover:bg-pink-500 transition-all text-center block"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Servicios;
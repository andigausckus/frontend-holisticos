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

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/servicios");
        const data = await res.json();
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
    { value: "30-45", label: "De 30 a 45 minutos" },
    { value: "45-60", label: "De 45 a 60 minutos" },
    { value: "60+", label: "Más de 60 minutos" },
  ];

  const serviciosFiltrados = servicios.filter((s) => {
    const coincideCategoria = !categoriaSeleccionada || s.categoria === categoriaSeleccionada.value;
    const coincidePrecio =
      (!precioMinimo || s.precio >= parseInt(precioMinimo)) &&
      (!precioMaximo || s.precio <= parseInt(precioMaximo));
    const coincideDuracion = !duracionSeleccionada || (
      duracionSeleccionada.value === "30-45" && s.duracion >= 30 && s.duracion <= 45 ||
      duracionSeleccionada.value === "45-60" && s.duracion >= 45 && s.duracion <= 60 ||
      duracionSeleccionada.value === "60+" && s.duracion > 60
    );
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

  const opcionesSinIcono = (array) =>
    array.map((item) => ({
      value: item,
      label: item,
    }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen max-w-6xl mb-24 mx-auto px-4 pt-24 pb-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-2">
          Reservá hoy tu sesión online y comenzá tu camino de transformación 🌟
        </h2>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
        {/* Categoría */}
        <Select
          options={opcionesSinIcono(categorias)}
          placeholder="Seleccioná una categoría"
          value={categoriaSeleccionada}
          onChange={setCategoriaSeleccionada}
          styles={customStyles}
          isClearable
          noOptionsMessage={() => "No hay servicios para esta categoría. ¡Muy pronto habrá!"}
        />

        {/* Duración */}
        <Select
          options={duraciones}
          placeholder="Seleccioná una duración"
          value={duracionSeleccionada}
          onChange={setDuracionSeleccionada}
          styles={customStyles}
          isClearable
        />

        {/* Precio */}
        <div className="flex gap-2 focus-within:border-[2px] items-center border border-gray-300 rounded-[1rem] px-3 py-2 focus-within:border-violet-600 hover:border-violet-500 transition duration-200">
          <input
            type="number"
            placeholder="Mínimo ($)"
            className="w-full border-none focus:outline-none text-sm"
            value={precioMinimo}
            onChange={(e) => setPrecioMinimo(e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Máximo ($)"
            className="w-full border-none focus:outline-none text-sm"
            value={precioMaximo}
            onChange={(e) => setPrecioMaximo(e.target.value)}
          />
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
              style={{ height: "470px" }}
            >
              <img
                src={servicio.imagen}
                alt={servicio.titulo}
                className="w-full h-1/2 object-cover"
              />
              <div className="p-4 flex flex-col items-center justify-between flex-grow text-center">
                <div className="mb-2">
                  <h3 className="text-xl text-[#333] font-semibold mb-2 mt-2">
                    {servicio.titulo}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-3 text-sm">
                    <span>☆☆☆☆☆</span>
                    <span className="text-gray-400">(0) reseñas</span>
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
                    <div className="flex items-center gap-1 font-semibold text-[17px]">
                      <FaDollarSign className="text-pink-500 w-4 h-4" />
                      <span>${servicio.precio}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/servicios/${servicio._id}`}
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
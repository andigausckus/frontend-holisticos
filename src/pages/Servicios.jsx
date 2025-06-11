import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "react-select";
import serviciosData from "../data/servicios";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaLaptop,
  FaUser,
} from "react-icons/fa";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function Servicios() {
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState(null);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      await delay(1000);
      setLoading(false);
    };
    cargar();
  }, []);

  const categorias = [...new Set(serviciosData.map((s) => s.categoria))].sort();
  const provincias = [...new Set(serviciosData.map((s) => s.provincia))].sort();
  const modalidades = ["Online", "Presencial"];

  const ciudades = provinciaSeleccionada
    ? [...new Set(serviciosData.filter((s) => s.provincia === provinciaSeleccionada.value).map((s) => s.ciudad))].sort()
    : [];

  const serviciosFiltrados = serviciosData.filter((s) => {
    return (
      (!categoriaSeleccionada || s.categoria === categoriaSeleccionada.value) &&
      (!modalidadSeleccionada || s.modalidad === modalidadSeleccionada.value) &&
      (!provinciaSeleccionada || s.provincia === provinciaSeleccionada.value) &&
      (!ciudadSeleccionada || s.ciudad === ciudadSeleccionada.value)
    );
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
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Select
          options={opcionesSinIcono(categorias)}
          placeholder="Seleccioná una categoría"
          value={categoriaSeleccionada}
          onChange={setCategoriaSeleccionada}
          styles={customStyles}
          isClearable
          noOptionsMessage={() => "No hay servicios para esta categoría. ¡Muy pronto habrá!"}
        />
        <Select
          options={opcionesSinIcono(modalidades)}
          placeholder="Seleccioná una modalidad"
          value={modalidadSeleccionada}
          onChange={setModalidadSeleccionada}
          styles={customStyles}
          isClearable
        />
        <Select
          options={opcionesSinIcono(provincias)}
          placeholder="Seleccioná una provincia"
          value={provinciaSeleccionada}
          onChange={(prov) => {
            setProvinciaSeleccionada(prov);
            setCiudadSeleccionada(null);
          }}
          styles={customStyles}
          isClearable
          noOptionsMessage={() =>
            "Por el momento no hay terapeutas registrados en esta provincia. ¡Pronto habrá nuevos profesionales!"
          }
        />
        <Select
          options={opcionesSinIcono(ciudades)}
          placeholder="Seleccioná una ciudad"
          value={ciudadSeleccionada}
          onChange={setCiudadSeleccionada}
          styles={customStyles}
          isClearable
          noOptionsMessage={() =>
            "Por el momento no hay terapeutas registrados en esta ciudad. ¡Pronto habrá nuevos profesionales!"
          }
        />
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviciosFiltrados.length === 0 ? (
          <p className="text-center text-[#333] mt-8">
            No se encontraron servicios con los filtros seleccionados.
          </p>
        ) : (
          serviciosFiltrados.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between"
              style={{ height: "520px" }}
            >
              <img
                src={servicio.imagen}
                alt={servicio.nombre}
                className="w-full h-1/2 object-cover"
              />
              <div className="p-4 flex flex-col items-center justify-between flex-grow text-center">
                <div className="mb-2">
                  <h3 className="text-xl text-[#333] font-semibold mb-2 mt-2">
                    {servicio.nombre}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-3 text-sm">
                    <span>★★★★★</span>
                    <span className="text-yellow-500">(10) reseñas</span>
                  </div>

                  {/* 🔄 BLOQUE MEJORADO */}
                  <div className="mt-1 flex flex-col items-start space-y-2 text-[#333] text-sm">
                    <div className="flex items-center gap-5">
                      <FaUser className="text-pink-500 w-4 h-4" />
                      <span>{servicio.terapeuta}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      {servicio.modalidad === "Online" ? (
                        <FaLaptop className="text-pink-500 w-4 h-4" />
                      ) : (
                        <FaMapMarkerAlt className="text-pink-500 w-4 h-4" />
                      )}
                      <span>{servicio.modalidad}</span>
                    </div>
                    <div className="flex items-center gap-5 font-semibold text-[17px]">
                      <FaDollarSign className="text-pink-500 w-4 h-4" />
                      <span>${servicio.precio}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/servicios/${servicio.id}`}
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
import { useParams, useNavigate } from "react-router-dom";
import serviciosData from "../data/servicios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendario.css";
import {
  FaUser,
  FaDollarSign,
  FaClock,
  FaMapMarkerAlt,
  FaLaptop,
} from "react-icons/fa";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const horariosFicticios = {
  "2025-06-10": ["10:00", "14:00"],
  "2025-06-11": [],
  "2025-06-12": null,
  "2025-06-13": ["16:00"],
};

function ServicioDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const servicio = serviciosData.find((s) => s.id === parseInt(id));
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
  const [mostrarResenas, setMostrarResenas] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const tasaServicio = Math.round(servicio?.precio * 0.1);
  const precioFinal = servicio?.precio + tasaServicio;

  if (!servicio) {
    return <div className="pt-24 text-center text-[#333]">Servicio no encontrado</div>;
  }

  const fechaKey = format(fechaSeleccionada, "yyyy-MM-dd");
  const horarios = horariosFicticios[fechaKey];

  let estado = "sin-horarios";
  if (horarios === null) estado = "no-trabaja";
  else if (horarios && horarios.length > 0) estado = "disponible";

  const mensajeEstado = {
    disponible: "✅ Hay horarios disponibles para este día",
    "sin-horarios": "⛔ No hay horarios disponibles para este día",
    "no-trabaja": "❌ El terapeuta no trabaja este día",
  };

  const colorEstado = {
    disponible: "text-green-600",
    "sin-horarios": "text-gray-600",
    "no-trabaja": "text-red-500",
  };

  return (
    <div className="pt-20 pb-16 px-4 max-w-2xl mx-auto">
      <img
        src={servicio.imagen}
        alt={servicio.nombre}
        className="w-full h-60 md:h-72 object-cover rounded-3xl mb-6 shadow"
      />

      <div className="bg-white text-sm rounded-xl shadow-md pl-6 p-4 text-[#333] space-y-4">
        <h1 className="text-xl font-bold text-center">{servicio.nombre}</h1>

        <div className="flex justify-center items-center gap-3 text-yellow-600 text-sm -mt-1">
          <span className="text-gl">★★★★★</span>
          <span>(10) reseñas</span>
        </div>

        {/* Fila 1: ícono terapeuta + nombre, y ciudad + provincia en la misma línea */}
        <div className="flex justify-center gap-12 text-center px-2">
          <div className="flex items-center gap-6 text-gray-600 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <FaUser className="text-pink-500" />
              <span>{servicio.terapeuta}</span>
            </div>
            {servicio.modalidad === "Presencial" ? (
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-pink-500" />
                <span>
                  {servicio.ciudad}, {servicio.provincia}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <FaLaptop className="text-pink-500" />
                <span>Online</span>
              </div>
            )}
          </div>
        </div>

        {/* Fila 2 */}
        <div className="flex justify-center gap-12 text-center px-2">
          <p className="flex items-center gap-1 justify-center text-gray-600">
            <FaClock className="text-pink-500" />
            {servicio.duracion}
          </p>
          <p className="flex items-center gap-1 justify-center text-gray-600">
            <FaDollarSign className="text-pink-500" />
            ${servicio.precio}
          </p>
        </div>
      </div>

      {/* Botones Descripción / Reseñas */}
      <div className="mt-8 flex pt-4 gap-4">
        <button
          onClick={() => setMostrarDescripcion(!mostrarDescripcion)}
          className={`flex-1 flex justify-center items-center px-4 py-3 rounded-3xl shadow-sm font-semibold gap-2
            ${mostrarDescripcion ? "bg-pink-500 text-white" : "bg-pink-400 text-white"}`}
        >
          Descripción
          <FiChevronDown
            className={`transition-transform duration-300 ${mostrarDescripcion ? "rotate-180" : ""}`}
            size={20}
          />
        </button>

        <button
          onClick={() => setMostrarResenas(!mostrarResenas)}
          className={`flex-1 flex justify-center items-center px-4 py-3 rounded-3xl shadow-sm font-semibold gap-2
            ${mostrarResenas ? "bg-pink-500 text-white" : "bg-pink-400 text-white"}`}
        >
          Reseñas
          <FiChevronDown
            className={`transition-transform duration-300 ${mostrarResenas ? "rotate-180" : ""}`}
            size={20}
          />
        </button>
      </div>

      {/* Contenido Descripción / Reseñas */}
      {(mostrarDescripcion || mostrarResenas) && (
        <div className="mt-4 flex flex-col md:flex-row gap-4 overflow-x-auto">
          {mostrarDescripcion && (
            <div className="flex-1 min-w-[300px] bg-white text-sm text-[#333] px-6 py-5 rounded-xl shadow-inner text-left">
              {servicio.descripcion || "Este servicio no tiene descripción aún."}
            </div>
          )}
          {mostrarResenas && (
            <div className="flex-1 min-w-[300px] bg-white text-sm text-[#333] px-6 py-5 rounded-xl shadow-inner">
              <div className="space-y-4">
                <p>Juan - Hermosa sesión, me encantó.</p>
                <p>María - Me sentí muy contenida y relajada.</p>
                <p>Luis - Profesional y cálida atención.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendario */}
      <div className="mt-8">
        <h2 className="text-lg pt-4 font-semibold text-[#333] mb-4">Elegí una fecha para tu sesión</h2>
        <Calendar
          onChange={setFechaSeleccionada}
          value={fechaSeleccionada}
          locale="es"
        />
      </div>

      {/* Estado del día seleccionado */}
      <div className={`mt-6 text-center font-medium ${colorEstado[estado]}`}>
        {mensajeEstado[estado]}
      </div>

      {/* Botón reservar */}
      {estado === "disponible" && (
        <div className="mt-4 text-center">
          <button
            className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-3 rounded-3xl shadow"
            onClick={() => navigate("/pago", { state: { servicio } })}
          >
            Reservar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default ServicioDetalle;
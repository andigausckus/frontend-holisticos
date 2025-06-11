import { useParams } from "react-router-dom";
import serviciosData from "../data/servicios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendario.css";
import {
  FaWhatsapp,
  FaVideo,
  FaPhone,
  FaSkype,
  FaUser,
  FaDollarSign,
  FaClock,
  FaMapMarkedAlt,
  FaWifi,
  FaCouch,
} from "react-icons/fa";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const iconosPlataforma = {
  WhatsApp: <FaWhatsapp className="inline text-green-500 ml-1" />,
  Zoom: <FaVideo className="inline text-blue-500 ml-1" />,
  Meet: <FaVideo className="inline text-red-500 ml-1" />,
  Teléfono: <FaPhone className="inline text-gray-500 ml-1" />,
  Skype: <FaSkype className="inline text-blue-600 ml-1" />,
};

// Horarios ficticios por día (de prueba)
const horariosFicticios = {
  "2025-06-10": ["10:00", "14:00"],
  "2025-06-11": [],
  "2025-06-12": null, // el terapeuta no trabaja
  "2025-06-13": ["16:00"],
};

function ServicioDetalle() {
  const { id } = useParams();
  const servicio = serviciosData.find((s) => s.id === parseInt(id));
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
  const [mostrarResenas, setMostrarResenas] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

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
    <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
      <img
        src={servicio.imagen}
        alt={servicio.nombre}
        className="w-full h-60 md:h-72 object-cover rounded-3xl mb-6 shadow"
      />

      <div className="bg-white text-sm rounded-xl shadow-md pl-6 p-4 text-[#333] space-y-4">
        <h1 className="text-2xl font-bold text-center">{servicio.nombre}</h1>

        <div className="flex justify-center items-center gap-5 text-yellow-500 text-sm -mt-1">
          <span>★★★★★</span>
          <span>(10) reseñas</span>
        </div>

        <p className="flex items-center gap-2 text-gray-600">
          <FaUser className="inline" />
          Terapeuta - {servicio.terapeuta}
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          {servicio.modalidad === "Presencial" ? (
            <FaMapMarkedAlt className="inline" />
          ) : (
            <FaCouch className="inline" />
          )}
          Modalidad - {servicio.modalidad}
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          <FaClock className="inline" />
          Duración - {servicio.duracion}
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          <FaDollarSign className="inline" />
          Precio - ${servicio.precio}
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          <FaWifi className="inline" />
          Plataforma - {servicio.plataforma} {iconosPlataforma[servicio.plataforma]}
        </p>
      </div>

      {/* Botones Descripción / Reseñas */}
      <div className="mt-6 flex gap-4">
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
        <h2 className="text-lg font-semibold text-[#333] mb-4">Elegí una fecha para tu sesión</h2>
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
          <button className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-3 rounded-3xl shadow">
            Reservar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default ServicioDetalle;
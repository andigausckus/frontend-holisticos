import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendario.css";
import {
  FaUser,
  FaDollarSign,
  FaClock,
  FaLaptop,
  FaWhatsapp,
  FaVideo,
  FaGoogle,
  FaSkype,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function ServicioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [servicio, setServicio] = useState(null);
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
  const [mostrarResenas, setMostrarResenas] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState({});

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const response = await fetch(`https://servicios-holisticos-backend.onrender.com/api/servicios/publico/${id}`);
        if (!response.ok) throw new Error("No se pudo obtener el servicio");
        const data = await response.json();

        // 🕒 Formatear duración
        const duracionMin = parseInt(data.duracion);
        const horas = Math.floor(duracionMin / 60);
        const minutos = duracionMin % 60;
        let duracionFormateada = "";
        if (horas > 0) duracionFormateada += `${horas} h `;
        if (minutos > 0) duracionFormateada += `${minutos} min`;
        data.duracionFormateada = duracionFormateada.trim();

        setServicio(data);
      } catch (error) {
        console.error("❌ Error al cargar servicio:", error);
      }
    };
    fetchServicio();
  }, [id]);

  useEffect(() => {
    const obtenerDisponibilidad = async () => {
      if (!servicio?._id) return;
      try {
        const response = await fetch(`https://servicios-holisticos-backend.onrender.com/api/terapeutas/disponibilidad/${servicio._id}`);
        if (!response.ok) throw new Error("Error al obtener disponibilidad");

        const data = await response.json();
        const disponibilidadFormateada = {};
        data.forEach((item) => {
          disponibilidadFormateada[item.fecha] = item.horas;
        });

        setDisponibilidad(disponibilidadFormateada);
      } catch (error) {
        console.error("Error al cargar disponibilidad:", error);
      }
    };

    obtenerDisponibilidad();
  }, [servicio]);

  if (!servicio) {
    return <div className="pt-24 text-center text-[#333]">Servicio no encontrado</div>;
  }

  const fechaKey = format(fechaSeleccionada, "yyyy-MM-dd");
  const horarios = disponibilidad[fechaKey];

  let estado = "sin-horarios";
  if (horarios === null) estado = "no-trabaja";
  else if (horarios && horarios.length > 0) estado = "disponible";

  const mensajeEstado = {
    disponible: "Elegí el horario para tu sesión online",
    "sin-horarios": "No hay disponibilidad para este día",
    "no-trabaja": "El terapeuta no atiende este día",
  };

  const colorEstado = {
    disponible: "text-green-600",
    "sin-horarios": "text-gray-600",
    "no-trabaja": "text-red-500",
  };

  const obtenerIconoPlataforma = (nombre) => {
    switch (nombre.toLowerCase()) {
      case "whatsapp":
        return <FaWhatsapp key={nombre} className="text-green-600" title="WhatsApp" />;
      case "zoom":
        return <FaVideo key={nombre} className="text-blue-500" title="Zoom" />;
      case "meet":
        return <FaGoogle key={nombre} className="text-red-500" title="Google Meet" />;
        case "skype":
      return <FaSkype key={nombre} className="text-sky-600" title="Skype" />;
        
      default:
        return <span className="text-gray-500" key={nombre}>{nombre}</span>;
    }
  };

const duracionFormateada = (minutos) => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  if (horas > 0 && mins > 0) return `${horas} h ${mins} min`;
  if (horas > 0) return `${horas} h`;
  return `${mins} min`;
};
  
  return (
    <div className="pt-12 bg-white pb-16 px-4 max-w-2xl mx-auto">
      <img
        src={servicio.imagen}
        alt={servicio.titulo}
        className="w-full aspect-video object-cover rounded-3xl mb-6"
      />

      <div className="bg-white text-sm rounded-xl shadow-md pl-6 p-4 text-[#333] space-y-4">
        <h1 className="text-xl font-bold text-center">{servicio.titulo}</h1>
        <div className="flex justify-center gap-1 text-gray-400 text-sm -mt-1">
  <span>☆☆☆☆☆</span>
  <span>(0) reseñas</span>
</div>

        {/* Fila 1: Terapeuta, Modalidad, Precio */}
        <div className="flex justify-center gap-6 text-center px-2 flex-wrap">
          <div className="flex items-center gap-1 text-gray-600">
            <FaUser className="text-pink-500" />
            <span>{servicio.terapeuta?.nombreCompleto}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <FaLaptop className="text-pink-500" />
            <span>Online</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <FaDollarSign className="text-pink-500" />
            <span>{servicio.precio}</span>
          </div>
        </div>

        {/* Fila 2: Duración, Plataformas */}
        <div className="flex justify-center gap-6 text-center px-2 flex-wrap">
          <div className="flex items-center gap-1 text-gray-600">
            <FaClock className="text-pink-500" />
            <span>{duracionFormateada(servicio.duracion)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-pink-500">🔗</span>
            {servicio.plataformas?.length > 0 ? (
              servicio.plataformas.map((p, i) => (
                <span key={i}>{obtenerIconoPlataforma(p)}</span>
              ))
            ) : (
              <span className="text-gray-400">Sin plataforma</span>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
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
              <p className="text-gray-400">Este servicio aún no tiene reseñas.</p>
            </div>
          )}
        </div>
      )}

      {/* Calendario */}
      <div className="mt-8">
        <h2 className="text-xl text-center pt-4 font-semibold text-[#333] mb-4">
          Elegí una fecha para tu sesión
        </h2>
        <Calendar
          onChange={setFechaSeleccionada}
          value={fechaSeleccionada}
          locale="es"
        />
      </div>

      {/* Estado del día */}
      <div className={`mt-6 text-center font-medium ${colorEstado[estado]}`}>
        {mensajeEstado[estado]}
      </div>

      {/* Botón reservar */}
      {estado === "disponible" && (
        <div className="mt-4 text-center">
          <button
            className="bg-[#009929] hover:bg-[#006414] text-white px-6 py-3 rounded-3xl shadow"
            onClick={() =>
              navigate("/pago", {
                state: {
                  servicio,
                  fecha: fechaSeleccionada,
                  hora: horarios?.[0] || "Sin horario",
                },
              })
            }
          >
            Reservar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default ServicioDetalle;
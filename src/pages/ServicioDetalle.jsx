import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
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
import CalendarioSemanal from "../components/CalendarioSemanal";
import { FaWifi } from "react-icons/fa";

function ServicioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [servicio, setServicio] = useState(null);
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
  const [mostrarResenas, setMostrarResenas] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [seleccion, setSeleccion] = useState(null);

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const response = await fetch(
          `https://servicios-holisticos-backend.onrender.com/api/servicios/publico/${id}`
        );
        if (!response.ok) throw new Error("No se pudo obtener el servicio");
        const data = await response.json();

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
      if (!servicio || typeof servicio._id === "undefined") return;

      try {
        const res = await fetch(
          `https://servicios-holisticos-backend.onrender.com/api/terapeutas/disponibilidad-fechas/${servicio._id}`
        );
        if (!res.ok) throw new Error("No se pudo obtener la disponibilidad");
        const data = await res.json();
        setDisponibilidad(data);
      } catch (error) {
        console.error("❌ Error al obtener disponibilidad:", error);
      }
    };

    obtenerDisponibilidad();
  }, [servicio]);

  const obtenerIconoPlataforma = (nombre) => {
    switch (nombre?.toLowerCase()) {
      case "whatsapp":
        return <FaWhatsapp key={nombre} className="text-2xl text-green-600" title="WhatsApp" />;
      case "zoom":
        return <FaVideo key={nombre} className="text-2xl text-blue-500" title="Zoom" />;
      case "google meet":
case "meet":
  return <FaGoogle key={nombre} className="text-2xl text-green-600" title="Google Meet" />;
      case "skype":
        return <FaSkype key={nombre} className="text-2xl text-sky-600" title="Skype" />;
      default:
        return <span className="text-gray-500" key={nombre}>Sin definir</span>;
    }
  };

  const duracionFormateada = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0 && mins > 0) return `${horas} h ${mins} min`;
    if (horas > 0) return `${horas} h`;
    return `${mins} min`;
  };

  if (!servicio) {
    return <div className="pt-24 text-center text-[#333]">Servicio no encontrado</div>;
  }

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

        <div className="flex justify-center gap-6 text-center px-2 flex-wrap">
  <div className="flex items-center gap-1 text-gray-600">
    <FaUser className="text-pink-500" />
    <span>{servicio.terapeuta?.nombreCompleto}</span>
  </div>

  <div className="flex items-center gap-1 text-gray-600">
    <FaLaptop className="text-pink-500" />
    <span>{servicio.modalidad || "Sin definir"}</span>
  </div>

  <div className="flex items-center gap-1 text-gray-600">
    <FaDollarSign className="text-pink-500" />
    <span>{servicio.precio}</span>
  </div>
</div>

<div className="flex justify-center gap-6 text-center px-2 flex-wrap">
  <div className="flex items-center gap-1 text-gray-600">
    <FaClock className="text-pink-500" />
    <span>{duracionFormateada(servicio.duracion)}</span>
  </div>

  <div className="flex items-center gap-2 text-gray-600">
  <FaWifi className="text-pink-500" />
  <span>Se brinda por</span>
  {servicio.plataformas?.length > 0 ? (
    servicio.plataformas.map((p, i) => (
      <span key={i}>{obtenerIconoPlataforma(p)}</span>
    ))
  ) : (
    <span className="text-gray-400 ml-1">Sin definir</span>
  )}
</div>
</div>
  </div>


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

      {disponibilidad.length > 0 && (
  <div className="mt-8 text-sm text-[#333] bg-gray-100 rounded-xl px-6 py-4 space-y-2">
    <h3 className="text-base font-semibold">Disponibilidad del terapeuta:</h3>
    {disponibilidad.map((dia, index) => (
      <div key={index}>
        <strong>{dia.fecha}</strong>
        <ul className="list-disc ml-5">
          {dia.rangos.map((rango, i) => (
            <li key={i}>
              {rango.desde} - {rango.hasta}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}

<div className="mt-8">
  <CalendarioSemanal
    servicio={servicio}
    disponibilidad={disponibilidad}
    duracionMinutos={servicio.duracion}
    onSeleccionar={(fecha, hora) => {
      setSeleccion({ fecha, hora });
    }}
  />
</div>

      {seleccion && (
        <div className="mt-4 text-center">
          <button
            className="bg-[#009929] hover:bg-[#006414] text-white px-6 py-3 rounded-3xl shadow"
            onClick={() =>
              navigate("/pago", {
                state: {
                  servicio,
                  fecha: seleccion.fecha,
                  hora: seleccion.hora,
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
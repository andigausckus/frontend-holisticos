import { useParams, useNavigate } from "react-router-dom";
import CalendarioSemanal from "../components/CalendarioSemanal";
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
  FaWifi,
} from "react-icons/fa";

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

        const duracionRaw = data.duracion ?? data.duracionMinutos ?? 0;
        const duracionMin = parseInt(duracionRaw, 10);

        const horas = Math.floor(duracionMin / 60);
        const minutos = duracionMin % 60;
        let duracionFormateada = "";
        if (horas > 0) duracionFormateada += `${horas} h `;
        if (minutos > 0 || horas === 0) duracionFormateada += `${minutos} min`;
        data.duracionFormateada = duracionFormateada.trim();

        setServicio(data);
      } catch (error) {
        console.error("❌ Error al cargar servicio:", error);
      }
    };
    fetchServicio();
  }, [id]);

  useEffect(() => {
    if (servicio?.horariosDisponibles) {
      const formateada = servicio.horariosDisponibles.map((d) => ({
        fecha: d.fecha,
        horariosFijos: d.horariosFijos || [],
      }));
      setDisponibilidad(formateada);
    }
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

  if (!servicio) {
    return (
      <div className="pt-24 text-center text-[#333]">Servicio no encontrado</div>
    );
  }

  return (
    <div className="bg-white pt-24 px-2 max-w-6xl mx-auto shadow-md rounded-xl overflow-hidden">
      {/* 🖼 Imagen del servicio */}
      {servicio.imagen && (
        <img
          src={servicio.imagen}
          alt={servicio.titulo}
          className="w-full aspect-video object-cover mb-6 rounded-t-xl lg:max-h-[400px]"
        />
      )}

      {/* 🧾 Información del servicio */}
      <div className="bg-white shadow-md rounded-3xl text-sm pl-6 p-4 text-[#333] space-y-4">
        <h1 className="text-xl font-bold text-center">{servicio.titulo}</h1>

        <div className="flex justify-center gap-1 text-gray-400 text-sm -mt-1">
          <span>☆☆☆☆☆</span>
          <span>(0 reseñas)</span>
        </div>

        <div className="flex justify-center gap-6 text-center px-2 flex-wrap">
          <div className="flex items-center gap-1 text-gray-600">
            <FaUser className="text-pink-500" />
            <span>{servicio.terapeuta?.nombreCompleto}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <FaLaptop className="text-pink-500" />
            <span>{servicio.modalidad}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <FaDollarSign className="text-pink-500" />
            <span>${servicio.precio}</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 mt-4 flex-wrap">
          <div className="flex items-center gap-1 text-gray-600">
            <FaClock className="text-pink-500" />
            <span>{servicio.duracionFormateada}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <FaWifi className="text-pink-500" />
            <span>Se brinda por</span>
            {servicio.plataformas?.length > 0 ? (
              servicio.plataformas.map((p, i) => (
                <span key={i}>{obtenerIconoPlataforma(p)}</span>
              ))
            ) : (
              <span className="text-gray-400">Sin definir</span>
            )}
          </div>
        </div>
      </div>

      {/* 📑 Botones de Descripción y Reseñas */}
      <div className="mt-8 flex flex-row justify-center pt-4 gap-4">
        <button
          onClick={() => setMostrarDescripcion(!mostrarDescripcion)}
          className={`w-48 mb-8 flex justify-center items-center px-4 py-3 font-semibold gap-2 rounded-3xl
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
          className={`w-48 mb-8 flex justify-center items-center px-4 py-3 font-semibold gap-2 rounded-3xl
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

      {/* 🗓 Calendario */}
      <div className="mt-8">
        <CalendarioSemanal
          servicio={servicio}
          servicioId={servicio._id}
          disponibilidad={disponibilidad}
          duracionMinutos={servicio.duracionMinutos}
          onSeleccionar={(fecha, hora) => {
            setSeleccion({ fecha, hora });
          }}
        />
      </div>

      {/* ✅ Botón para reservar */}
      {seleccion && (
        <div className="mt-4 text-center">
          <button
            className="bg-[#009929] mb-24 hover:bg-[#006414] text-white px-6 py-3 rounded-3xl shadow"
            onClick={async () => {
              try {
                const res = await fetch(`https://servicios-holisticos-backend.onrender.com/api/bloqueos/temporales`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    servicioId: servicio._id,
                    fecha: seleccion.fecha,
                    hora: seleccion.hora,
                  }),
                });

                const data = await res.json();

                if (res.status === 201 && data.ok) {
                  const clave = `bloqueo_${seleccion.fecha}-${seleccion.hora}`;
                  const expiracion = new Date(data.expiracion).getTime();

                  localStorage.setItem(clave, JSON.stringify({ expiracion }));
                  localStorage.setItem("reservaPendiente", JSON.stringify({ expiracion }));

                  localStorage.setItem("fechaReserva", seleccion.fecha);
                  localStorage.setItem("horaReserva", seleccion.hora);

                  navigate("/pago", {
                    state: {
                      servicio,
                      fecha: seleccion.fecha,
                      hora: seleccion.hora,
                    },
                  });
                } else if (res.status === 409) {
                  alert("⚠️ Ese horario acaba de ser reservado por otra persona. Elegí otro.");
                } else {
                  console.error("Error al bloquear:", data);
                  alert("❌ No se pudo reservar el horario. Intentá más tarde.");
                }
              } catch (err) {
                console.error("❌ Error de red:", err);
                alert("❌ No se pudo conectar con el servidor.");
              }
            }}
          >
            Reservar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default ServicioDetalle;
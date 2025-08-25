import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function PanelTerapeuta() {
  const [terapeuta, setTerapeuta] = useState(null);
  const [misServicios, setMisServicios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [verMas, setVerMas] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [cargóDisponibilidad, setCargóDisponibilidad] = useState(false);
  const [mostrarTodosServicios, setMostrarTodosServicios] = useState(false);
  const [serviciosVistos, setServiciosVistos] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [urlCompartir, setUrlCompartir] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Actualiza servicios editados desde la navegación
  useEffect(() => {
    if (location.state?.servicioEditado) {
      setMisServicios(prev =>
        prev.map(s =>
          s._id === location.state.servicioEditado._id
            ? location.state.servicioEditado
            : s
        )
      );
    }
  }, [location.state]);

  // Cargar servicios vistos desde localStorage
  useEffect(() => {
    const vistosStorage = JSON.parse(localStorage.getItem("serviciosVistos")) || {};
    setServiciosVistos(vistosStorage);
  }, []);

  // Funciones de acción
  const handleVerOnline = (id, slug) => {
    const nuevosVistos = { ...serviciosVistos, [id]: true };
    setServiciosVistos(nuevosVistos);
    localStorage.setItem("serviciosVistos", JSON.stringify(nuevosVistos));
    window.open(`/#/servicios/${slug}`, "_blank");
  };

  const handleEliminarServicio = async (id) => {
    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este servicio?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://servicios-holisticos-backend.onrender.com/api/servicios/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar servicio");

      setMisServicios(data.serviciosActualizados);
      alert("Servicio eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
      alert("No se pudo eliminar el servicio.");
    }
  };

  const handleCompartir = (id, slug) => {
    const slugFinal = slug || "sin-titulo";
    // Apunta al endpoint dinámico de Open Graph
    const url = `https://www.serviciosholisticos.com.ar/share/${slugFinal}`;
    console.log("URL a compartir:", url);
    setUrlCompartir(url);
    setMostrarModal(true);
  };

  // Carga inicial de datos
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchPerfil = async () => {
      try {
        const res = await fetch(
          "https://servicios-holisticos-backend.onrender.com/api/terapeutas/perfil",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTerapeuta(data);
        setMisServicios(data.servicios || []);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        navigate("/login");
      }
    };

    const fetchReservas = async () => {
      try {
        const res = await fetch(
          "https://servicios-holisticos-backend.onrender.com/api/reservas/mis-reservas",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ Error HTTP:", errorData);
          setReservas([]);
          return;
        }
        const data = await res.json();
        setReservas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error al cargar reservas:", err);
        setReservas([]);
      }
    };

    const verificarDisponibilidad = async () => {
      const hoy = new Date();
      const dia = hoy.getDay();
      const inicioSemana = new Date();
      inicioSemana.setDate(hoy.getDate() - ((dia + 6) % 7));
      inicioSemana.setHours(0, 0, 0, 0);
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23, 59, 59, 999);

      try {
        const res = await fetch(
          `https://servicios-holisticos-backend.onrender.com/api/disponibilidad/mis-horarios?desde=${inicioSemana.toISOString()}&hasta=${finSemana.toISOString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setCargóDisponibilidad(Array.isArray(data) && data.length > 0);
      } catch (err) {
        console.error("Error al verificar disponibilidad:", err);
      }
    };

    const obtenerMensajeGlobal = async () => {
      try {
        const res = await fetch(
          "https://servicios-holisticos-backend.onrender.com/api/mensaje-global"
        );
        const data = await res.json();
        if (data.contenido) setMensajeGlobal(data.contenido);
      } catch (err) {
        console.error("❌ Error al obtener comunicado:", err);
      }
    };

    fetchPerfil();
    fetchReservas();
    verificarDisponibilidad();
    obtenerMensajeGlobal();
  }, [navigate, location.state?.refrescar]);

  if (!terapeuta) return <p className="p-6 text-gray-600">Cargando perfil...</p>;

  return (
    <div className="bg-white p-4 pt-24 min-h-screen">
      {mensajeGlobal && (
        <div className="bg-purple-100 text-purple-900 p-3 rounded-md mb-6 text-sm">
          📣 <strong>Comunicado:</strong> {mensajeGlobal}
        </div>
      )}

      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-2xl pt-12 font-bold text-gray-600 mb-4">
          ¡Hola, {terapeuta.nombreCompleto}! 👋
        </h1>
        <p className="text-gray-600 text-base mb-10">¿Qué deseas hacer hoy?</p>

        <div className="flex flex-col gap-4 mb-12">
          <button
            onClick={() => navigate("/nuevo-servicio")}
            className="mx-auto bg-sky-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-sky-500 hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            ➕ Agregar un servicio
          </button>

          {cargóDisponibilidad && (
            <button
              onClick={() => navigate("/disponibilidad")}
              className="w-full bg-indigo-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-indigo-500 hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              🕒 Modificar disponibilidad semanal
            </button>
          )}
        </div>

        {/* Servicios */}
        <div className="text-left mb-12">
          <h2 className="text-xl font-semibold text-[#444] mb-4">🌻 Mis servicios</h2>

          {misServicios.length === 0 ? (
            <p className="text-gray-500 text-md">Aún no cargaste ningún servicio</p>
          ) : (
            <>
              <ul className="space-y-4">
                {(mostrarTodosServicios ? misServicios : misServicios.slice(0, 1)).map(
                  (serv) => {
                    const estaPendiente = !serv.aprobado;

                    const slug =
                      serv.slug ||
                      (serv.titulo
                        ? serv.titulo
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9\-]/g, "")
                            .replace(/^-+|-+$/g, "")
                        : "sin-titulo");

                    console.log("Compartiendo servicio:", serv.titulo, "Slug generado:", slug);
              

                    return (
                      <li
                        key={serv._id}
                        className={`p-4 rounded-xl shadow-sm ${
                          estaPendiente
                            ? "bg-gray-100 text-gray-400"
                            : "bg-[#f9f6ff] text-[#333]"
                        }`}
                      >
                        <p className="text-lg font-semibold">{serv.titulo || "Sin título"}</p>
                        <p className="text-sm text-gray-500 overflow-hidden text-ellipsis line-clamp-2">
                          {serv.descripcion}
                        </p>

                        {estaPendiente && (
                          <div className="text-sm text-gray-500 mt-1">
                            Estamos revisando tu servicio 🕒 Podrás verlo en tu panel una vez aprobado.
                          </div>
                        )}

                        <div className="mt-2">
                          {serv.aprobado && !serviciosVistos[serv._id] && (
                            <div className="text-sm text-green-700 mb-2">
                              ¡Tu servicio fue aprobado! 🎉
                            </div>
                          )}

                          {serv.aprobado && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleVerOnline(serv._id, slug)}
                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                              >
                                Ver
                              </button>

                              <button
                                onClick={() => navigate(`/editar-servicio/${serv._id}`)}
                                className="bg-sky-500 text-white py-1 px-3 rounded hover:bg-sky-600 transition"
                              >
                                Editar
                              </button>

                              <button
                                onClick={() => handleEliminarServicio(serv._id)}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                              >
                                Eliminar
                              </button>

                              <button
                                onClick={() => handleCompartir(serv._id, slug)}
                                className="bg-purple-500 text-white py-1 px-3 rounded hover:bg-purple-600 transition"
                              >
                                Compartir
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  }
                )}
              </ul>

              {misServicios.length > 1 && (
                <button
                  onClick={() => setMostrarTodosServicios(!mostrarTodosServicios)}
                  className="mt-4 text-blue-600 hover:underline text-sm"
                >
                  {mostrarTodosServicios ? "Ver menos servicios ▲" : "Más servicios ▼"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Reservas */}
<h2 className="text-xl text-left font-semibold text-[#444] mt-12 mb-4">📅 Tus reservas</h2>
{reservas.length === 0 ? (
  <p className="text-gray-500 tect-left text-md">Aún no tenes ninguna reserva</p>
) : (
  <>
    <ul className="space-y-4">
      {reservas.slice(0, verMas ? reservas.length : 3).map((reserva) => (
        <li
          key={reserva._id}
          className="p-4 rounded-xl shadow-sm bg-[#f9f6ff] text-[#333]"
        >
          <p>🗓 Fecha: {new Date(reserva.fecha).toLocaleDateString()}</p>
          <p>🕒 Hora: {reserva.hora}</p>
          <p>💆 Servicio: {reserva.servicio}</p>
          <p>👤 Usuario: {reserva.usuario}</p>
          <p>💰 Valor: ${reserva.valor}</p>
          <span className="inline-block mt-2 bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
            Confirmada
          </span>
        </li>
      ))}
    </ul>

    {reservas.length > 3 && (
      <button
        onClick={() => setVerMas(!verMas)}
        className="mt-2 text-blue-600 hover:underline text-sm"
      >
        {verMas ? "Ver menos ▲" : "Ver más ▼"}
      </button>
    )}
  </>
)}

{/* Modal para compartir */}
{mostrarModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">✨ ¡Compartí tu servicio!</h2>
      <p className="text-gray-600 mb-4">
        Compartilo en tus redes sociales para que los usuarios ingresen, 
        vean tus horarios y reserven directamente 🌿
      </p>

      <div className="flex flex-col gap-2">
        <a
          href={`https://wa.me/?text=Mirá este servicio: ${urlCompartir}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          WhatsApp
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${urlCompartir}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Facebook
        </a>

        <a
          href={`https://www.threads.net/intent/post?text=Mirá este servicio 👇 %0A${urlCompartir}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Threads
        </a>

        <button
          onClick={() => {
            navigator.clipboard.writeText(urlCompartir);
            alert("Enlace copiado, ahora podés pegarlo en Instagram (bio, historias, DM) 📲");
          }}
          className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
        >
          Copiar para Instagram
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(urlCompartir);
            alert("Enlace copiado al portapapeles ✅");
          }}
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Copiar enlace
        </button>
      </div>

      <button
        onClick={() => setMostrarModal(false)}
        className="mt-4 text-gray-500 hover:text-gray-700"
      >
        Cerrar
      </button>
    </div>
  </div>
)}

</div> 
</div> // Cierre bg-white
);
}
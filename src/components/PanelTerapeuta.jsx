import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function PanelTerapeuta() {
  const [terapeuta, setTerapeuta] = useState(null);
  const [misServicios, setMisServicios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [cargóDisponibilidad, setCargóDisponibilidad] = useState(false);

  const [mostrarTodasReservas, setMostrarTodasReservas] = useState(false);
  const [mostrarTodosServicios, setMostrarTodosServicios] = useState(false);

  const navigate = useNavigate();

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
  }, [navigate]);

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

          <button
            onClick={() => navigate("/editar-mis-servicios")}
            className="mx-auto bg-green-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-green-500 hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            ✏️ Editar mis servicios
          </button>

          {cargóDisponibilidad && (
            <button
              onClick={() => navigate("/disponibilidad")}
              className="w-full bg-indigo-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-indigo-500 hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              🕒 Modificar disponibilidad semanal
            </button>
          )}

          {/* Botón de perfil público temporalmente oculto */}
          {/* <Link
            to={`/terapeuta/${terapeuta._id}`}
            className="w-full bg-violet-600 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-violet-700 hover:scale-105 transition-transform duration-200 ease-in-out text-center"
          >
            🌐 Ver mi perfil público
          </Link> */}
        </div>

        {/* Servicios */}
        <div className="text-left mb-12">
          <h2 className="text-xl font-semibold text-[#444] mb-4">🧘‍♀️ Tus servicios</h2>
          {misServicios.length === 0 ? (
            <p className="text-gray-500 text-gl">Aún no cargaste ningún servicio</p>
          ) : (
            <>
              <ul className="space-y-4">
                {(mostrarTodosServicios ? misServicios : misServicios.slice(0,1)).map((serv, i) => (
                  <li key={i} className="bg-[#f9f6ff] p-4 rounded-xl shadow-sm">
                    <p className="text-lg text-[#333]">{serv.titulo}</p>
                    <p className="text-sm text-gray-600">{serv.descripcion?.slice(0, 100)}...</p>
                    {serv.estado === "aprobado" && (
                      <Link
                        to={`/servicio/${serv._id}`}
                        className="text-sm mt-1 inline-block text-green-700 hover:underline"
                      >
                        ¡Servicio aprobado! 🎊 Ver online
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {misServicios.length > 1 && (
                <button
                  onClick={() => setMostrarTodosServicios(!mostrarTodosServicios)}
                  className="mt-2 text-sm text-indigo-600 hover:underline"
                >
                  {mostrarTodosServicios ? "Ver menos servicios" : "Ver más servicios"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Reservas */}
        <div className="text-left">
          <h2 className="text-xl font-semibold text-[#444] mb-4">📅 Reservas recibidas</h2>
          {reservas.length === 0 ? (
            <p className="mb-24 text-gray-500">Aún no recibiste reservas</p>
          ) : (
            <>
              <ul className="space-y-4">
                {(mostrarTodasReservas ? reservas : reservas.slice(0,3)).map((r, i) => (
                  <li key={i} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-600">🗓️ {new Date(r.fecha).toLocaleDateString("es-AR")}</p>
                    <p className="text-sm text-gray-600">👤 {r.usuarioNombre}</p>
                    <p className="text-sm text-gray-600">💆 Servicio: {r.servicioTitulo}</p>
                    <p className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                      Confirmada
                    </p>
                  </li>
                ))}
              </ul>

              {reservas.length > 3 && (
                <button
                  onClick={() => setMostrarTodasReservas(!mostrarTodasReservas)}
                  className="mt-2 text-sm text-indigo-600 hover:underline"
                >
                  {mostrarTodasReservas ? "Ver menos reservas" : "Ver más reservas"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
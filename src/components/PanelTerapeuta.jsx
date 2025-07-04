import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PanelTerapeuta() {
  const [terapeuta, setTerapeuta] = useState(null);
  const [misServicios, setMisServicios] = useState([]);
  const [cargóDisponibilidad, setCargóDisponibilidad] = useState(false);
  const navigate = useNavigate();

  // 📆 Mostrar semana siguiente, ej: "7/7 al 13/7"
  const formatearSemanaSiguiente = () => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + (1 - hoy.getDay() + 7)); // próximo lunes
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    // Obtener fecha y hora actual
    const ahora = new Date();
    const esDomingo = ahora.getDay() === 0; // 0 = Domingo
    const esDespuesDe8am = ahora.getHours() >= 8;

    const formato = (fecha) => `${fecha.getDate()}/${fecha.getMonth() + 1}`;
    return `${formato(lunes)} al ${formato(domingo)}`;
  };

  // 📅 Mostrar recordatorio solo los domingos entre las 8:00 y 23:59
  const hoy = new Date();
  const esDomingo = hoy.getDay() === 0;
  const hora = hoy.getHours();
  const mostrarRecordatorio = esDomingo && hora >= 8;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchPerfil = async () => {
      try {
        const res = await fetch(
          "https://servicios-holisticos-backend.onrender.com/api/terapeutas/perfil",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        const hayHorarios = Array.isArray(data) && data.length > 0;

        if (hayHorarios) {
          localStorage.setItem("disponibilidadCargada", "true");
          setCargóDisponibilidad(true);
        } else {
          setCargóDisponibilidad(false);
        }
      } catch (err) {
        console.error("Error al verificar disponibilidad:", err);
      }
    };

    fetchPerfil();
    verificarDisponibilidad();
  }, [navigate]);

  if (!terapeuta) return <p className="p-6 text-gray-600">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-white relative px-4 py-8">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-2xl pt-12 font-bold text-gray-600 mb-4">
          ¡Hola, {terapeuta.nombreCompleto}! 👋
        </h1>
        <p className="text-gray-600 text-base mb-10">¿Qué deseas hacer hoy?</p>

        {/* 🔔 Cartel SOLO si no cargó disponibilidad */}
        {esDomingo && esDespuesDe8am && (
          <div className="bg-pink-50 border-l-4 border-pink-400 text-[#333] p-4 mb-6 rounded-xl shadow text-left">
            <h3 className="text-xl font-semibold mb-2">🗓️ Recordatorio semanal</h3>
            <p className="text-sm">
              Recordá cargar tus horarios disponibles para la semana del <strong>{formatearSemanaSiguiente()}</strong>, desde la sección <strong>“Editar mis servicios”</strong>.
            </p>
          </div>
        )}


        <div className="flex flex-col gap-4 mb-12">
          <button
            onClick={() => navigate("/nuevo-servicio")}
            className="w-full bg-pink-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-pink-500 hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            ➕ Agregar un servicio
          </button>

          <button
            onClick={() => navigate("/editar-mis-servicios")}
            className="w-full bg-teal-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-teal-500 hover:scale-105 transition-transform duration-200 ease-in-out"
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
        </div>

        <div className="text-left">
          <h2 className="text-xl font-semibold text-[#444] mb-4">Tus servicios</h2>
          {misServicios.length === 0 ? (
            <p className="text-gray-500 text-gl">Aún no cargaste ningún servicio</p>
          ) : (
            <ul className="space-y-4">
              {misServicios.map((serv, i) => (
                <li key={i} className="bg-[#f9f6ff] p-4 rounded-xl shadow-sm">
                  <p className="text-lg font-semibold text-[#333]">{serv.titulo}</p>
                  <p className="text-sm text-gray-600">
                    {serv.descripcion?.slice(0, 100)}...
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

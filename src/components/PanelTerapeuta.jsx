import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const [modalEliminar, setModalEliminar] = useState(null);
  const [mensajeAlerta, setMensajeAlerta] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const refrescar = location.state?.refrescar;

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

  const refrescarServicios = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {  
      const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/servicios/mis-servicios", {  
        headers: { Authorization: `Bearer ${token}` }  
      });  
      const data = await res.json();  
      setMisServicios(data || []);  
    } catch (err) {  
      console.error("Error al refrescar servicios:", err);  
    }
  };

  const handleVerOnline = (id, slug) => {
    const nuevosVistos = { ...serviciosVistos, [id]: true };
    setServiciosVistos(nuevosVistos);
    localStorage.setItem("serviciosVistos", JSON.stringify(nuevosVistos));
    window.open(`/#/servicios/${slug}`, "_blank");
  };

  const handleEliminarServicio = async (id) => {
    setModalEliminar(id);
  };

  const confirmarEliminar = async () => {
    const id = modalEliminar;
    if (!id) return;
    const token = localStorage.getItem("token");

    try {
      await fetch(`https://servicios-holisticos-backend.onrender.com/api/servicios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMisServicios(prev => prev.filter(s => s._id !== id));
      setMensajeAlerta("✅ Servicio eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
      setMensajeAlerta("❌ No se pudo eliminar el servicio.");
    } finally {
      setModalEliminar(null);
      setTimeout(() => setMensajeAlerta(null), 4000);
    }
  };

  const handleCompartir = (id, slug) => {
    const slugFinal = slug || "sin-titulo";
    const url = `https://www.serviciosholisticos.com.ar/#/servicios/${slugFinal}`;
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
  }, [navigate, refrescar]);

  if (!terapeuta) return <p className="p-6 text-gray-600">Cargando perfil...</p>;

return (

<div className="bg-white p-6 pt-20 w-full space-y-4">  {mensajeAlerta && (

  <div className="fixed top-20 left-1/2 transform -translate-x-1/2     
                  bg-pink-100 text-[#333] w-full max-w-md px-6 py-3     
                  rounded-lg shadow-md z-50 text-center animate-fade-in">    
    {mensajeAlerta}    
  </div>    
)}  {/* Caja de Comunicado */}    
  {mensajeGlobal && (    
    <div className="bg-gray-100 text-gray-700 p-3 rounded-md text-sm w-full">    
      📣 Comunicado <br /> {mensajeGlobal}    
    </div>    
  )}    {/*
Caja de Comunidad de WhatsApp
<a    
href="https://chat.whatsapp.com/BSB28KdYJnzGomOptIUVi4?mode=ac_t"    
target="_blank"    
rel="noopener noreferrer"    
className="flex items-center bg-[#25D366] text-white p-3 rounded-md shadow-md hover:brightness-110 transition w-full"    
>
<img    
src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png"    
alt="WhatsApp"    
className="h-6 w-6 mr-3 flex-shrink-0"    
/>
<span className="text-base font-medium">
Unite a la Comunidad de terapeutas de Servicios Holísticos 🔮
</span>
</a>
*/}

  <div className="max-w-xl mx-auto text-center">    
    <h1 className="text-2xl pt-12 font-bold text-gray-600 mb-4">    
      ¡Hola, {terapeuta.nombreCompleto}! 👋    
    </h1>    
    <p className="text-gray-600 text-base mb-10">¿Qué deseas hacer hoy?</p>    <div className="flex flex-col gap-4 mb-12">    
    <button    
      onClick={() => navigate("/nuevo-servicio")}    
      className="mx-auto bg-sky-400 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-sky-500 hover:scale-105 transition-transform duration-200 ease-in-out"    
    >    
      ➕ Agregar un servicio    
    </button>

    <button
      onClick={() => window.open(`https://www.serviciosholisticos.com.ar/#/terapeuta/${terapeuta._id}`, "_blank")}
      className="mx-auto bg-green-500 text-white py-3 px-5 rounded-xl font-normal shadow hover:bg-green-600 hover:scale-105 transition-transform duration-200 ease-in-out"
    >
      ✏️ Editar perfil público
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
  <h2 className="text-xl font-normal text-[#333] mb-4">🌻 Mis servicios</h2>    

  {(misServicios || []).length === 0 ? (    
    <p className="text-gray-500 text-md text-center">Aún no cargaste ningún servicio</p>    
  ) : (    
    <>

<ul className="space-y-4">  
        {(mostrarTodosServicios ? misServicios : misServicios.slice(0, 1)).map((serv) => {
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

          const estaRechazado = serv.estado === "rechazado";
          const estaPendiente = !serv.aprobado && !estaRechazado;

          return (
            <li
              key={serv._id}
              className={`p-4 rounded-xl shadow-sm ${
                estaRechazado
                  ? "bg-red-50 text-red-600"
                  : estaPendiente
                  ? "bg-gray-100 text-gray-400"
                  : "bg-[#f9f6ff] text-[#333]"
              }`}
            >
              <p className="text-lg font-normal">{serv.titulo || "Sin título"}</p>
              <p className="text-sm text-gray-500 overflow-hidden text-ellipsis line-clamp-2">
                {serv.descripcion}
              </p>

              {/* Servicio Pendiente */}
              {estaPendiente && (
                <div className="text-sm text-gray-500 mt-1">
                  Estamos revisando tu servicio 🕒 Podrás verlo en tu panel una vez aprobado.
                </div>
              )}

              {/* Servicio Aprobado */}
              {serv.aprobado && !estaRechazado && (
                <div className="mt-2">
                  {!serviciosVistos[serv._id] && (
                    <div className="text-sm text-green-700 mb-2">¡Tu servicio fue aprobado! 🎉</div>
                  )} 
                  
        <div className="flex justify-center gap-5">  
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
        </div>  
      </div>  
    )}  
  </li>  
);

})}

</ul>  {misServicios.length > 1 && (
<button
onClick={() => setMostrarTodosServicios(!mostrarTodosServicios)}
className="mt-4 text-blue-600 hover:underline text-sm"

> 

{mostrarTodosServicios ? "Ver menos ▲" : "Más servicios ▼"}

  </button>  
)}  </>
)}  </div>  {/* --- RESERVAS (ocultas por ahora) --- */}

{false && (
<>

<h2 className="text-xl text-left font-normal text-[#333] mt-12 mb-4">  
📅 Mis reservas  
</h2>  {(reservas || []).length === 0 ? (

  <p className="text-gray-500 text-left text-md">Aún no tenes ninguna reserva</p>    
) : (    
  <>    
    <ul className="space-y-4">    
      {(reservas || [])    
        .slice(0, verMas ? reservas.length : 3)    
        .map((reserva) => (    
          <li    
            key={reserva._id}    
            className="p-4 rounded-xl shadow-sm bg-[#f9f6ff] text-[#333]"    
          >    
            <p>🗓 Fecha: {new Date(reserva.fecha).toLocaleDateString()}</p>    
            <p>🕒 Hora: {reserva.hora}</p>    
            <p>💆 Servicio: {reserva.servicioId?.titulo || reserva.nombreServicio}</p>    
            <p>👤 Usuario: {reserva.nombreUsuario}</p>    
            <p>💰 Valor: ${reserva.precio}</p>    
            <span className="inline-block mt-2 bg-green-100 text-green-700 px-2 py-1 rounded text-sm">    
              {reserva.estado || "Confirmada"}    
            </span>    
          </li>    
        ))}    
    </ul>    {(reservas || []).length > 3 && (    
  <button    
    onClick={() => setVerMas(!verMas)}    
    className="mt-2 text-blue-600 hover:underline text-sm"    
  >    
    {verMas ? "Ver menos ▲" : "Ver más ▼"}    
  </button>    
)}

</>
)}

</>
)}

{modalEliminar && (

  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">    
    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg text-center">    
      <p className="text-[#333] text-lg mb-4">    
        ❓ ¿Estás seguro que deseas eliminar este servicio?    
      </p>    
      <div className="flex justify-center gap-4">    
        <button    
          onClick={confirmarEliminar}    
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"    
        >    
          Sí, eliminar    
        </button>    
        <button    
          onClick={() => setModalEliminar(null)}    
          className="bg-gray-300 text-[#333] px-4 py-2 rounded hover:bg-gray-400"    
        >    
          Cancelar    
        </button>    
      </div>    
    </div>    
  </div>    
)}  </div>    
    </div>    
    );  }
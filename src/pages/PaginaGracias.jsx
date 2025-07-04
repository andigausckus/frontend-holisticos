import React, { useEffect, useState } from "react"; import { Link } from "react-router-dom";

function Gracias() { const [servicio, setServicio] = useState(null); const [fecha, setFecha] = useState(""); const [hora, setHora] = useState(""); const [nombreUsuario, setNombreUsuario] = useState("");

useEffect(() => { const datosGuardados = localStorage.getItem("datosTerapeuta"); const fechaGuardada = localStorage.getItem("fechaReserva"); const horaGuardada = localStorage.getItem("horaReserva"); const nombre = localStorage.getItem("nombreUsuario");

if (fechaGuardada) setFecha(fechaGuardada);
if (horaGuardada) setHora(horaGuardada);
if (nombre) setNombreUsuario(nombre);

if (datosGuardados) {
  const servicio = JSON.parse(datosGuardados);
  setServicio(servicio);

  if (servicio?.terapeuta?._id) {
    fetch(
      `https://servicios-holisticos-backend.onrender.com/api/terapeutas/publico/${servicio.terapeuta._id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setServicio((prev) => ({ ...prev, terapeutaCompleto: data }));
      })
      .catch((err) => console.error("❌ Error al obtener terapeuta completo:", err));
  }
}

}, []);

const mensaje = `Hola ${nombreUsuario}, te escribo respecto a la sesión "${servicio?.titulo}" que tengo agendada el ${new Date(fecha).toLocaleDateString("es-AR")} a las ${hora}. ¡Gracias y quedo atent@ a cualquier detalle!`;

const urlWhatsApp = servicio?.terapeutaCompleto?.whatsapp
  ? `https://wa.me/549${servicio.terapeutaCompleto.whatsapp}?text=${encodeURIComponent(mensaje)}`
  : null;

return ( <div className="pt-12 pb-20 px-6 max-w-xl mx-auto text-center text-[#333] bg-white min-h-screen"> <h1 className="text-2xl font-bold mb-4">¡Gracias por tu reserva! 🌟</h1> <p className="mb-4"> Tu pago fue procesado con éxito. El terapeuta ya fue notificado de tu sesión. </p> <p className="mb-4"> Si aún no lo hiciste, podés contactarlo directamente para confirmar cualquier detalle previo a la sesión. </p> <p className="mb-6"> También te enviamos un email con la confirmación de tu reserva y los datos del terapeuta. Revisá tu bandeja de entrada 📩 </p>

{servicio?.terapeutaCompleto && (
    <div className="bg-gray-100 rounded-xl p-5 mb-6 text-left text-sm">
      <h2 className="text-lg font-semibold mb-2">Datos del terapeuta:</h2>
      <p>
        <span className="text-pink-500 underline decoration-[1px] underline-offset-4">Nombre</span><br />
        {servicio.terapeutaCompleto.nombreCompleto || "No disponible"}
      </p>
      <p className="mt-3">
        <span className="text-pink-500 underline decoration-[1px] underline-offset-4">Email</span><br />
        {servicio.terapeutaCompleto.email || "No disponible"}
      </p>
      <p className="mt-3">
        <span className="text-pink-500 underline decoration-[1px] underline-offset-4">WhatsApp</span><br />
        {urlWhatsApp ? (
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 font-medium hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-green-600" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.88 11.88 0 0012 0a12 12 0 00-10.3 17.85L0 24l6.37-1.67A12 12 0 0012 24a12 12 0 008.49-20.52zM12 22a9.94 9.94 0 01-5.1-1.4l-.36-.21-3.78 1 1-3.67-.24-.38a10 10 0 1118.48-5.12A10 10 0 0112 22zm5.18-7.81c-.28-.14-1.64-.8-1.9-.89s-.44-.14-.63.14-.72.89-.88 1.07-.33.21-.61.07a8.13 8.13 0 01-2.4-1.48 9 9 0 01-1.67-2.06c-.17-.29 0-.44.13-.58s.29-.33.44-.5a1.88 1.88 0 00.29-.48 0.55 0.55 0 000-.5c-.07-.14-.63-1.52-.86-2.09s-.44-.48-.61-.48-.33 0-.51 0a1 1 0 00-.71.33 3 3 0 00-.95 2.18A5.2 5.2 0 0010 14.7a12.18 12.18 0 005.9 1.73 4.92 4.92 0 003.14-1.12 2 2 0 00.65-1.47 1.9 1.9 0 00-1.51-1.65z" />
            </svg>
            Escribir por WhatsApp
          </a>
        ) : (
          <span className="text-gray-500">No disponible</span>
        )}
      </p>
    </div>
  )}

  <p className="mb-6">
    Ante cualquier duda, podés escribirnos desde el {" "}
    <Link to="/contacto" className="text-[#009EE3] underline">
      formulario de contacto
    </Link>.
  </p>

  <Link
    to="/"
    className="inline-block mt-4 bg-pink-500 text-white py-2 px-6 rounded-3xl hover:bg-pink-600 transition"
  >
    Volver al inicio
  </Link>
</div>

); }

export default Gracias;


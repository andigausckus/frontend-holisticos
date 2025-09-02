import React, { useState, useEffect } from "react";

const CalendarioSemanal = ({ disponibilidad, duracionMinutos, onSeleccionar, servicio, userId }) => {
const [dias, setDias] = useState([]);
const [bloqueos, setBloqueos] = useState({});
const [reservas, setReservas] = useState({});
const [tiemposRestantes, setTiemposRestantes] = useState({});
const [seleccion, setSeleccion] = useState(null);
const [lunes, setLunes] = useState(null);
const [domingo, setDomingo] = useState(null);

const formatearFecha = (fecha) => {
  return `${fecha.getDate()} de ${fecha.toLocaleDateString("es-AR", { month: 'long' })}`;
};

useEffect(() => {
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado  
const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana;  

const lunes = new Date(hoy);  
lunes.setDate(hoy.getDate() + diferencia);  

const nuevosDias = [];  

for (let i = 0; i < 7; i++) {  
  const fecha = new Date(lunes.getTime());  
  fecha.setDate(lunes.getDate() + i);  
  const fechaFormateada =  
    fecha.getFullYear() +  
    "-" +  
    String(fecha.getMonth() + 1).padStart(2, "0") +  
    "-" +  
    String(fecha.getDate()).padStart(2, "0");  
  nuevosDias.push(fechaFormateada);  
}  

console.log("DÍAS CALCULADOS:", nuevosDias);  
setDias(nuevosDias);

}, []);

useEffect(() => {
const calcularSemana = () => {
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado  
  const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana;  

  const lunesActual = new Date(hoy);  
  lunesActual.setDate(hoy.getDate() + diferencia);  

  const domingoActual = new Date(lunesActual);  
  domingoActual.setDate(lunesActual.getDate() + 6);  

  setLunes(lunesActual);  
  setDomingo(domingoActual);  
};  

calcularSemana();  

const intervalo = setInterval(() => {  
  const ahora = new Date();  
  if (ahora.getDay() === 0 && ahora.getHours() === 23 && ahora.getMinutes() === 59 && ahora.getSeconds() === 59) {  
    calcularSemana();  
  }  
}, 1000);  

return () => clearInterval(intervalo);

}, []);

useEffect(() => {
const fetchData = async () => {
try {
const inicio = dias[0];
const fin = dias[dias.length - 1];

if (!servicio || !servicio._id || !inicio || !fin) return;  

    console.log(`Cargando bloqueos y reservas para servicio: ${servicio._id} desde ${inicio} hasta ${fin}`);  

    const res = await fetch(  
      `${process.env.REACT_APP_BACKEND_URL}/reservas/estado-actual/${servicio._id}?inicio=${inicio}&fin=${fin}`  
    );  

    const data = await res.json();  

    console.log(" Respuesta RAW:", JSON.stringify(data));  
    console.log(" RESERVAS:");  
    console.log(data.reservas);  
    console.log(" BLOQUEOS:");  
    console.log(data.bloqueos);  

    if (data && data.reservas && data.bloqueos) {  
      const clavesReservas = Object.keys(data.reservas);  
      console.log("Claves válidas reservas: \nArray", clavesReservas);  

      setReservas(data.reservas);  
      setBloqueos(data.bloqueos);  
      console.log(" reservas cargadas: \nObject", data.reservas);  
      console.log(" bloqueos cargados: \nObject", data.bloqueos);  
    } else {  
      console.error(" Error: respuesta incompleta del servidor");  
    }  
  } catch (error) {  
    console.error(" Error al obtener bloqueos + reservas:", error);  
  }  
};  

fetchData();  

const intervalo = setInterval(() => {  
  fetchData();  
}, 5000);  

return () => clearInterval(intervalo);

}, [dias, servicio]);

const obtenerHorarios = (fecha) => {
const fechaISO = fecha;
const dia = disponibilidad.find((d) => d.fecha === fechaISO);
return dia?.horariosFijos || [];
};

  const formatearHora = (horaStr) => {
    if (!horaStr || typeof horaStr !== "string" || !horaStr.includes(":")) return "--:--";
    const [h, m] = horaStr.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

const formatearDiaCorto = (fecha) => {
return new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", { weekday: "short" }).toUpperCase();
};

console.log("🟡 DÍAS RENDERIZADOS EN EL FRONTEND:", dias);

return (  
      <div className="mb-24">  
        {lunes && domingo && (  
          <div className="border border-gray-300 rounded-3xl p-2 mb-4 shadow-sm">  
            <div className="text-[#444444] text-center text-gl font-normal">  
              Semana del {lunes.getDate()} al {domingo.getDate()} de {lunes.toLocaleDateString("es-AR", { month: 'long' })}  
            </div>  
          </div>  
        )}  
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 w-full">  
          {dias.map((dia, index) => {  
            const horarios = obtenerHorarios(dia);  

      return (  
        <div key={index}>  
          <div className="bg-gray-50 rounded-xl p-2 text-center shadow">  
            <div className="font-semibold text-sm text-[#333] mb-1">  
              {formatearDiaCorto(dia)}  
            </div>  
            <div className="text-xs text-gray-500 mb-2">  
              {new Date(dia + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long" })}  
            </div>  
            {horarios.length > 0 ? (  
              <div className="grid gap-2">  
              
              {horarios.map((horario, idx) => {
  const [h, m] = horario.desde.trim().split(":");
  const horaFormateada = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  const key = `${dia}-${horaFormateada}`;

  let estado = "disponible";
  let disabled = false;
  let bg = "";
  let label = "";

  // Validaciones bloqueos y reservas
  if (bloqueos[key]) {
    estado = "en_proceso";
    disabled = true;
  } else if (reservas[key]) {
    const estadoReserva = reservas[key].estado;
    if (estadoReserva === "confirmada") {
      if (reservas[key].userId === userId) {
        estado = "reservado_usuario_actual";
      } else {
        estado = "reservado";
      }
      disabled = true;
    }
  }

  // Si este horario es el seleccionado
  const esSeleccionado = seleccion === key;

  if (esSeleccionado) {
    bg = "bg-green-500 text-white";
    label = "Seleccionado";
  } else {
    switch (estado) {
      case "disponible":
        bg = "bg-green-100 hover:bg-green-400 text-green-800";
        label = "Disponible";
        break;
      case "en_proceso":
        bg = "bg-yellow-100 text-yellow-800";
        label = "En proceso de reserva ⌛ Volvé en unos minutos.";
        break;
      case "reservado_usuario_actual":
      case "reservado":
      default:
        bg = "bg-gray-200 text-gray-500";
        label = "Reservado";
        break;
    }
  }

  return (
    <button
      key={idx}
      className={`text-sm px-2 py-2 rounded-xl font-medium text-center transition ${bg}`}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        if (!horario?.desde || horario.desde === "--:--") {
          alert("Este horario no tiene una hora válida.");
          return;
        }

        setSeleccion(key); // 👈 marca este horario como seleccionado
        onSeleccionar(dia, horario.desde);
      }}
    >
      {`${formatearHora(horario.desde)} - ${formatearHora(horario.hasta)}`}
      <span className="block text-xs mt-1 font-normal">{label}</span>
    </button>
  );
})}    
                      
              </div>  
            ) : (  
              <div className="mt-2 px-2 py-2 bg-red-100 text-red-800 rounded-xl text-xs text-center font-semibold">  
                No atiende  
              </div>  
            )}  
          </div>  
        </div>  
      );  
    })}  
  </div>  
</div>

);
};

export default CalendarioSemanal;
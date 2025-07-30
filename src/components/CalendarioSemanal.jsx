import React, { useState, useEffect } from "react";

const CalendarioSemanal = ({ disponibilidad, duracionMinutos, onSeleccionar, servicio, userId }) => {
  const [dias, setDias] = useState([]);
  const [bloqueos, setBloqueos] = useState({});
  const [reservas, setReservas] = useState({});
  const [tiemposRestantes, setTiemposRestantes] = useState({});
  const [seleccion, setSeleccion] = useState(null);

  useEffect(() => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1));
    const nuevosDias = [];

    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      nuevosDias.push(fecha.toISOString().split("T")[0]);
    }

    setDias(nuevosDias);
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
          console.log("reservas cargadas: \nObject", data.reservas);
          console.log("bloqueos cargados: \nObject", data.bloqueos);
        } else {
          console.error(" Error: respuesta incompleta del servidor");
        }
      } catch (error) {
        console.error("Error al obtener bloqueos + reservas: \nReferenceError {}", error);
      }
    };

    fetchData();
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
    return new Date(fecha).toLocaleDateString("es-AR", { weekday: "short" }).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 w-full">
      {dias.map((dia, index) => {
        const horarios = obtenerHorarios(dia);
        return (
          <div key={index} className="bg-gray-50 rounded-xl p-2 text-center shadow">
            <div className="font-semibold text-sm text-[#333] mb-1">
              {formatearDiaCorto(dia)}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {new Date(dia).toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
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
                  console.log("Horario:", key, "| Estado:", estado);

                  switch (estado) {
                    case "disponible":
                      bg = "bg-green-100 hover:bg-green-200 text-green-800";
                      label = "Disponible";
                      break;
                    case "en_proceso":
                      bg = "bg-yellow-100 text-yellow-800";
                      label = "En proceso de reserva. Volvé en unos minutos.";
                      break;
                    case "reservado_usuario_actual":
                    case "reservado":
                    default:
                      bg = "bg-gray-200 text-gray-500";
                      label = "Reservado";
                      break;
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

                        setSeleccion(key);
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
        );
      })}
    </div>
  );
};

export default CalendarioSemanal;
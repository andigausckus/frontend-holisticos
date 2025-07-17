import { useEffect, useState } from "react";

function obtenerSemana(fechaActual) {
  const hoy = new Date(fechaActual);
  const diaSemana = hoy.getDay();
  const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diferencia);
  lunes.setHours(0, 0, 0, 0);

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    dias.push(fecha);
  }

  return dias;
}

function formatearHora(horaStr) {
  if (!horaStr || typeof horaStr !== "string" || !horaStr.includes(":")) return "--:--";
  const [h, m] = horaStr.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

function formatearDiaCorto(fecha) {
  return fecha.toLocaleDateString("es-AR", { weekday: "short" }).toUpperCase();
}

const CalendarioSemanal = ({ disponibilidad, duracionMinutos, onSeleccionar, servicio, userId }) => { 
  const [dias, setDias] = useState([]);
  const [seleccion, setSeleccion] = useState(null);
  const [tiemposRestantes, setTiemposRestantes] = useState({});
  const [bloqueos, setBloqueos] = useState({});
  const [reservas, setReservas] = useState({});

  useEffect(() => {
    const hoy = new Date();
    const semanaActual = obtenerSemana(hoy);
    setDias(semanaActual);
  }, []);

  useEffect(() => {
    if (!servicio?._id || dias.length === 0) return;

    const desde = dias[0].toISOString().split("T")[0];
    const hasta = dias[6].toISOString().split("T")[0];

    fetch(`https://servicios-holisticos-backend.onrender.com/api/bloqueos/todos?servicioId=${servicio._id}&desde=${desde}&hasta=${hasta}`)
      .then(response => response.json())
      .then(data => {
        const confirmados = {};
        const temporales = {};

        (data.reservas || []).forEach((r) => {
          confirmados[`${r.fecha}-${r.hora}`] = true;
        });

        (data.bloqueos || []).forEach((r) => {
          temporales[`${r.fecha}-${r.hora}`] = true;
        });

        setReservas(confirmados);
        setBloqueos(temporales);
      })
      .catch((err) => console.error("Error al obtener reservas:", err));
  }, [servicio, dias]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (!servicio?._id || dias.length === 0) return;

      const desde = dias[0].toISOString().split("T")[0];
      const hasta = dias[6].toISOString().split("T")[0];

      fetch(`https://servicios-holisticos-backend.onrender.com/api/bloqueos/todos?servicioId=${servicio._id}&desde=${desde}&hasta=${hasta}`)
        .then(res => res.json())
        .then(data => {
          const nuevosBloqueos = {};
          const nuevosTiempos = {};
          const nuevosReservas = {};
          const ahora = new Date();

          (data.reservas || []).forEach((r) => {
            nuevosReservas[`${r.fecha}-${r.hora}`] = {
              userId: r.userId,
              estado: 'reservado'
            };
          });

          (data.bloqueos || []).forEach((b) => {
            const key = `${b.fecha}-${b.hora}`;
            nuevosBloqueos[key] = true;

            const expiracion = new Date(b.expiracion).getTime();
            const segundosRestantes = Math.floor((expiracion - ahora.getTime()) / 1000);
            nuevosTiempos[key] = segundosRestantes;
          });

          setBloqueos(nuevosBloqueos);
          setTiemposRestantes(nuevosTiempos);
          setReservas(nuevosReservas);
        })
        .catch((err) => {
          console.error("❌ Error al obtener bloqueos + reservas:", err);
        });
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [servicio, dias]);

  const obtenerHorarios = (fecha) => {
    const fechaISO = fecha.toISOString().split("T")[0];
    const dia = disponibilidad.find((d) => d.fecha === fechaISO);
    return dia?.horariosFijos || [];
  };

  const fechaInicio = dias.length > 0 ? dias[0] : null;
  const fechaFin = dias.length > 0 ? dias[6] : null;

  if (!fechaInicio || !fechaFin) {
    return <p className="text-center text-gray-500">Cargando semana...</p>;
  }

  return (
    <div className="bg-white mt-8 px-4">
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        {dias.every((dia) => obtenerHorarios(dia).length === 0) && (
          <div className="text-center text-sm text-gray-600 mb-4">
            🕒 <span className="text-[#444444] font-medium">
              El terapeuta aún no cargó horarios para esta semana.
            </span>
            <br />
            Volvé en unas horas o más tarde durante el día para ver su disponibilidad.
          </div>
        )}
      </div>

      <h3 className="text-center font-medium text-[#333] mb-4">
        Semana del {fechaInicio.toLocaleDateString("es-AR", { day: "numeric", month: "long" })} al{" "}
        {fechaFin.toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 w-full">
        {dias.map((dia, index) => {
          const fechaISO = dia.toISOString().split("T")[0];
          const horarios = obtenerHorarios(dia);

          return (
            <div key={index} className="bg-gray-50 rounded-xl p-2 text-center shadow">
              <div className="font-semibold text-sm text-[#333] mb-1">
                {formatearDiaCorto(dia)}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {dia.toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
              </div>

              {horarios.length > 0 ? (
                <div className="grid gap-2">
                  {horarios.map((horario, idx) => {
                    const key = `${fechaISO}-${horario.desde}`;
                    let estado = "disponible";
                    let disabled = false;
                    let bg = "";
                    let label = "";

                  if (reservas[key]) {
                    if (reservas[key].userId === userId) {
                      estado = "reservado_usuario_actual";
                    } else {
                      estado = "reservado";
                    }
                    disabled = true;
                  } else if (bloqueos[key]) {
                    estado = "en_proceso";
                    disabled = true;
                  }

                  switch (estado) {
  case "disponible":
    bg = "bg-green-100 hover:bg-green-200 text-green-800";
    label = "Disponible";
    break;
  case "en_proceso":
    bg = "bg-yellow-100 text-yellow-800";
    label = "En proceso de reserva";
    break;
  case "reservado_usuario_actual":
    bg = "bg-gray-200 text-gray-500";
    label = "Reservado por vos";
    break;
  case "reservado":
    bg = "bg-gray-200 text-gray-500";
    label = "Reservado";
    break;
  default:
    bg = "bg-gray-200 text-gray-500";
    label = "No disponible";
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
                            alert("⚠️ Este horario no tiene una hora válida.");
                            return;
                          }

                          setSeleccion(key);
                          onSeleccionar(fechaISO, horario.desde);
                        }}
                      >
                        {horario?.desde && horario?.hasta
                          ? `${formatearHora(horario.desde)} - ${formatearHora(horario.hasta)}`
                          : "⏳ Hora inválida"}

                        {estado === "en_proceso" && tiemposRestantes[key] > 0 && reservas[key]?.userId !== userId && (
                          <div className="flex items-center justify-center mt-1 gap-2 text-xs">
                            <div className="w-5 h-5 rounded-full border border-yellow-600 flex items-center justify-center font-mono text-[11px]">
                              {Math.floor((tiemposRestantes[key] || 0) / 60)}:
                              {(tiemposRestantes[key] % 60 || 0).toString().padStart(2, "0")}
                            </div>
                            <span className="text-yellow-700">
                              Volvé en ese tiempo para comprobar disponibilidad
                            </span>
                          </div>
                        )}

                        {estado !== "en_proceso" && (
                          <span className="block text-xs mt-1 font-normal">{label}</span>
                        )}
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
    </div>
  );
};

export default CalendarioSemanal;
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

const CalendarioSemanal = ({ disponibilidad, duracionMinutos, onSeleccionar, servicio }) => {
  const [dias, setDias] = useState([]);
  const [seleccion, setSeleccion] = useState(null);

  useEffect(() => {
    const hoy = new Date();
    const semanaActual = obtenerSemana(hoy);
    setDias(semanaActual);
  }, []);

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
                    const disabled = horario.estado !== "disponible";
                    const bg = disabled
                      ? "bg-gray-200 text-gray-500"
                      : "bg-green-100 hover:bg-green-200 text-green-800";
                    const label =
                      horario.estado === "reservado"
                        ? "Reservado"
                        : horario.estado === "no_disponible"
                        ? "No disponible"
                        : "";

                    return (
                      <button
                        key={idx}
                        className={`text-sm px-2 py-2 rounded-xl font-medium text-center transition ${bg}`}
                        disabled={disabled}
                        onClick={() => {
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
                        {label && (
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
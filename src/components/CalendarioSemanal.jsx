import { useEffect, useState } from "react";

function obtenerSemana(fechaActual) {
  const hoy = new Date(fechaActual);
  const diaSemana = hoy.getDay(); // 0 (domingo) a 6 (sábado)
  const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana; // si es domingo, restar 6
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
  const [h, m] = horaStr.split(":");
  return `${h}:${m}`;
}

function formatearDiaCorto(fecha) {
  return fecha.toLocaleDateString("es-AR", { weekday: "short" }).toUpperCase();
}

const CalendarioSemanal = ({ disponibilidad, duracionMinutos, onSeleccionar }) => {
  const [dias, setDias] = useState([]);
  const [seleccion, setSeleccion] = useState(null);
  const [mostrarSiguiente, setMostrarSiguiente] = useState(false);
  const [mostrarAnterior, setMostrarAnterior] = useState(false);

  useEffect(() => {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const esDomingo = diaSemana === 0;

    const fechaBase = esDomingo || mostrarSiguiente
      ? new Date(hoy.setDate(hoy.getDate() + (8 - diaSemana)))
      : hoy;

    const semana = obtenerSemana(fechaBase);
    setDias(semana);
  }, [mostrarSiguiente]);

  const obtenerRangos = (fecha) => {
    const fechaISO = fecha.toISOString().split("T")[0];
    const dia = disponibilidad.find((d) => d.fecha === fechaISO);
    return dia ? dia.rangos : [];
  };

  const fechaInicio = dias.length > 0 ? dias[0] : null;
  const fechaFin = dias.length > 0 ? dias[6] : null;

  if (!fechaInicio || !fechaFin) {
    return <p className="text-center text-gray-500">Cargando semana...</p>;
  }

  return (
    <div className="mt-8">
      {/* 🔁 Botones para cambiar semana */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        {!mostrarSiguiente && (
          <button
            className="text-violet-600 underline text-sm sm:text-base hover:text-violet-800 transition"
            onClick={() => {
              setMostrarSiguiente(true);
              setMostrarAnterior(true);
            }}
          >
            Semana siguiente
          </button>
        )}

        {mostrarAnterior && (
          <button
            className="text-violet-600 underline text-sm sm:text-base hover:text-violet-800 transition"
            onClick={() => {
              setMostrarSiguiente(false);
              setMostrarAnterior(false);
            }}
          >
            Semana anterior
          </button>
        )}
      </div>

      <h3 className="text-center font-medium text-[#333] mb-4">
        Semana del{" "}
        {fechaInicio.toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
        })}{" "}
        al{" "}
        {fechaFin.toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
        })}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {dias.map((dia, index) => {
          const fechaISO = dia.toISOString().split("T")[0];
          const rangos = obtenerRangos(dia);

          return (
            <div key={index} className="bg-white p-3 rounded-2xl shadow border">
              <p className="text-sm font-semibold text-center text-[#333] capitalize">
                {formatearDiaCorto(dia)}
              </p>
              <p className="text-xs text-center text-gray-500 -mt-1">
                {dia.getDate()} de {dia.toLocaleDateString("es-AR", { month: "long" })}
              </p>

              {rangos.length > 0 ? (
                <div className="mt-2 flex flex-col gap-1">
                  {rangos.map((rango, idx) => {
                    const key = `${fechaISO}-${rango.desde}`;
                    const estaSeleccionado = seleccion === key;

                    return (
                      <button
                        key={idx}
                        className={`text-sm px-2 py-1 rounded-lg ${
                          estaSeleccionado
                            ? "bg-[#009929] text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          setSeleccion(key);
                          onSeleccionar(fechaISO, rango.desde);
                        }}
                      >
                        {formatearHora(rango.desde)} - {formatearHora(rango.hasta)}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-center text-gray-400 mt-2">Sin horarios</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarioSemanal;
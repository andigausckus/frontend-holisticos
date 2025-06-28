import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function obtenerSemana(fechaActual) {
  const inicioSemana = new Date(fechaActual);
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay() + 1); // Lunes

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(inicioSemana);
    fecha.setDate(fecha.getDate() + i);
    dias.push(fecha);
  }
  return dias;
}

function formatearFechaCompleta(fecha) {
  const opciones = { weekday: "long", day: "numeric", month: "long" };
  return fecha.toLocaleDateString("es-AR", opciones);
}

function formatearDiaCorto(fecha) {
  return fecha.toLocaleDateString("es-AR", { weekday: "short" }).toUpperCase();
}

function formatearDiaNumero(fecha) {
  return fecha.getDate();
}

const CalendarioSemanal = ({ disponibilidad, duracionMinutos, onSeleccionar }) => {
  const [semanaActual, setSemanaActual] = useState(new Date());
  const [dias, setDias] = useState([]);
  const [seleccion, setSeleccion] = useState(null);

  useEffect(() => {
    const nuevaSemana = obtenerSemana(semanaActual);
    console.log("📅 Días calculados para la semana:", nuevaSemana);
    setDias(nuevaSemana);
  }, [semanaActual]);

  const avanzarSemana = () => {
    const nuevaFecha = new Date(semanaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    setSemanaActual(nuevaFecha);
  };

  const retrocederSemana = () => {
    const nuevaFecha = new Date(semanaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    setSemanaActual(nuevaFecha);
  };

  const estaDisponible = (fecha) => {
    const fechaISO = fecha.toISOString().split("T")[0];
    return disponibilidad.find(d => d.fecha === fechaISO);
  };

  const obtenerRangos = (fecha) => {
    const fechaISO = fecha.toISOString().split("T")[0];
    const dia = disponibilidad.find(d => d.fecha === fechaISO);
    return dia ? dia.rangos : [];
  };

  const formatearHora = (horaStr) => {
    const [h, m] = horaStr.split(":");
    return `${h}:${m}`;
  };

  // 🧩 Verificar que `dias` tenga datos
  const fechaInicio = dias.length > 0 ? dias[0] : null;
  const fechaFin = dias.length > 0 ? dias[6] : null;

  console.log("🔍 Inicio de semana:", fechaInicio, "Fin:", fechaFin);
  console.log("🧩 Disponibilidad recibida:", disponibilidad);

  if (!fechaInicio || !fechaFin) {
    return <p className="text-center text-gray-500">Cargando semana...</p>;
  }

  return (
    <div className="mt-8">
      {/* Botones de semana */}
      <div className="flex justify-between items-center mb-2">
        <button
          className="text-sm bg-gray-100 px-3 py-2 rounded-xl shadow hover:bg-gray-200"
          onClick={retrocederSemana}
        >
          <FaArrowLeft className="inline mr-1" /> Semana anterior
        </button>
        <button
          className="text-sm bg-gray-100 px-3 py-2 rounded-xl shadow hover:bg-gray-200"
          onClick={avanzarSemana}
        >
          Semana siguiente <FaArrowRight className="inline ml-1" />
        </button>
      </div>

      {/* Texto de rango de semana */}
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

      {/* Días de la semana */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {dias.map((dia, index) => {
          const fechaISO = dia.toISOString().split("T")[0];
          const rangos = obtenerRangos(dia);

          return (
            <div
              key={index}
              className="bg-white p-3 rounded-2xl shadow border"
            >
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
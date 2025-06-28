import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function obtenerFechasDeSemana() {
  const hoy = dayjs();
  const inicioSemana = hoy.startOf("week").add(1, "day"); // Lunes
  return diasSemana.map((dia, index) => {
    const fecha = inicioSemana.add(index, "day");
    return {
      dia,
      fecha: fecha.format("D [de] MMMM"),
      rangos: [],
    };
  });
}

export default function DisponibilidadServicio() {
  const { servicioId } = useParams();
  const navigate = useNavigate();

  const [disponibilidad, setDisponibilidad] = useState([]);

  useEffect(() => {
    setDisponibilidad(obtenerFechasDeSemana());
  }, []);

  const agregarRango = (dia) => {
    setDisponibilidad((prev) =>
      prev.map((d) =>
        d.dia === dia
          ? { ...d, rangos: [...d.rangos, { desde: null, hasta: null }] }
          : d
      )
    );
  };

  const actualizarRango = (dia, index, campo, valor) => {
    setDisponibilidad((prev) =>
      prev.map((d) => {
        if (d.dia !== dia) return d;
        const nuevosRangos = [...d.rangos];
        nuevosRangos[index][campo] = valor;
        return { ...d, rangos: nuevosRangos };
      })
    );
  };

  const eliminarRango = (dia, index) => {
    setDisponibilidad((prev) =>
      prev.map((d) => {
        if (d.dia !== dia) return d;
        const nuevosRangos = d.rangos.filter((_, i) => i !== index);
        return { ...d, rangos: nuevosRangos };
      })
    );
  };

  const aplicarATodaLaSemana = (diaReferencia) => {
    const referencia = disponibilidad.find((d) => d.dia === diaReferencia);
    if (!referencia || referencia.rangos.length === 0) return;
    setDisponibilidad((prev) =>
      prev.map((d) => ({
        ...d,
        rangos: [...referencia.rangos],
      }))
    );
  };

  const handleGuardar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para guardar.");
      return;
    }

    try {
      const res = await fetch(
        `https://servicios-holisticos-backend.onrender.com/api/terapeutas/disponibilidad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ disponibilidad }),
        }
      );

      if (!res.ok) throw new Error("Error al guardar la disponibilidad");
      alert("Disponibilidad guardada con éxito");
      navigate("/panel");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center text-[#333] mb-10">
        Agregá tu disponibilidad semanal 🌿
      </h2>

      {disponibilidad.map((dia, index) => (
        <div key={dia.dia} className="mb-4 border-b pb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base text-[#444]">
              {dia.dia} <span className="text-sm text-[#666]">{dia.fecha}</span>
            </h3>
            <div className="bg-pink-300 rounded-3xl px-4 py-1 hover:bg-pink-400 transition">
              <button
                type="button"
                onClick={() => agregarRango(dia.dia)}
                className="text-white text-sm"
              >
                + Agregar horario
              </button>
            </div>
          </div>

          {dia.rangos.map((rango, i) => (
            <div key={i} className="flex items-center gap-4 mb-4">
              <TimePicker
                onChange={(value) => actualizarRango(dia.dia, i, "desde", value)}
                value={rango.desde || null}
                format="HH:mm"
                disableClock
                clearIcon={null}
                locale="es-ES"
                className="!h-14 !w-36 px-4 border border-pink-200 bg-pink-50 rounded-3xl shadow-sm text-[#333] text-center tracking-widest text-lg focus:outline-none"
                clockIcon={null}
              />
              <span className="text-[#555]">a</span>
              <TimePicker
                onChange={(value) => actualizarRango(dia.dia, i, "hasta", value)}
                value={rango.hasta || null}
                format="HH:mm"
                disableClock
                clearIcon={null}
                locale="es-ES"
                className="!h-14 !w-36 px-4 border border-pink-200 bg-pink-50 rounded-3xl shadow-sm text-[#333] text-center tracking-widest text-lg focus:outline-none"
                clockIcon={null}
              />
              <button
                onClick={() => eliminarRango(dia.dia, i)}
                className="text-red-500 text-sm hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}

          {dia.dia === "Lunes" && dia.rangos.length > 0 && (
            <button
              type="button"
              onClick={() => aplicarATodaLaSemana(dia.dia)}
              className="text-base text-gray-600 hover:underline mt-1"
            >
              Aplicar este horario a todos los días
            </button>
          )}
        </div>
      ))}

      <div className="text-center mt-12">
        <button
          onClick={handleGuardar}
          className="bg-pink-500 text-white text-lg py-3 px-4 rounded-full hover:bg-pink-600 transition"
        >
          Guardar disponibilidad
        </button>
      </div>
    </div>
  );
}
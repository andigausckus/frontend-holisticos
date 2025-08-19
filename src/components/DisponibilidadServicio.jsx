import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // opcional si no estás usando axios

function obtenerSemanaActual() {
  const hoy = new Date();
  const dia = hoy.getDay(); // 0 (domingo) a 6 (sábado)

  // Si hoy es domingo, restamos 6 para ir al lunes anterior (porque comienza nueva semana)
  // Si es cualquier otro día, vamos al lunes de esta semana
  const diferenciaAlLunes = dia === 0 ? -6 : 1 - dia;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diferenciaAlLunes);
  lunes.setHours(0, 0, 0, 0);

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    dias.push({
      fecha,
      rangos: [],
      nuevoDesde: "",
      nuevoHasta: ""
    });
  }

  return dias;
}

export default function DisponibilidadServicio() {
  const [semana, setSemana] = useState([]);
  const [guardando, setGuardando] = useState(false);
const navigate = useNavigate();
const { servicioId } = useParams();

  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar el servicio");

        const semanaBase = obtenerSemanaActual();

        const semanaConHorarios = semanaBase.map((dia) => {
          const fechaStr = dia.fecha.toISOString().split("T")[0];
          const horariosGuardados = data.horariosDisponibles?.find((h) => h.fecha === fechaStr);

          return {
            ...dia,
            rangos: horariosGuardados?.horariosFijos || [],
          };
        });

        setSemana(semanaConHorarios);
      } catch (error) {
        console.error("❌ Error al cargar horarios:", error);
      }
    };

    cargarHorarios();
  }, [servicioId]);

  const agregarRango = (index) => {
    const { nuevoDesde, nuevoHasta } = semana[index];
    if (!nuevoDesde || !nuevoHasta) return;

    const copia = [...semana];
    copia[index].rangos.push({ desde: nuevoDesde, hasta: nuevoHasta });
    copia[index].nuevoDesde = "";
    copia[index].nuevoHasta = "";
    setSemana(copia);
  };

  const eliminarRango = (diaIndex, rangoIndex) => {
    const copia = [...semana];
    copia[diaIndex].rangos.splice(rangoIndex, 1);
    setSemana(copia);
  };

  const aplicarAlResto = () => {
    const lunes = semana[0].rangos;
    const copia = [...semana];
    for (let i = 1; i < 7; i++) {
      copia[i].rangos = [...lunes];
    }
    setSemana(copia);
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const disponibilidadFiltrada = semana
      .map((d) => {
        const rangosValidos = d.rangos.filter(
          (r) =>
            /^([01]\d|2[0-3]):[0-5]\d$/.test(r.desde) &&
            /^([01]\d|2[0-3]):[0-5]\d$/.test(r.hasta)
        );

        if (rangosValidos.length === 0) return null;

        return {
          fecha:
          d.fecha.getFullYear() +
          "-" +
          String(d.fecha.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(d.fecha.getDate()).padStart(2, "0"),
          horariosFijos: rangosValidos,
        };
      })
      .filter(Boolean);
      
  console.log("➡️ Enviando disponibilidad:", disponibilidadFiltrada);
  console.log("TOKEN:", token);

      console.log("🟡 Enviando disponibilidad:", JSON.stringify(disponibilidadFiltrada, null, 2));

      await axios.put(
        `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}/horarios`,
        { horarios: disponibilidadFiltrada }, // ✅ NO `horariosDisponibles`
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📤 Enviado correctamente a /api/disponibilidad/terapeutas/disponibilidad");

      alert("✅ Disponibilidad guardada correctamente");
      navigate("/panel");
    } catch (error) {
      console.error("❌ Error al guardar disponibilidad:", error);
      if (error.response && error.response.data) {
        alert(`❌ Error al guardar: ${error.response.data.error || "Error desconocido"}`);
      } else {
        alert("❌ Error inesperado al guardar disponibilidad");
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white p-4 pt-24 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-center text-[#333] mb-8">
        Disponibilidad para este servicio 🌸
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-12">
        {semana.map((dia, index) => (
          <div key={index} className="border rounded-xl p-2">
            <div className="text-sm font-semibold text-[#333] text-center mb-2">
              {dia.fecha.toLocaleDateString("es-AR", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
              })}
            </div>

            {dia.rangos.length > 0 ? (
              <ul className="mb-2 text-sm text-[#333]">
                {dia.rangos.map((r, i) => (
                  <li key={i} className="flex justify-between items-center">
                    {r.desde} - {r.hasta}
                    <button
                      onClick={() => eliminarRango(index, i)}
                      className="text-red-500 text-xs ml-2"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 text-center mb-2">
                Sin horarios cargados
              </p>
            )}

            <div className="flex gap-1 mb-2">
              <input
                type="tel"
                placeholder="__:__"
                inputMode="numeric"
                pattern="[0-9]{2}:[0-9]{2}"
                maxLength={5}
                value={dia.nuevoDesde}
                onChange={(e) => {
                  let valor = e.target.value.replace(/[^0-9]/g, "");
                  if (valor.length >= 3) {
                    valor = valor.slice(0, 2) + ":" + valor.slice(2, 4);
                  }
                  const copia = [...semana];
                  copia[index].nuevoDesde = valor.slice(0, 5);
                  setSemana(copia);
                }}
                className="border rounded px-2 py-1 text-sm w-full text-center"
              />

              <input
                type="tel"
                placeholder="__:__"
                inputMode="numeric"
                pattern="[0-9]{2}:[0-9]{2}"
                maxLength={5}
                value={dia.nuevoHasta}
                onChange={(e) => {
                  let valor = e.target.value.replace(/[^0-9]/g, "");
                  if (valor.length >= 3) {
                    valor = valor.slice(0, 2) + ":" + valor.slice(2, 4);
                  }
                  const copia = [...semana];
                  copia[index].nuevoHasta = valor.slice(0, 5);
                  setSemana(copia);
                }}
                className="border rounded px-2 py-1 text-sm w-full text-center"
              />
            </div>

            <button
              onClick={() => agregarRango(index)}
              className="bg-pink-400 text-white px-3 py-1 rounded-full text-xs w-full"
            >
              + Agregar horario
            </button>

            {index === 0 && (
              <button
                onClick={aplicarAlResto}
                className="text-[11px] text-blue-600 mt-2 underline block text-center"
              >
                Aplicar estos horarios a toda la semana
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={guardar}
        disabled={guardando}
        className="mb-24 bg-violet-500 text-white mx-auto px-3 py-2 rounded-full w-full w-fi"
      >
        {guardando ? "Guardando..." : "Guardar disponibilidad horaria"}
      </button>
    </div>
  );
}
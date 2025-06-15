import { useState } from "react";
import { useNavigate } from "react-router-dom";

const diasSemana = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

function CalendarioDisponibilidad() {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");

  const [disponibilidad, setDisponibilidad] = useState(
    diasSemana.reduce((acc, dia) => {
      acc[dia] = [];
      return acc;
    }, {})
  );

  const agregarHorario = (dia) => {
    setDisponibilidad((prev) => ({
      ...prev,
      [dia]: [...prev[dia], { desde: "", hasta: "" }],
    }));
  };

  const actualizarHorario = (dia, index, campo, valor) => {
    const horariosActualizados = [...disponibilidad[dia]];
    horariosActualizados[index][campo] = valor;
    setDisponibilidad((prev) => ({
      ...prev,
      [dia]: horariosActualizados,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const disponibilidadFormateada = Object.entries(disponibilidad)
      .map(([dia, rangos]) => ({
        dia,
        rangos: rangos.filter(r => r.desde && r.hasta)
      }))
      .filter(d => d.rangos.length > 0); // Solo días con rangos

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ No hay token de sesión. Por favor inicia sesión nuevamente.");
        return;
      }

      const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/terapeutas/disponibilidad", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ disponibilidad: disponibilidadFormateada })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error desde el servidor:", data);
        setMensaje("Hubo un problema al guardar la disponibilidad.");
        return;
      }

      setMensaje("✅ Disponibilidad guardada con éxito.");
    } catch (error) {
      console.error("❌ Error al enviar disponibilidad:", error);
      setMensaje("Hubo un problema al guardar la disponibilidad.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Disponibilidad horaria</h2>

      {diasSemana.map((dia) => (
        <div key={dia}>
          <h3 className="font-semibold mb-2">{dia}</h3>
          {disponibilidad[dia].map((rango, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="time"
                value={rango.desde}
                onChange={(e) => actualizarHorario(dia, index, "desde", e.target.value)}
                className="border p-2 rounded"
              />
              <span>a</span>
              <input
                type="time"
                value={rango.hasta}
                onChange={(e) => actualizarHorario(dia, index, "hasta", e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => agregarHorario(dia)}
            className="text-sm text-green-600 hover:underline"
          >
            + Agregar horario
          </button>
        </div>
      ))}

      {mensaje && (
        <div className="text-center text-sm text-red-600">{mensaje}</div>
      )}

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Guardar disponibilidad
      </button>
    </form>
  );
}

export default CalendarioDisponibilidad;
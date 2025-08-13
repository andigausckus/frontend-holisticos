// src/pages/ResenaPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ResenaPage() {
  const { reservaId } = useParams();
  const [reserva, setReserva] = useState(null);
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [puntaje, setPuntaje] = useState(5);
  const [enviada, setEnviada] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://serviciosholisticos-backend.andrecode.repl.co/reservas/${reservaId}`)
      .then((res) => res.json())
      .then((data) => setReserva(data))
      .catch(() => setError("Error al cargar la reserva"));
  }, [reservaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("Por favor ingresá tu nombre.");
      return;
    }

    try {
      const res = await fetch("https://serviciosholisticos-backend.andrecode.repl.co/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          terapeuta: reserva.terapeuta._id,
          nombre,
          comentario,
          puntaje,
        }),
      });

      if (res.ok) {
        setEnviada(true);
      } else {
        setError("No se pudo enviar la reseña.");
      }
    } catch {
      setError("Error al enviar la reseña.");
    }
  };

  if (!reserva) {
    return <p className="p-4 text-gray-600">Cargando reserva...</p>;
  }

  if (enviada) {
    return (
      <div className="p-4 max-w-md mx-auto text-center text-green-700">
        <h2 className="text-xl font-semibold mb-2">¡Gracias por tu reseña!</h2>
        <p>Tu opinión ayuda a mejorar nuestra comunidad 🌿</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Dejá tu reseña sobre la sesión con {reserva.terapeuta.nombre}
      </h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Tu nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Tu comentario (opcional)</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            rows={4}
            placeholder="¿Cómo fue tu experiencia?"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Puntaje</label>
          <select
            value={puntaje}
            onChange={(e) => setPuntaje(Number(e.target.value))}
            className="w-full border border-gray-300 p-2 rounded"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} estrella{n !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded"
        >
          Enviar reseña
        </button>
      </form>
    </div>
  );
}
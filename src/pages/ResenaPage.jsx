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

  const API_URL = process.env.REACT_APP_BACKEND_URL; // URL de tu backend en Render

  useEffect(() => {
    fetch(`${API_URL}/reservas/${reservaId}`)
      .then((res) => res.json())
      .then((data) => setReserva(data))
      .catch((err) => setError("Error al cargar la reserva"));
  }, [reservaId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("Por favor ingresá tu nombre.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/resenas`, {
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
    } catch (err) {
      setError("Error al enviar la reseña.");
    }
  };

  if (!reserva) {
    return <p className="p-4 text-gray-600">Cargando reserva...</p>;
  }

  if (enviada) {
    return (
      <div className="p-4 pt-24 max-w-md mx-auto text-center text-gray-700">
        <h2 className="text-xl font-semibold mb-2">¡Gracias por tu reseña!</h2>
        <p>Tu reseña es fundamental para ayudar a otros usuarios a tomar decisiones informadas y mejorar nuestra comunidad. Tu reseña está bajo revisión para asegurarnos de que se ajuste a nuestras políticas y sea visible para todos 🌿</p>
      </div>
    );
  }

return (
  <div className="p-4 pt-24 max-w-md mx-auto space-y-6">
    <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
      Compartí con la Comunidad tu opinión sobre esta sesión 😃
    </h2>

    <h2 className="text-gray-400 text-lg font-semibold mb-2">
      {reserva.terapeuta?.nombre}
    </h2>

    {error && <p className="text-red-600 mb-3">{error}</p>}

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo nombre sin label */}
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
        placeholder="Tu nombre *"
        required
      />

      {/* Campo comentario sin label */}
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
        rows={4}
        placeholder="¿Cómo fue tu experiencia?"
      />

      {/* Puntuación */}
      <div className="flex text-center flex-col items-start mb-2">
        <span className="text-gray-400 text-base">Puntuación</span>
        <div className="flex items-center gap-1 flex justify-center w-full ">
          {[1, 2, 3, 4, 5].map((n) => (
            <svg
              key={n}
              onClick={() => setPuntaje(n)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={n <= puntaje ? "#fbbf24" : "none"} // Amarillo si está seleccionada
              stroke="#fbbf24"
              strokeWidth={2}
              className="w-8 h-8 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.91c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.99 10.101c-.783-.57-.38-1.81.588-1.81h4.91a1 1 0 00.95-.69l1.518-4.674z"
              />
            </svg>
          ))}
        </div>
      </div>

      {/* Botón rosa suave */}
      <button
        type="submit"
        className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded font-semibold"
      >
        Enviar reseña
      </button>
    </form>
  </div>
);
}
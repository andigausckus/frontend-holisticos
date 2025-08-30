// src/pages/ResenaPage.jsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function ResenaPage() {
  const { reservaId } = useParams();
  const [searchParams] = useSearchParams();
  const defaultNombre = searchParams.get("nombre") || "";
  const defaultEmail = searchParams.get("email") || "";

  const [reserva, setReserva] = useState(null);
  const [nombre, setNombre] = useState(defaultNombre);
  const [email, setEmail] = useState(defaultEmail);
  const [comentario, setComentario] = useState("");
  const [puntaje, setPuntaje] = useState(5);
  const [enviada, setEnviada] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${API_URL}/reservas/${reservaId}`)
      .then((res) => res.json())
      .then((data) => setReserva(data))
      .catch(() => setError("Error al cargar la reserva"));
  }, [reservaId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setError("Por favor completá nombre y email.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/resenas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicioId: reserva.servicioId,
          nombre,
          email,
          comentario,
          puntaje,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEnviada(true);
      } else {
        setError(data.error || "No se pudo enviar la reseña.");
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
        <h2 className="text-xl font-medium mb-2">
          ¡Gracias por tu reseña! 💖
        </h2>
        <p>
          Tu reseña es fundamental para ayudar a otros usuarios y mejorar nuestra
          comunidad 😉. Si es aprobada, pronto estará publicada en la plataforma.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-24 max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-medium text-center mb-4 text-gray-800">
        ¡Queremos saber tu opinión! Compartila con la comunidad 💜
      </h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-pink-300 p-2 rounded focus:outline-none focus:ring-pink-100"
          placeholder="Tu nombre *"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-pink-300 p-2 rounded focus:outline-none focus:ring-pink-100"
          placeholder="Tu email *"
          required
        />
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full border border-pink-300 p-2 rounded focus:outline-none focus:ring-pink-100"
          rows={4}
          placeholder="¿Cómo fue tu experiencia?"
        />

        <div className="flex flex-col items-center mb-2">
  <span className="text-gray-400 text-base">Puntuación</span>
  <div className="flex justify-center items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <svg
                key={n}
                onClick={() => setPuntaje(n)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={n <= puntaje ? "#fbbf24" : "none"}
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
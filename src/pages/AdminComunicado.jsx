import { useState, useEffect } from "react";

export default function AdminComunicado() {
  const [autorizado, setAutorizado] = useState(false);
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardado, setGuardado] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!autorizado) return;

    fetch("https://servicios-holisticos-backend.onrender.com/api/mensaje-global")
      .then((res) => res.json())
      .then((data) => {
        if (data?.contenido) {
          setMensaje(data.contenido);
        } else {
          setMensaje("");
        }
      })
      .catch(() => setError("❌ No se pudo cargar el mensaje actual"));
  }, [autorizado]);

  if (!autorizado) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold text-gray-700 mb-4">🔒 Acceso restringido</h2>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Ingresá la clave secreta"
          className="w-full p-2 border border-gray-400 rounded mb-4"
        />
        <button
          onClick={() => {
            if (clave === "claveSecreta123") {
              setAutorizado(true);
            } else {
              alert("❌ Clave incorrecta");
            }
          }}
          className="bg-pink-500 text-white px-4 py-2 rounded w-full"
        >
          Entrar
        </button>
      </div>
    );
  }

  const guardarMensaje = async () => {
    try {
      const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/mensaje-global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: mensaje }),
      });

      if (res.ok) {
        setGuardado("✅ Mensaje guardado con éxito");
      } else {
        setGuardado("❌ Error al guardar");
      }
    } catch (err) {
      setGuardado("❌ Error al conectar con el servidor");
    }
  };

  const eliminarMensaje = async () => {
  try {
    const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/mensaje-global", {
      method: "DELETE",
    });

    if (res.ok) {
      setMensaje("");
      setGuardado("🗑 Comunicado eliminado");
    } else {
      setGuardado("❌ No se pudo eliminar el comunicado");
    }
  } catch (err) {
    setGuardado("❌ Error al conectar con el servidor");
  }
};

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-gray-700 mb-4">📢 Comunicado global a terapeutas</h2>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {guardado && <p className="mb-4 text-sm text-green-600">{guardado}</p>}

      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Escribí aquí el comunicado para todos los terapeutas..."
        rows={6}
        className="w-full p-3 border border-gray-400 rounded resize-none text-[#333]"
      />

      <button
  onClick={eliminarMensaje}
  className="mt-2 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
>
  Eliminar comunicado
</button>

      <button
        onClick={guardarMensaje}
        className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition"
      >
        
        Guardar mensaje
      </button>
    </div>
  );
}
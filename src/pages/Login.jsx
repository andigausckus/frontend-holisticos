import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Importar el contexto

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Usar función login del contexto

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.classList.remove("hidden");
    return () => {
      if (footer) footer.classList.remove("hidden");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://servicios-holisticos-backend.onrender.com/api/terapeutas/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.msg || "Credenciales inválidas");
        return;
      }

      login(data.token); // ✅ Guardar token y actualizar estado global
      navigate("/panel"); // ✅ Redirigir después de iniciar sesión

    } catch (err) {
      setError("Ocurrió un error. Intenta de nuevo.");
    }
  };

  return (
    <div className="bg-white pt-56 max-w-full mx-auto p-8 rounded-xl">
      <blockquote className="text-[#444444] italic text-center border-l-4 border-[#444444] pl-4 mb-8 max-w-xl mx-auto">
        “Tu vocación transforma vidas. Este es tu espacio para brillar y ayudar”
      </blockquote>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md mt-12 mx-auto mb-32"
      >
        

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 border border-[#444] rounded-lg outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border border-[#444] rounded-lg outline-none mt-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="block mx-auto text-center mt-10 bg-pink-500 text-white py-2 px-6 min-w-max rounded-xl hover:bg-pink-600 transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
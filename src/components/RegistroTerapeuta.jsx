import { useState } from "react";

export default function RegistroTerapeuta() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    especialidades: "",
    ubicacion: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch(
        "https://servicios-holisticos-backend.onrender.com/api/terapeutas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMensaje("✅ Terapeuta registrado con ID: " + data._id);
        setFormData({
          nombreCompleto: "",
          email: "",
          password: "",
          especialidades: "",
          ubicacion: "",
        });
      } else {
        const error = await response.json();
        setMensaje("❌ Error: " + (error.message || "Intenta de nuevo."));
      }
    } catch (err) {
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div className="max-w-full mx-auto mt-12 p-6 bg-white rounded-xl">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        Registro de terapeuta 🌷
      </h2>

      {mensaje && (
        <p className="mb-4 text-sm text-center text-red-600">{mensaje}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombreCompleto"
          value={formData.nombreCompleto}
          onChange={handleChange}
          placeholder="Nombre y apellido"
          className="w-full p-2 border border-[#444444] rounded-lg outline-none"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full p-2 border border-[#444444] rounded-lg outline-none"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full p-2 border border-[#444444] rounded-lg outline-none"
          required
        />

        <input
          type="text"
          name="especialidades"
          value={formData.especialidades}
          onChange={handleChange}
          placeholder="Especialidades (Reiki, Yoga, Tarot, etc)"
          className="w-full p-2 border border-[#444444] rounded-lg outline-none"
          required
        />

        <input
          type="tel"
          inputMode="numeric"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp (sin el 15)"
          className="w-full p-2 border border-[#444444] rounded-lg outline-none mt-4"
          required
        />

        <input
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          placeholder="Ubicación (ciudad)"
          className="w-full p-2 border border-[#444444] rounded-lg outline-none"
          required
        />

        <div className="mt-6">
          <button
            type="submit"
            className="w-full mt-6 bg-pink-500 text-white py-2 rounded-3xl hover:bg-pink-600 transition"
          >
            Registrarme
          </button>
        </div>
      </form>
    </div>
  );
}
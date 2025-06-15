import { useState } from "react";

export default function RegistroTerapeuta() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    fechaNacimiento: "",
    telefono: "",
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

    // Validación: el teléfono debe tener 10 dígitos numéricos exactos
    if (!/^\d{10}$/.test(formData.telefono)) {
      setMensaje("❌ El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    try {
      const response = await fetch("https://servicios-holisticos-backend.onrender.com/api/terapeutas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto,
          email: formData.email,
          password: formData.password,
          fechaNacimiento: formData.fechaNacimiento,
          telefono: formData.telefono, // sin +54
          ubicacion: formData.ubicacion,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMensaje("✅ Terapeuta registrado con ID: " + data._id);
        setFormData({
          nombreCompleto: "",
          email: "",
          password: "",
          fechaNacimiento: "",
          telefono: "",
          ubicacion: "",
        });
      } else {
        const error = await response.json();
        setMensaje("❌ Error al registrar terapeuta: " + (error.message || "Intenta de nuevo."));
      }
    } catch (err) {
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        Registro de terapeuta 🌈
      </h2>

      {mensaje && <p className="mb-4 text-sm text-center text-red-600">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombreCompleto"
          value={formData.nombreCompleto}
          onChange={handleChange}
          placeholder="Nombre y apellido"
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
          required
        />

        
        <label className="text-sm text-gray-500 mb-1 block">Fecha de nacimiento</label>
<input
  type="date"
  name="fechaNacimiento"
  value={formData.fechaNacimiento}
  onChange={handleChange}
  className="w-full p-2 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
  required
/>

        
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          pattern="\d{10}"
          maxLength={10}
          placeholder="Teléfono (sin +54)"
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
          required
        />
        

        <input
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          placeholder="Ubicación (ciudad)"
          
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
          required
        />

        <button
          type="submit"
          className="w-full bg-pink-400 text-white py-2 rounded-3xl hover:bg-pink-500 transition"
        >
          Registrarme
        </button>
      </form>
    </div>
  );
}
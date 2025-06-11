import { useState } from "react";

export default function RegistroTerapeuta() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
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

    try {
      const response = await fetch(
        "https://servicios-holisticos-backend.onrender.com/api/terapeutas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMensaje("✅ Terapeuta registrado con ID: " + data._id);
        setFormData({
          nombre: "",
          email: "",
          password: "",
          telefono: "",
          ubicacion: "",
        });
      } else {
        const error = await response.json();
        setMensaje(
          "❌ Error al registrar terapeuta: " +
            (error.mensaje || error.error || "Error desconocido")
        );
      }
    } catch (error) {
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="max-w-md bg-gray-100 min-h-screen mx-auto mt-8 p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white rounded-3xl bg-gray-100 p-8 shadow-md"
      >
        {/* Título dentro del formulario */}
        <h2 className="font-montserrat font-bold text-xl mb-4 text-gray-800 text-center">
          Registro nuevo terapeuta
        </h2>

        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre y apellido"
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          placeholder="Ubicación"
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full bg-violet-500 text-white py-2 rounded-3xl hover:bg-violet-600"
        >
          Registrarme
        </button>

        {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
      </form>
    </div>
  );
}
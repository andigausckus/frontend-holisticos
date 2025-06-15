import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NuevoServicio() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: "",
    descripcion: "",
    modalidad: [],
    ubicacion: "",
    duracionHoras: "",
    duracionMinutos: "",
    precio: "",
    categoria: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (checked) {
        setFormulario((prev) => ({
          ...prev,
          modalidad: [...prev.modalidad, value],
        }));
      } else {
        setFormulario((prev) => ({
          ...prev,
          modalidad: prev.modalidad.filter((mod) => mod !== value),
        }));
      }
    } else {
      setFormulario((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones...

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    // Construir objeto
    const duracionTotalMinutos = Number(formulario.duracionHoras) * 60 + Number(formulario.duracionMinutos);

    const body = {
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      modalidad: formulario.modalidad, // Puede ser array o string, depende backend
      ubicacion: formulario.modalidad.includes("Presencial") ? formulario.ubicacion : undefined,
      duracion: duracionTotalMinutos,
      precio: Number(formulario.precio),
      categoria: formulario.categoria,
    };

    try {
      const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/servicios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      console.log("Status:", res.status);
      console.log("Respuesta:", text);

      if (!res.ok) {
        let errorMsg = text;
        try {
          const errorJson = JSON.parse(text);
          errorMsg = errorJson.error || errorJson.message || text;
        } catch {}
        alert("Error del servidor: " + errorMsg);
        throw new Error(errorMsg);
      }

      alert("Servicio creado con éxito.");
      navigate("/mis-servicios");
    } catch (error) {
      alert("Hubo un problema al enviar el servicio. " + error.message);
      console.error(error);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white rounded shadow"
    >
      <h2 className="text-2xl mb-4 font-semibold">Crear nuevo servicio</h2>

      <label className="block mb-2">
        Título *
        <input
          type="text"
          name="titulo"
          value={formulario.titulo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <label className="block mb-2">
        Descripción *
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <fieldset className="mb-2">
        <legend>Modalidad * (seleccioná al menos una)</legend>
        <label className="mr-4">
          <input
            type="checkbox"
            name="modalidad"
            value="Presencial"
            checked={formulario.modalidad.includes("Presencial")}
            onChange={handleChange}
          />
          Presencial
        </label>
        <label>
          <input
            type="checkbox"
            name="modalidad"
            value="Online"
            checked={formulario.modalidad.includes("Online")}
            onChange={handleChange}
          />
          Online
        </label>
      </fieldset>

      {formulario.modalidad.includes("Presencial") && (
        <label className="block mb-2">
          Ubicación *
          <input
            type="text"
            name="ubicacion"
            value={formulario.ubicacion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
      )}

      <div className="flex gap-4 mb-2">
        <label className="flex-1">
          Duración horas *
          <input
            type="number"
            name="duracionHoras"
            value={formulario.duracionHoras}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            required
          />
        </label>

        <label className="flex-1">
          Duración minutos *
          <input
            type="number"
            name="duracionMinutos"
            value={formulario.duracionMinutos}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            max="59"
            required
          />
        </label>
      </div>

      <label className="block mb-2">
        Precio (ARS) *
        <input
          type="number"
          name="precio"
          value={formulario.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </label>

      <label className="block mb-4">
        Categoría *
        <input
          type="text"
          name="categoria"
          value={formulario.categoria}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Ejemplo: Meditación, Reiki..."
          required
        />
      </label>

      <button
        type="submit"
        className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition"
      >
        Continuar
      </button>
    </form>
  );
}

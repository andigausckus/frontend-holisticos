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
    imagen: null,
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
    } else if (type === "file") {
      setFormulario((prev) => ({
        ...prev,
        imagen: e.target.files[0],
      }));
    } else {
      setFormulario((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (
      !formulario.titulo ||
      !formulario.descripcion ||
      formulario.modalidad.length === 0 ||
      !formulario.ubicacion ||
      !formulario.duracionHoras ||
      !formulario.duracionMinutos ||
      !formulario.precio ||
      !formulario.categoria
    ) {
      alert("Por favor completá todos los campos obligatorios.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", formulario.titulo);
    formData.append("descripcion", formulario.descripcion);
    formulario.modalidad.forEach((mod) =>
      formData.append("modalidad", mod)
    );
    formData.append("ubicacion", formulario.ubicacion);

    // Enviamos duracion en minutos totales (puedes cambiar a enviar horas y minutos separados si el backend lo prefiere)
    const duracionTotalMinutos =
      Number(formulario.duracionHoras) * 60 + Number(formulario.duracionMinutos);
    formData.append("duracion", duracionTotalMinutos);

    formData.append("precio", Number(formulario.precio));
    formData.append("categoria", formulario.categoria);
    if (formulario.imagen) {
      formData.append("imagen", formulario.imagen);
    }

    try {
      const res = await fetch(
        "https://servicios-holisticos-backend.onrender.com/api/servicios",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        alert("Error del servidor: " + errorText);
        throw new Error(errorText);
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

      <label className="block mb-2">
        Ubicación *
        <input
          type="text"
          name="ubicacion"
          value={formulario.ubicacion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </label>

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

      <label className="block mb-2">
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

      <label className="block mb-4">
        Imagen (opcional)
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
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
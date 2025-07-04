import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditarMisServicios() {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicios = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión");
        return;
      }

      try {
        const res = await fetch(
          "https://servicios-holisticos-backend.onrender.com/api/servicios/mis-servicios",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error al cargar servicios");
        const data = await res.json();
        setServicios(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchServicios();
  }, []);

  const handleEditar = (id) => {
    navigate(`/editar-servicio/${id}`);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Querés eliminar este servicio?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://servicios-holisticos-backend.onrender.com/api/servicios/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error al eliminar servicio");
      setServicios((prev) => prev.filter((serv) => serv._id !== id));
      alert("Servicio eliminado");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Mis Servicios</h2>
      {servicios.length === 0 ? (
        <p>No tenés servicios cargados.</p>
      ) : (
        <ul>
          {servicios.map(({ _id, titulo, precio, descripcion }) => (
            <li
              key={_id}
              className="border-b py-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{titulo}</h3>
                <p className="text-sm text-gray-600">${precio}</p>
                <p className="text-sm text-gray-700">{descripcion}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEditar(_id)}
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
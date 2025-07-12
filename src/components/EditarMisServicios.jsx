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
    <div className="bg-white pt-24 mb-24 min-h-screen px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 text-center text-gray-800">Mis Servicios 🍄</h2>
        {servicios.length === 0 ? (
          <p className="text-center text-gray-600">No tenés servicios cargados.</p>
        ) : (
          <ul className="space-y-8">
            {servicios.map(({ _id, titulo, precio, descripcion }) => (
              <li
                key={_id}
                className="border border-gray-200 p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{titulo}</h3>
                <p className="text-md text-indigo-600 font-medium mb-2">${precio}</p>
                <p className="text-gray-600 mb-4 line-clamp-3">{descripcion}</p>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditar(_id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(_id)}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
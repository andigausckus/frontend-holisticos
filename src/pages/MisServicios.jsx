import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MisServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const cargarServicios = async () => {
      try {
        const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/servicios/mios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al cargar servicios");
        setServicios(data);
      } catch (err) {
        console.error("❌ Error cargando servicios:", err);
        alert("No se pudieron cargar tus servicios.");
      } finally {
        setCargando(false);
      }
    };

    cargarServicios();
  }, [navigate]);

  if (cargando) return <p className="p-6 text-gray-600">Cargando servicios...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis servicios</h2>

      {servicios.length === 0 ? (
        <p className="text-gray-600">Todavía no creaste ningún servicio.</p>
      ) : (
        <div className="space-y-4">
          {servicios.map((s) => (
            <div key={s._id} className="bg-white shadow rounded p-4 border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-pink-600">{s.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-2">{s.descripcion?.slice(0, 100)}...</p>
                  <p className="text-sm text-gray-700">
                    <strong>Duración:</strong> {Math.floor(s.duracion / 60)}h {s.duracion % 60}min
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Precio:</strong> ${s.precio}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Categoría:</strong> {s.categoria}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => navigate(`/editar-servicio/${s._id}`)}
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded shadow"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
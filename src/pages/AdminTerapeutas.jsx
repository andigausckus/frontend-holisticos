import { useEffect, useState } from "react";

function AdminTerapeutas() {
  const [terapeutas, setTerapeutas] = useState([]);

  useEffect(() => {
    const fetchTerapeutas = async () => {
      try {
        const res = await fetch("https://servicios-holisticos-backend.onrender.com/api/terapeutas/admin/listado");
        const data = await res.json();
        setTerapeutas(data);
      } catch (error) {
        console.error("❌ Error cargando terapeutas:", error);
      }
    };

    fetchTerapeutas();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-[#333]">👩‍⚕️ Terapeutas registrados</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Especialidades</th>
              <th className="p-2 border">Modalidad</th>
              <th className="p-2 border">Alta</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {terapeutas.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="p-2 border">{t.nombreCompleto}</td>
                <td className="p-2 border">{t.email}</td>
                <td className="p-2 border">{t.especialidades?.join(", ")}</td>
                <td className="p-2 border">{t.modalidad}</td>
                <td className="p-2 border">
                  {new Date(t.creadoEn).toLocaleDateString("es-AR")}
                </td>
                <td className="p-2 border">
                  <button className="bg-pink-500 text-white px-3 py-1 rounded text-xs">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTerapeutas;
import { useParams } from "react-router-dom";

export default function ConfigurarHorarios() {
  const { id } = useParams();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Configurar Horarios para el servicio ID: {id}
      </h1>
      <p className="text-gray-600">Aquí vas a poder configurar los días y horarios en los que ofrecés este servicio.</p>

      {/* Próximamente: agregar formulario de disponibilidad */}
    </div>
  );
}
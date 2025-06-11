import RegistroTerapeuta from "../components/RegistroTerapeuta";

export default function Registro() {
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {/* Aquí el contenedor centrado y con ancho máximo */}
      <div className="max-w-md mx-auto p-4 pt-32">
        <RegistroTerapeuta />
      </div>
    </div>
  );
}
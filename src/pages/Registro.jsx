import RegistroTerapeuta from "../components/RegistroTerapeuta";

export default function Registro() {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-md mx-auto p-4 pt-32">
        {/* Frase destacada */}
        <blockquote className="text-[#444444] italic text-center border-l-4 border-[#444444] pl-4 mb-8">
          “Quien que haya nacido en este Universo puede resistirse al deseo de averiguar su verdadero Yo”
        </blockquote>

        <RegistroTerapeuta />
      </div>
    </div>
  );
}
import RegistroTerapeuta from "../components/RegistroTerapeuta";

export default function Registro() {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-full mx-auto p-4 pt-12">
        {/* Frase destacada */}
        <blockquote className="text-[#444444] italic text-center border-l-4 border-[#444444] pl-4 mb-8">
          “Tu vocación transforma vidas. Este es tu espacio para brillar y ayudar”
        </blockquote>

        <RegistroTerapeuta />
      </div>
    </div>
  );
}
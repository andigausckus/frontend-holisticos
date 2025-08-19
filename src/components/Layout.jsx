import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ⚙️ Activá/desactivá el modo mantenimiento desde acá
const modoMantenimiento = false;

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className={`min-h-screen ${modoMantenimiento ? "blur-sm pointer-events-none" : ""}`}>
        <Outlet />
      </main>
      <Footer />

      {modoMantenimiento && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#333] mb-4">
            🌿 Sitio en construcción
          </h1>
          <p className="text-md text-gray-700 mb-4 max-w-md">
            Estamos realizando los últimos ajustes. Pronto vas a poder reservar sesiones con terapeutas holísticos de todo el país.
          </p>
          <p className="text-sm text-gray-500">Gracias por tu paciencia 💜</p>
        </div>
      )}
    </>
  );
}
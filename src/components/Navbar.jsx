import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logueado, setLogueado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogueado(!!token);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setLogueado(false);
    navigate("/");
  };

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center h-full" onClick={() => setMenuOpen(false)}>
          <img
            src="https://i.postimg.cc/k5JR5k74/Logo-Centro-Hol-stico-Minimalista-Beige-y-Caf-20250606-132545-0000.png"
            alt="Logo Servicios Holísticos"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Menú escritorio */}
        <ul className="hidden md:flex space-x-6 text-[#333] font-medium">
          <li><Link to="/" className="hover:text-violet-600">Inicio</Link></li>
          <li><Link to="/servicios" className="hover:text-violet-600">Servicios</Link></li>
          <li><Link to="/blog" className="hover:text-violet-600">Blog</Link></li>
          <li><a href="#terapeutas" className="hover:text-violet-600">Terapeutas</a></li>

          {logueado ? (
            <>
              <li><Link to="/panel" className="hover:text-violet-600">Panel</Link></li>
              <li><Link to="/nuevo-servicio" className="hover:text-violet-600">Subir servicio</Link></li>
              <li><button onClick={cerrarSesion} className="hover:text-violet-600">Cerrar sesión</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-violet-600">Iniciar sesión</Link></li>
              <li><Link to="/registro" className="hover:text-violet-600">Regístrate</Link></li>
            </>
          )}
        </ul>

        {/* Botón hamburguesa */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="focus:outline-none p-2 rounded-lg shadow-md bg-lilaClaro hover:bg-[#9C8FE6]"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-b-0">
          <ul className="space-y-3 text-[#444444] font-medium text-center">
            <li><Link to="/" onClick={toggleMenu}>Inicio</Link></li>
            <li><Link to="/servicios" onClick={toggleMenu}>Servicios</Link></li>
            <li><Link to="/blog" onClick={toggleMenu}>Blog</Link></li>
            <li><a href="#terapeutas" onClick={toggleMenu}>Terapeutas</a></li>

            {logueado ? (
              <>
                <li><Link to="/panel" onClick={toggleMenu}>Panel</Link></li>
                <li><Link to="/nuevo-servicio" onClick={toggleMenu}>Subir servicio</Link></li>
                <li><button onClick={cerrarSesion}>Cerrar sesión</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={toggleMenu}>Iniciar sesión</Link></li>
                <li><Link to="/registro" onClick={toggleMenu}>Regístrate</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
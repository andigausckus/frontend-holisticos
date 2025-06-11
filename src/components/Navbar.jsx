import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

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
          <li>
            <Link to="/" className="hover:text-violet-600" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/servicios" className="hover:text-violet-600" onClick={() => setMenuOpen(false)}>
              Servicios
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-violet-600" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
          </li>
          <li>
            <a href="#terapeutas" className="hover:text-violet-600" onClick={() => setMenuOpen(false)}>
              Terapeutas
            </a>
          </li>
          <li>
            <a href="/login" className="hover:text-violet-600" onClick={() => setMenuOpen(false)}>
              Iniciar sesión
            </a>
          </li>
          <li>
            <a href="/registro" className="hover:text-violet-600" onClick={() => setMenuOpen(false)}>
              Regístrate
            </a>
          </li>
        </ul>

        {/* Menú hamburguesa (mobile) */}
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
            <li>
              <Link to="/" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/servicios" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                Servicios
              </Link>
            </li>
            <li>
              <Link to="/blog" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                Blog
              </Link>
            </li>
            <li>
              <a href="#terapeutas" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                Terapeutas
              </a>
            </li>
            <li>
              <a href="/login" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                Iniciar sesión
              </a>
            </li>
            <li>
              <a href="/registro" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                Regístrate
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
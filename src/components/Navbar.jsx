import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logueado, logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-pink-50 fixed top-0 left-0 w-full z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center h-full"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="https://i.postimg.cc/zXp1bspH/Whats-App-Image-2025-07-10-at-16-35-41.png"
            alt="Logo Servicios Holísticos"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Menú escritorio */}
        <div className="hidden md:flex justify-center items-center flex-1">
          <ul className="flex space-x-8 text-[#444] font-medium">
            <li>
              <Link to="/" className="hover:text-violet-600">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/servicios" className="hover:text-violet-600">
                Servicios
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-violet-600">
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/tienda"
                className="bg-[#f1ecfc] px-3 py-1 rounded-2xl hover:text-violet-600"
              >
                Tienda Holística
              </Link>
            </li>
          </ul>
        </div>

        {/* Acciones derecha (escritorio) */}
        <div className="hidden md:flex space-x-3 items-center">
          {logueado ? (
            <>
              <Link
                to="/panel"
                className="text-sm font-semibold text-[#444] hover:text-violet-600"
              >
                Mi cuenta
              </Link>
              <button
                onClick={cerrarSesion}
                className="bg-[#5e4b8b] text-white px-4 py-1 rounded-3xl text-sm hover:opacity-90 transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-[#5e4b8b] text-white px-4 py-1 rounded-3xl text-sm hover:opacity-90 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="bg-[#5e4b8b] text-white px-4 py-1 rounded-3xl text-sm hover:opacity-90 transition"
              >
                Registrarme 
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa (móvil) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-b-0 shadow-md">
          <ul className="space-y-3 text-[#444444] font-medium text-center">
            <li>
              <Link
                to="/"
                onClick={toggleMenu}
                className="block py-2 px-4 rounded-3xl bg-[#f1ecfc]"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/servicios"
                onClick={toggleMenu}
                className="block py-2 px-4 rounded-3xl bg-[#f1ecfc]"
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                onClick={toggleMenu}
                className="block py-2 px-4 rounded-3xl bg-[#f1ecfc]"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/tienda"
                onClick={toggleMenu}
                className="block py-2 px-4 rounded-3xl bg-[#f1ecfc]"
              >
                Tienda Holística
              </Link>
            </li>

            {logueado ? (
              <>
                <li>
                  <Link
                    to="/panel"
                    onClick={toggleMenu}
                    className="block py-2 px-4 rounded-3xl bg-[#f1ecfc]"
                  >
                    Mi cuenta
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      toggleMenu();
                      cerrarSesion();
                    }}
                    className="block w-full py-2 px-4 rounded-3xl bg-[#f1ecfc]"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="block py-2 px-4 rounded-3xl bg-[#f1ecfc]"
                  >
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link
                    to="/registro"
                    onClick={toggleMenu}
                    className="block py-2 px-4 rounded-3xl bg-[#f1ecfc]"
                  >
                    Registrarme
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
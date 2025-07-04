import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#d6ebf4] text-[#333333] py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6 text-center">
        {/* Fila de arriba */}
        <div className="flex justify-center space-x-8 text-sm font-medium">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/blog" className="hover:underline">Blog</Link>
          <Link to="/servicios" className="hover:underline">Servicios</Link>
        </div>

        {/* Fila de abajo */}
        <div className="flex justify-center space-x-6 text-sm">
          <Link to="/terminos" className="hover:underline">Términos y Condiciones</Link>
          <Link to="/privacidad" className="hover:underline">Política de Privacidad</Link>
          <Link to="/login" className="hover:underline">Iniciar sesión</Link>
          <Link to="/registro" className="hover:underline">Regístrate</Link>
        </div>

        {/* Íconos de redes */}
        <div className="flex justify-center pt-4">
          <a
            href="https://www.instagram.com/holisticoservicios?igsh=bHhpdzI1cXk2cmpo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="https://www.svgrepo.com/show/452229/instagram-1.svg"
              alt="Instagram"
              className="h-6 w-6"
            />
          </a>
        </div>

        {/* Pie de página */}
        <p className="text-xs text-[#333333] mt-4">
          © {new Date().getFullYear()} Servicios Holísticos. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
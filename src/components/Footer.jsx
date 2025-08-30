import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#d6ebf4] text-[#333333] py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6 text-center">
        {/* Fila de arriba */}
        <div className="flex justify-center flex-wrap gap-6 text-sm font-medium">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/blog" className="hover:underline">Blog</Link>
          <Link to="/servicios" className="hover:underline">Servicios</Link>
          <Link to="/tienda" className="hover:underline">Tienda Holística</Link>
        </div>

        {/* Fila de abajo */}
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <Link to="/terminos" className="hover:underline">Términos y Condiciones</Link>
          <Link to="/privacidad" className="hover:underline">Política de Privacidad</Link>
          <Link to="/login" className="hover:underline">Iniciar sesión</Link>
          <Link to="/registro" className="hover:underline">Registrarme</Link>
        </div>

        {/* Íconos de redes */}
        <div className="flex justify-center gap-4 pt-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/servicios_holisticos?utm_source=qr&igsh=NGx1M212dGJnNGM1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="https://www.svgrepo.com/show/452229/instagram-1.svg"
              alt="Instagram"
              className="h-10 w-10"
            />
          </a>

          {/* Threads */}
          <a
            href="https://www.threads.net/@servicios_holisticos"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="https://img.icons8.com/?size=100&id=AS2a6aA9BwK3&format=png&color=000000"
              alt="Threads"
              className="h-10 w-10"
            />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/message/GQOZ2ZIA6UFTO1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="https://img.icons8.com/?size=100&id=BkugfgmBwtEI&format=png&color=25D366"
              alt="WhatsApp"
              className="h-10 w-10"
            />
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61568385726256"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13912&format=png&color=1877F2"
              alt="Facebook"
              className="h-10 w-10"
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
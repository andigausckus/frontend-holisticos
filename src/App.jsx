import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import "./calendario.css";

// Importa tus páginas
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import ServicioDetalle from "./pages/ServicioDetalle";
import Registro from "./pages/Registro";
import Blog from "./pages/blog";
import QueEsTerapiaHolistica from "./pages/blog/QueEsTerapiaHolistica";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import Login from "./pages/Login";
import Panel from "./pages/Panel";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* 👈 Se activa al cambiar de página */}
      <div className="font-montserrat">
        <Routes>
          {/* Rutas con Navbar y Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/servicios/:id" element={<ServicioDetalle />} />
            
            <Route path="/registro" element={<Registro />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog/que-es-terapia-holistica" element={<QueEsTerapiaHolistica />} />
            <Route path="/terminos-y-condiciones" element={<Terminos />} />
            <Route path="/politica-de-privacidad" element={<Privacidad />} />
          </Route>

          {/* Rutas especiales sin Navbar/Footer */}
          <Route path="/panel" element={<Panel />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
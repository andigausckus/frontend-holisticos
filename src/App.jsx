import { BrowserRouter, Routes, Route } from "react-router-dom";
import QueEsTerapiaHolistica from "./pages/blog/QueEsTerapiaHolistica";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // 👈 Importado acá

import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Blog from "./pages/blog";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import PanelTerapeuta from "./components/PanelTerapeuta";
import PerfilTerapeuta from "./components/PerfilTerapeuta";
import ServicioDetalle from "./pages/ServicioDetalle";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* 👈 Este componente hace que siempre suba al top al cambiar de ruta */}
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/que-es-una-terapia-holistica" element={<QueEsTerapiaHolistica />} />

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/panel" element={<PanelTerapeuta />} />
          <Route path="/terapeuta/:id" element={<PerfilTerapeuta />} />
          <Route path="/servicios/:id" element={<ServicioDetalle />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
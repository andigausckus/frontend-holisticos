import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Blog from "./pages/blog";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import NuevoServicio from "./pages/NuevoServicio";
import PanelTerapeuta from "./components/PanelTerapeuta";
import PerfilTerapeuta from "./components/PerfilTerapeuta";
import CalendarioDisponibilidad from "./pages/CalendarioDisponibilidad";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/nuevo-servicio" element={<NuevoServicio />} />
          <Route path="/panel" element={<PanelTerapeuta />} />
          <Route path="/terapeuta/:id" element={<PerfilTerapeuta />} />
          <Route path="/configurar-horarios/:id" element={<CalendarioDisponibilidad />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Blog from "./pages/blog";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import PanelTerapeuta from "./components/PanelTerapeuta";
import PerfilTerapeuta from "./components/PerfilTerapeuta";
import ServicioDetalle from "./pages/ServicioDetalle";
import PaginaPagoSimple from "./pages/PaginaPagoSimple";

// ✅ Importar las páginas legales
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad"
import PaginaGracias from "./pages/PaginaGracias";
import PaginaPagoFallido from "./pages/PaginaPagoFallido";
import PaginaPagoPendiente from "./pages/PaginaPagoPendiente";
import NuevoServicio from "./pages/NuevoServicio"; // ajustá el path si está en otra carpeta
import DisponibilidadServicio from "./components/DisponibilidadServicio";
import EditarMisServicios from "./components/EditarMisServicios";
import EditarServicio from "./components/EditarServicio";


// Páginas de blog
import QueSonLasTerapiasHolisticas from "./pages/blog/QueSonLasTerapiasHolisticas";
import QueEsElYoga from "./pages/blog/QueEsElYoga";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/que-son-las-terapias-holisticas" element={<QueSonLasTerapiasHolisticas />} />
          <Route path="/blog/que-es-el-yoga" element={<QueEsElYoga />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/panel" element={<PanelTerapeuta />} />
          <Route path="/terapeuta/:id" element={<PerfilTerapeuta />} />
          <Route path="/servicios/:id" element={<ServicioDetalle />} />
          <Route path="/pago" element={<PaginaPagoSimple />} />
          
          {/* ✅ Agregadas rutas legales */}
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/gracias" element={<PaginaGracias />} />
<Route path="/pago-fallido" element={<PaginaPagoFallido />} />
<Route path="/pago-pendiente" element={<PaginaPagoPendiente />} />
          <Route path="/nuevo-servicio" element={<NuevoServicio />} />
          <Route path="/disponibilidad/:servicioId" element={<DisponibilidadServicio />} />
          <Route path="/editar-mis-servicios" element={<EditarMisServicios />} />
          <Route path="/editar-servicio/:servicioId" element={<EditarServicio />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Páginas principales
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Blog from "./pages/blog";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import PanelTerapeuta from "./components/PanelTerapeuta";
import PerfilTerapeuta from "./components/PerfilTerapeuta";
import ServicioDetalle from "./pages/ServicioDetalle";
import PaginaPagoSimple from "./pages/PaginaPagoSimple";
import Contacto from "./components/Contacto";
import AdminPagos from "./components/AdminPagos";

// Páginas legales
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import PaginaGracias from "./pages/PaginaGracias";
import PaginaPagoFallido from "./pages/PaginaPagoFallido";
import PaginaPagoPendiente from "./pages/PaginaPagoPendiente";
import TestRouter from "./pages/TestRouter";

// Administración y otras
import NuevoServicio from "./pages/NuevoServicio";
import DisponibilidadServicio from "./components/DisponibilidadServicio";
import EditarServicio from "./components/EditarServicio";
import AdminReservas from './components/AdminReservas';
import AdminTerapeutas from './pages/AdminTerapeutas';
import AdminComunicado from "./pages/AdminComunicado";
import AdminDashboard from "./pages/AdminDashboard";
import Tienda from "./pages/Tienda";
import ResenaPage from "./pages/ResenaPage";
// Blog
import QueSonLasTerapiasHolisticas from "./pages/blog/QueSonLasTerapiasHolisticas";
import QueEsElYoga from "./pages/blog/QueEsElYoga";

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/que-son-las-terapias-holisticas" element={<QueSonLasTerapiasHolisticas />} />
          <Route path="blog/que-es-el-yoga" element={<QueEsElYoga />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="panel" element={<PanelTerapeuta />} />
          <Route path="terapeuta/:id" element={<PerfilTerapeuta />} />
          <Route path="servicios/:slug" element={<ServicioDetalle />} />
          <Route path="resenas/:reservaId" element={<ResenaPage />} />
          <Route path="pago" element={<PaginaPagoSimple />} />
          <Route path="admin/reservas" element={<AdminReservas />} />
          <Route path="admin/terapeutas" element={<AdminTerapeutas />} />
          <Route path="admin/comunicado" element={<AdminComunicado />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="tienda" element={<Tienda />} />
          <Route path="terminos" element={<Terminos />} />
          <Route path="privacidad" element={<Privacidad />} />
          <Route path="gracias" element={<PaginaGracias />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="pago-fallido" element={<PaginaPagoFallido />} />
          <Route path="pago-pendiente" element={<PaginaPagoPendiente />} />
          <Route path="nuevo-servicio" element={<NuevoServicio />} />
          <Route path="/servicios/:slug" element={<TestRouter />} />
          <Route path="/disponibilidad/:servicioId" element={<DisponibilidadServicio />} />
          <Route path="/admin/pagos" element={<AdminPagos />} />
          <Route path="editar-servicio/:servicioId" element={<EditarServicio />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* Servicios */}
          <Route path="servicios" element={<Servicios />} />
          <Route path="servicios/:slug" element={<ServicioDetalle />} />
          <Route path="disponibilidad/:servicioId" element={<DisponibilidadServicio />} />

          {/* Blog */}
          <Route path="blog" element={<Blog />} />
          <Route path="blog/que-son-las-terapias-holisticas" element={<QueSonLasTerapiasHolisticas />} />
          <Route path="blog/que-es-el-yoga" element={<QueEsElYoga />} />

          {/* Usuarios */}
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="panel" element={<PanelTerapeuta />} />
          <Route path="terapeuta/:id" element={<PerfilTerapeuta />} />
          <Route path="resenas/:reservaId" element={<ResenaPage />} />
          <Route path="pago" element={<PaginaPagoSimple />} />
          <Route path="contacto" element={<Contacto />} />

          {/* Pagos */}
          <Route path="pago-fallido" element={<PaginaPagoFallido />} />
          <Route path="pago-pendiente" element={<PaginaPagoPendiente />} />
          <Route path="gracias" element={<PaginaGracias />} />

          {/* Administración */}
          <Route path="admin/reservas" element={<AdminReservas />} />
          <Route path="admin/terapeutas" element={<AdminTerapeutas />} />
          <Route path="admin/comunicado" element={<AdminComunicado />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/pagos" element={<AdminPagos />} />

          {/* Otros */}
          <Route path="tienda" element={<Tienda />} />
          <Route path="nuevo-servicio" element={<NuevoServicio />} />
          <Route path="editar-servicio/:servicioId" element={<EditarServicio />} />

          {/* Páginas legales */}
          <Route path="terminos" element={<Terminos />} />
          <Route path="privacidad" element={<Privacidad />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
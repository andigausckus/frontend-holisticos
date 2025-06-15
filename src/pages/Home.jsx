import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ComoFunciona from "../components/ComoFunciona";
import Categorias from "../components/Categorias";
import PorQueElegirnos from "../components/PorQueElegirnos";
import Contacto from "../components/Contacto";
import PreguntasFrecuentes from "../components/PreguntasFrecuentes";
import BlogCard from "../components/BlogCard";
import FrasesInspiradoras from "../components/FrasesInspiradoras";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Banner principal */}
      <section className="relative h-[500px] w-full">
        <img
          src="https://i.postimg.cc/GhtqNyk9/lotus-1205631-1280.jpg"
          alt="Banner terapias holísticas"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Contenedor común */}
      <div className="bg-[#ffffff] text-[#333333] px-6 md:px-12 py-14 max-w-screen-xl mx-auto">

        {/* Título principal */}
        <h1 className="text-2xl md:text-5xl font-bold mb-4 mt-6 max-w-4xl text-left">
          Bienvenidos al primer Marketplace de terapias holísticas de Argentina 🌿
        </h1>

        {/* Subtítulo */}
        <p className="text-sm md:text-base italic text-[#444444] mb-16 max-w-3xl text-left">
          🌸 Tu espacio de confianza para sanar y crecer.
        </p>

        {/* Sección para usuarios */}
        <section className="bg-[#f3e8c6] rounded-2xl p-8 mb-16">
          <h2 className="text-xl md:text-3xl font-semibold text-[#7F56D9] text-left">
            Conectá con tu bienestar
          </h2>
          <p className="mt-4 text-left text-[#333]">
            Este es tu espacio para encontrar calma, equilibrio y respuestas. Acá te esperan terapeutas que acompañan desde el corazón, para que puedas iniciar o continuar tu camino de sanación y crecimiento personal.
          </p>

          {/* Botón CTA */}
          <Link
            to="/servicios"
            className="mt-8 inline-block bg-[#c96a8c] text-white px-6 py-3 rounded-full hover:opacity-90 transition"
          >
            Ver servicios disponibles
          </Link>
        </section>

        {/* Sección para terapeutas */}
        <section className="bg-[#f5d7dd] rounded-2xl p-8 mb-16">
          <h2 className="text-xl md:text-3xl font-semibold text-[#7F56D9] text-left">
            Unite a nuestra comunidad
          </h2>
          <p className="mt-4 text-left text-[#333]">
            Llegá a nuevos consultantes, compartí tu vocación y formá parte de un espacio pensado para el crecimiento del bienestar integral.
          </p>

          <Link
            to="/registro"
            className="mt-10 inline-block bg-[#c96a8c] text-white px-6 py-3 rounded-full hover:opacity-90 transition"
          >
            Registrate como Terapeuta
          </Link>
        </section>

        {/* Componentes adicionales */}
        <ComoFunciona />
        <FrasesInspiradoras />
        <Categorias />
        <PorQueElegirnos />

        {/* Blog */}
        <section className="mt-20 mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#7F56D9] mb-6">
            Últimos artículos del Blog
          </h2>
          <BlogCard />
        </section>

        {/* FAQs y contacto */}
        <PreguntasFrecuentes />
        <Contacto />
      </div>
    </>
  );
}

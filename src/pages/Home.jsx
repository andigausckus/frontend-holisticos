import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

import Navbar from "../components/Navbar";
import ComoFunciona from "../components/ComoFunciona";
import Categorias from "../components/Categorias";
import PorQueElegirnos from "../components/PorQueElegirnos";
import Contacto from "../components/Contacto";
import PreguntasFrecuentes from "../components/PreguntasFrecuentes";
import BlogCard from "../components/BlogCard";
import FrasesInspiradoras from "../components/FrasesInspiradoras";

export default function Home() {
  const articulos = [
    {
      title: "¿Qué son las terapias holísticas?",
      summary:
        "Descubrí cómo cuerpo, mente y espíritu se conectan para lograr el equilibrio y bienestar en tu vida.",
      image: "https://i.postimg.cc/hv7yNh13/rocks-7354363-1280.jpg",
      link: "/blog/que-son-las-terapias-holisticas",
    },
    {
      title: "¿Qué es el Yoga?",
      summary:
        "Explorá los fundamentos del Yoga, sus beneficios y cómo puede ayudarte a encontrar bienestar integral en tu día a día.",
      image: "https://i.postimg.cc/x8FFQ86k/woman-2573216-1280.jpg",
      link: "/blog/que-es-el-yoga",
    },
  ];

  const [indice, setIndice] = useState(0);
  const intervaloRef = useRef(null);

  const siguiente = () => {
    setIndice((prev) => (prev + 1) % articulos.length);
  };

  const anterior = () => {
    setIndice((prev) => (prev - 1 + articulos.length) % articulos.length);
  };

  // Inicia el auto-slide
  const iniciarAutoSlide = () => {
    detenerAutoSlide();
    intervaloRef.current = setInterval(siguiente, 10000);
  };

  // Detiene el auto-slide
  const detenerAutoSlide = () => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
  };

  useEffect(() => {
    iniciarAutoSlide();
    return () => detenerAutoSlide();
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      siguiente();
      iniciarAutoSlide();
    },
    onSwipedRight: () => {
      anterior();
      iniciarAutoSlide();
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <>
      <Navbar />

      {/* Banner principal */}
      <section className="relative h-[400px] w-full">
        <img
          src="https://i.postimg.cc/6Qp1TdtM/incense-4720736-1280.jpg"
          alt="Banner terapias holísticas"


          className="w-full h-full object-cover"
        />
      </section>

      {/* Contenedor común */}
      <div className="text-[#444444] bg-white px-4 md:px-12 py-8 max-w-screen-xl mx-auto">
        {/* Título principal */}
        <h1 className="text-2xl md:text-5xl font-bold mb-4 max-w-4xl text-left">
          Marketplace de terapias holísticas en Argentina 🌿
        </h1>

        {/* Subtítulo */}
        <p className="text-sm md:text-base italic text-[#444444] mb-16 max-w-3xl text-left">
          🌸 Tu espacio de confianza para sanar y crecer.
        </p>

        {/* Sección para usuarios */}
        <section className="bg-[#faf3e1] rounded-2xl p-8 mb-16">
          <h2 className="text-xl md:text-3xl font-semibold text-[#7F56D9] text-left">
            Conectá con tu bienestar 
          </h2>
          <p className="mt-4 text-[#333]">
            Este es tu espacio para encontrar calma, equilibrio y respuestas. Acá te esperan terapeutas que acompañan desde el corazón, para que puedas iniciar o continuar tu camino de sanación y crecimiento personal.
          </p>

          {/* Botón CTA */}
          <div className="mt-8 flex justify-center items-center">
            <Link
              to="/servicios"
              className="bg-[#c96a8c] text-white px-6 py-3 rounded-full hover:opacity-90 transition"
            >
              Ver servicios disponibles
            </Link>
          </div>
        </section>

        {/* Sección para terapeutas */}
        <section className="bg-[#d6eaf7] rounded-2xl p-8 mb-16">
          <h2 className="text-xl md:text-3xl font-semibold text-[#7F56D9] text-left">
            Unite a nuestra comunidad 
          </h2>
          <p className="mt-4 text-left text-[#444]">
            Llegá a nuevos consultantes, compartí tu vocación y formá parte de un espacio pensado para el crecimiento del bienestar integral. Aquí podrás expandir tu red de contactos, mejorar tus habilidades y crecer profesionalmente.
          </p>

          <div className="mt-10 flex justify-center items-center">
            <Link
              to="/registro"
              className="bg-[#c96a8c] text-white px-6 py-3 rounded-full hover:opacity-90 transition"
            >
              Registrate como Terapeuta
            </Link>
          </div>
        </section>

        {/* Componentes adicionales */}
        <ComoFunciona />
        <FrasesInspiradoras />
        <Categorias />
        <PorQueElegirnos />

        {/* Blog slider */}
        <section
          {...handlers}
          onMouseDown={detenerAutoSlide}
          onMouseUp={iniciarAutoSlide}
          onTouchStart={detenerAutoSlide}
          onTouchEnd={iniciarAutoSlide}
          className="mt-20 w-full mb-16 max-w-4xl mx-auto overflow-hidden relative select-none"
        >
          <h2 className="text-xl text-center md:text-3xl font-semibold text-[#444444] mb-6">
            Últimos artículos del Blog
          </h2>

          {/* Contenedor de slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${indice * 100}%)` }}
          >
            {articulos.map((articulo, i) => (
              <div key={i} className="flex-shrink-0 w-full">
                <BlogCard {...articulo} />
              </div>
            ))}
          </div>

          {/* Botones manuales */}
          <button
            onClick={() => {
              anterior();
              iniciarAutoSlide();
            }}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-[#7F56D9] text-white p-2 rounded-full shadow hover:bg-[#633ab6] transition"
            aria-label="Anterior"
          >
            &#10094;
          </button>
          <button
            onClick={() => {
              siguiente();
              iniciarAutoSlide();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-[#7F56D9] text-white p-2 rounded-full shadow hover:bg-[#633ab6] transition"
            aria-label="Siguiente"
          >
            &#10095;
          </button>
        </section>

        {/* FAQs y contacto */}
        <PreguntasFrecuentes />
        <Contacto />
      </div>
    </>
  );
}
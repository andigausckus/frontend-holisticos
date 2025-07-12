import React from "react";
import BlogCard from "../../components/BlogCard";

export default function Blog() {
  return (
    <section className="bg-white px-6 md:px-12 py-12 mb-24 max-w-screen-xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold text-[#7F56D9] mb-24 pt-12 text-center">
        Artículos del Blog
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <BlogCard
          title="¿Qué son las terapias holísticas?"
          summary="Descubrí cómo cuerpo, mente y espíritu se conectan para lograr el equilibrio y bienestar en tu vida."
          image="https://i.postimg.cc/mDqm5fqc/rocks-7354363-1280.jpg"
          link="/blog/que-son-las-terapias-holisticas"
        />

        <BlogCard
          title="¿Qué es el Yoga?"
          summary="Explorá los fundamentos del Yoga, sus beneficios y cómo puede ayudarte a encontrar bienestar integral en tu día a día."
          image="https://i.postimg.cc/x8FFQ86k/woman-2573216-1280.jpg"
          link="/blog/que-es-el-yoga"
        />
      </div>
    </section>
  );
}
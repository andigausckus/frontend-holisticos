import React from "react";
import BlogCard from "../../components/BlogCard";

export default function Blog() {
  const posts = [
    {
      title: "¿Qué es una terapia holística?",
      summary:
        "Exploramos qué significa realmente la terapia holística, cómo funciona y por qué tantas personas la eligen hoy para su bienestar integral.",
      image: "https://i.postimg.cc/mDqm5fqc/rocks-7354363-1280.jpg",
      link: "/blog/que-es-una-terapia-holistica",
    },
  ];

  return (
    <main className="bg-[#f6f9fb] min-h-screen py-12 px-4">
      <div className="max-w-6xl pt-12 mx-auto">
        <h1 className="text-2xl font-bold text-[#333333] text-center mb-10">
          Publicaciones del Blog
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={index} {...post} />
          ))}
        </div>
      </div>
    </main>
  );
}
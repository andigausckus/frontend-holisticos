// src/components/BlogCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ title, summary, image, link }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 text-left">
        <h3 className="text-xl font-semibold text-[#333333] mb-2">{title}</h3>
        <p className="text-sm text-[#333333] mb-4">{summary}</p>
        <Link to={link} className="text-violet-700 font-semibold hover:underline">
          Leer más →
        </Link>
      </div>
    </div>
  );
}
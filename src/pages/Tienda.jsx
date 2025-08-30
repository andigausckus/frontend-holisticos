import { useState } from "react";
import Select from "react-select";

const estilosSelect = {
  control: (base) => ({
    ...base,
    borderRadius: "5px",
    borderColor: "#ccc",
    fontSize: "0.95rem",
    boxShadow: "none",
    "&:hover": { borderColor: "#FF9900" },
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? "#fde8cd" : "white",
    color: "#333",
  }),
  singleValue: (styles) => ({ ...styles, color: "#333" }),
};

export default function Tienda() {
  const [filtroTipoProducto, setFiltroTipoProducto] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [filtroModalidad, setFiltroModalidad] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState({ min: "", max: "" });

  const categoriasFisicas = [
    { value: "cuencos", label: "Cuencos" },
    { value: "saumerios", label: "Saumerios" },
    { value: "velas", label: "Velas" },
    { value: "hornillos", label: "Hornillos" },
    { value: "budas", label: "Budas" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const terapiasDigitales = [
    { value: "ansiedad", label: "Ansiedad" },
    { value: "aromaterapia", label: "Aromaterapia" },
    { value: "artesanal", label: "Artesanal" },
    { value: "ayurveda", label: "Ayurveda" },
    { value: "masaje", label: "Masaje" },
    { value: "meditacion", label: "Meditación" },
    { value: "mindfulness", label: "Mindfulness" },
    { value: "numerología", label: "Numerología" },
    { value: "reiki", label: "Reiki" },
    { value: "sanacion", label: "Sanación" },
    { value: "tarot", label: "Tarot" },
    { value: "yoga", label: "Yoga" },
    { value: "yogaPrenatal", label: "Yoga Prenatal" },
    
  ];

  const modalidades = [
    { value: "Ebook", label: "Ebook" },
  ];

  const productosDigitales = [
    {
      id: 1,
      titulo: "Curso de Yoga Prenatal",
      tipoProducto: "digital",
      descripcion:
        "El yoga prenatal es seguro y beneficioso para mujeres embarazadas y sus bebés, reduce el estrés y la ansiedad, mejora la flexibilidad y resistencia muscular, promueve un parto más fácil y humanizado. ¡Descubrí más y comenzá tu práctica hoy!",
      tipo: "Curso online",
      categoria: "yogaPrenatal",
      imagen: "https://i.postimg.cc/x1NRnyzs/pregnant-6189040-1280.jpg",
      enlace: "https://go.hotmart.com/B100719523M",
    },
    {
      id: 2,
      titulo: "67 posturas esenciales de Yoga",
      tipoProducto: "digital",
      descripcion:
        "Descubrí los beneficios del Yoga: mejora la flexibilidad, reduce el estrés, fortalece los músculos, mejora la postura, aumenta la concentración y promueve la relajación. ¡Comenzá tu práctica hoy y transforma tu bienestar!",
      tipo: "Ebook",
      categoria: "yoga",
      imagen: "https://i.postimg.cc/3JRZx82y/Yoga67P.png",
      enlace: "https://go.hotmart.com/U100730139R", 
    },
    {
  id: 3,
  titulo: "Curso Masajista Master",
  tipoProducto: "digital",
  descripcion:
    "Aprendé técnicas profesionales de masaje y emprendé en estética con un curso online que incluye acceso vitalicio, comunidad privada, 4 bonos y certificado. ¡Inscríbete ahora y comenzá a transformar tu carrera sin riesgos, con 7 días de garantía!",
  tipo: "Curso online",
  categoria: "masajes",
  imagen: "https://i.postimg.cc/pLBH89jG/massage-2717431-1280.jpg",
  enlace: "https://go.hotmart.com/M100731243R",
  descuento: "Aprovechá 50% OFF por tiempo limitado!",
},
{
  id: 4,
  titulo: "Secretos de la medicina Ayurvedica",
  tipoProducto: "digital",
  descripcion:
    "La medicina ayurvédica ofrece una perspectiva integral sobre la salud mental, con 50 recetas para promover el equilibrio doshico y la armonía interior. ¡Descubrí tu equilibrio interior hoy y comenzá a vivir en armonía con la naturaleza!",
  tipo: "Ebook",
  categoria: "ayurveda",
  imagen: "https://i.postimg.cc/K8vL26jc/cook-2364221-640.jpg",
  enlace: "https://go.hotmart.com/X100735838H?ap=b245",
  descuento: "Aprovechá 20% OFF por tiempo limitado!",
},
    {
  id: 5,
  titulo: "Numerología",
  tipoProducto: "digital",
  descripcion:
    "¡Descubre el fascinante mundo de la numerología con este eBook completo de 193 páginas! Aprende sobre numerología pitagórica, vibraciones numéricas, personalidad, karma y más. ¡Haz clic y empezá a explorar tu destino!",
  tipo: "Ebook",
  categoria: "numerología",
  imagen: "https://i.postimg.cc/dDcY9jyL/clock-1274699-1280.jpg",
  enlace: "https://go.hotmart.com/J100759393X",
},
    {
  id: 6,
  titulo: "Elimina los Síntomas Físicos de la Ansiedad",
  tipoProducto: "digital",
  descripcion:
    "La guía ofrece beneficios como comprender y aliviar síntomas físicos de ansiedad, técnicas prácticas para manejar crisis, autoconfianza para enfrentar desencadenantes y gestionar la ansiedad de forma autónoma y vivir una vida más tranquila. ¡Descubrelo hoy mismo!",
  tipo: "Ebook",
  categoria: "ansiedad",
  imagen: "https://i.postimg.cc/PrfsdJMG/stress-2902537-640.jpg",
  enlace: "https://go.hotmart.com/Q100799298D",
      descuento: "Aprovechá 66% OFF por tiempo limitado!",
    },
        {
    id: 7,
  titulo: "400 recetas de jabones, velas, cosmética natural (shampoo y cremas) y Aromaterapia",
  tipoProducto: "digital",
  descripcion:
          "Descubre el secreto para crear y vender productos artesanales rentables desde casa con más de 400 recetas prácticas. ¡Descárgalo ahora y comienza a generar ingresos reales! ¿Estás listo para empezar?",
  tipo: "Ebook",
  categoria: "artesanal",
  imagen: "https://i.postimg.cc/PqSSHbT9/soaps-2958985-640.jpg",
  enlace: "https://go.hotmart.com/W100800796D",
    },
    {
    id: 8,
  titulo: "Curso de Tarot Arcanos Mayores",
  tipoProducto: "digital",
  descripcion:
          "¡Descubre el Tarot con 4 módulos, certificado, clases bonus y prácticas! Accede ahora y domina nuevas herramientas espirituales para tu crecimiento personal. ¡Inscríbete ya y comienza a leer el futuro con confianza!",
  tipo: "Ebook",
  categoria: "tarot",
  imagen: "https://i.postimg.cc/RFn2BqTL/fortune-telling-4896472-640.jpg",
  enlace: "https://go.hotmart.com/I101025528T",
    },
    {
    id: 9,
  titulo: "MEGA PACK Aromaterapia - Medicina alternativa",
  tipoProducto: "digital",
  descripcion:
          "¡Descubre los secretos de la aromaterapia! Aprende a preparar recetas naturales para el bienestar físico, mental y emocional. ¡Descarga ahora el eBook y recibe 9 bonus exclusivos! ¡Transforma tu vida con el poder de los aceites esenciales de manera sencilla y natural!",
  tipo: "Ebook",
  categoria: "aromaterapia",
  imagen: "https://i.postimg.cc/MK4PWzvs/Screenshot-20250725-195215-Chrome.jpg",
  enlace: "https://go.hotmart.com/L101026046N",
    },
  ];

  const categorias = filtroTipoProducto?.value === "digital" ? terapiasDigitales : categoriasFisicas;
  const mostrarModalidad = filtroTipoProducto?.value === "digital";

  const productosFiltrados = productosDigitales.filter((producto) => {
    try {
      const coincideTipo = !filtroTipoProducto || producto.tipoProducto === filtroTipoProducto.value;
      
      const coincideCategoria = !filtroCategoria || producto.categoria === filtroCategoria.value;
      
      const coincideModalidad = true;
      
      
      return coincideTipo && coincideCategoria && coincideModalidad;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  return (
    <div className="pt-24 min-h-screen bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-500 mb-2">
          Tienda Holística 🌿
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Descubrí productos físicos y digitales que complementan tu práctica holística diaria.
        </p>

        {/* Filtros */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
  <Select
    placeholder="Tipo de producto"
    options={[
      { value: "digital", label: "Producto digital" },
      { value: "fisico", label: "Producto físico" },
    ]}
    value={filtroTipoProducto}
    onChange={setFiltroTipoProducto}
    isClearable
    styles={estilosSelect}
  />
  <Select
    placeholder="Categoría"
    options={categorias}
    value={filtroCategoria}
    onChange={setFiltroCategoria}
    styles={estilosSelect}
    isClearable
  />
  
  {filtroTipoProducto?.value === "fisico" && (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        placeholder="Mínimo ($)"
        className="w-full border border-gray-300 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:border-orange-400 hover:border-orange-400 transition"
        value={filtroPrecio.min}
        onChange={(e) => setFiltroPrecio({ ...filtroPrecio, min: e.target.value })}
      />
      <input
        type="number"
        placeholder="Máximo ($)"
        className="w-full border border-gray-300 rounded-[5px] px-3 py-2 text-sm focus:outline-none focus:border-orange-400 hover:border-orange-400 transition"
        value={filtroPrecio.max}
        onChange={(e) => setFiltroPrecio({ ...filtroPrecio, max: e.target.value })}
      />
    </div>
  )}
</div>

        {/* Lista de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-12 max-w-full mx-auto">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-white shadow-md border border-gray-200 rounded-[5px] overflow-hidden flex flex-col"
            >
              <img
                src={producto.imagen}
                alt={producto.titulo}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 space-y-1 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#333] mb-1">
                    {producto.titulo}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-[5px] inline-block">
                      Ebook
                    </span>
                    {producto.descuento && (
                      <span className="text-sm text-green-600 font-medium">
                        {producto.descuento}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 h-32 overflow-hidden">
                  {producto.descripcion}
                </p>

              </div>
              <div className="p-4 border-t border-gray-200">
                <a
                  href={producto.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-600 text-white px-6 py-2 rounded-[5px] hover:bg-orange-700 transition w-full text-center"
                >
                  Más información
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
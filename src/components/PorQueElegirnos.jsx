export default function PorQueElegirnos() {
  const motivos = [
    {
      titulo: "Terapeutas Verificados",
      descripcion: "Todos los profesionales son evaluados cuidadosamente para garantizar confianza y calidad en cada sesión.",
      emoji: "🛡️",
    },
    {
      titulo: "Comunidad Holística",
      descripcion: "Unite a una comunidad que valora el bienestar integral y el crecimiento personal.",
      emoji: "👥",
    },
    {
      titulo: "Pagos Seguros con Mercado Pago",
      descripcion: "Pagá tus sesiones online a traves de Mercado Pago de forma simple, rápiday segura.",
      emoji: "💳",
    },
    {
      titulo: "Atención Personalizada",
      descripcion: "Explorá diferentes terapias y conectá con profesionales que se ajusten a tu estilo, tus tiempos y tu forma preferida de comunicarte.",
      emoji: "💜",
    },
  ];

  return (
    <section className="py-12 px-4 rounded-xl :px-8 lg:px-16 bg-[#d9eee4]">
      <h2 className="text-xl font-bold text-[#444444] mb-10 text-center">
        ¿Por qué elegirnos?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-screen-md mx-auto text-left">
        {motivos.map((item) => (
          <div
            key={item.titulo}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex gap-4 items-start"
          >
            <div className="text-2xl">{item.emoji}</div>
            <div>
              <h3 className="text-base font-semibold text-[#6b21a8]">{item.titulo}</h3>
              <p className="text-[#333] text-base mt-1">{item.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
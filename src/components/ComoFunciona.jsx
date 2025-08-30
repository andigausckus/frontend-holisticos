export default function ComoFunciona() {
  return (
    <section className="bg-[#fae6eb] rounded-xl py-20 px-4" id="como-funciona">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-xl md:text-4xl font-bold text-[#444444] mb-10">¿Cómo funciona? </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Paso 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2 text-[#7f56d9]">Explorá terapias</h3>
            <p className="text-[#555]">
              Explorá nuestra plataforma y descubrí diferentes tipos de terapias holísticas. Buscá por categorías, duración de sesiones online y precio para encontrar la sesión perfecto para vos.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center text-4xl mb-4">💡</div>
            <h3 className="text-lg font-semibold mb-2 text-[#7F56D9]">Descubrí tu opción ideal</h3>
            <p className="text-[#555]">
              Encontrá al terapeuta adecuado para vos. Leé las descripciones, mirá las reseñas de quienes ya tomaron sus sesiones online, y revisá los perfiles para conocer mejor a nuestros profesionales."
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2 text-[#7F56D9]">Reservá tu sesión</h3>
            <p className="text-[#555]">
              Elegí el día y la hora ideal para tu sesión. Nuestra plataforma te permite ver la disponibilidad del terapeuta y reservar con solo unos pasos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function ComoFunciona() {
  return (
    <section className="bg-[#a3cbe3] rounded-xl py-20 px-4" id="como-funciona">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-[#333333] mb-10">¿Cómo funciona?</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Paso 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2 text-[#7f56d9]">Explorá terapias</h3>
            <p className="text-[#555]">
              Descubrí diferentes tipos de terapias holísticas y conocé a los terapeutas disponibles.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center text-4xl mb-4">💡</div>
            <h3 className="text-lg font-semibold mb-2 text-[#7F56D9]">Elegí lo que necesitás</h3>
            <p className="text-[#555]">
              Leé las descripciones, modalidades y especialidades para encontrar la mejor opción para vos.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2 text-[#7F56D9]">Reservá tu sesión</h3>
            <p className="text-[#555]">
              Coordiná directamente con el terapeuta la fecha y modalidad. ¡Así de fácil!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
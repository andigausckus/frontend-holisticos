import { useState, useRef } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const opcionesBancos = [
  { value: "Mercado Pago", label: "Mercado Pago" },
  { value: "Ualá", label: "Ualá" },
  { value: "Naranja X", label: "Naranja X" },
  { value: "Brubank", label: "Brubank" },
  { value: "Banco Nación", label: "Banco Nación" },
  { value: "Banco Provincia", label: "Banco Provincia" },
  { value: "Banco Galicia", label: "Banco Galicia" },
  { value: "Banco Santander", label: "Banco Santander" },
  { value: "Banco BBVA", label: "Banco BBVA" },
  { value: "Banco Macro", label: "Banco Macro" },
];

export default function RegistroTerapeuta() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    whatsapp: "",
    ubicacion: "",
    cbuCvu: "",
    bancoOBilletera: "",
  });

  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null); // referencia al formulario

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (opcion) => {
    setFormData({ ...formData, bancoOBilletera: opcion?.value || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch(
        "https://servicios-holisticos-backend.onrender.com/api/terapeutas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMensaje(
          "🌟 ¡Registro exitoso! Bienvenido/a a Servicios Holísticos. Ya podés iniciar sesión y empezar a ofrecer tus terapias."
        );
        setTimeout(() => {
          navigate("/login");
        }, 5000);

        setFormData({
          nombreCompleto: "",
          email: "",
          password: "",
          especialidades: "",
          whatsapp: "",
          ubicacion: "",
          cbuCvu: "",
          bancoOBilletera: "",
        });
      } else {
        const error = await response.json();
        setMensaje("❌ Error: " + (error.message || "Intenta de nuevo."));
      }
    } catch (err) {
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 🔹 Sección introductoria */}
      <div className="max-w-4xl mx-auto text-center pt-24 px-6">

        <h2 className="text-xl font-normal text-center text-gray-800 mb-4">
          🐣 Publicá tus servicios y sé parte de nuestra comunidad
        </h2>
        
        <h2 className="text-md font-medium text-[#333] mb-6">
          ¿Cómo funciona? Muy fácil
        </h2>

        <div className="text-left space-y-2 text-[#333]">
          <p>👉 Te registrás como terapeuta</p>
          <p>👉 Subís tus servicios y la disponibilidad horaria</p>
          <p>👉 Los usuarios reservan una sesión para el día y la hora elegida</p>
          <p>👉 Recibís por email la confirmación de nueva reserva</p>
          <p>👉 Te enviamos el dinero de tu sesión</p>
        </div>

        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white text-sm text-[#333] shadow-sm">
          Pagás solo el <strong>10%</strong> del valor de cada sesión. <br />
          Si no tenés sesiones, no pagás nada. <br />
          ¡Así de fácil y simple para vos!
        </div>

        {/* Botón que hace scroll al formulario */}
        <button
          onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="mt-8 bg-pink-400 text-white py-2 px-6 rounded-3xl hover:bg-pink-500 transition"
        >
          Registrarme ahora
        </button>
      </div>

      {/* 🔹 Formulario */}
      <div ref={formRef} className="bg-white pt-24 max-w-full mx-auto p-8 rounded-xl mt-20">
        

        {mensaje && (
          <p className="mb-2 text-sm text-center text-red-600">{mensaje}</p>
        )}

          <form 
            onSubmit={handleSubmit} 
            className="space-y-4 w-full max-w-2xl mt-6 mx-auto mb-32 px-2"
          >
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            placeholder="Nombre y apellido o empresa"
            className="w-full p-2 border border-[#444444] rounded-lg outline-none"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full p-2 border border-[#444444] rounded-lg outline-none"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full p-2 border border-[#444444] rounded-lg outline-none"
            required
          />

          <input
            type="tel"
            inputMode="numeric"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="Teléfono (sin el 15)"
            className="w-full p-2 border border-[#444444] rounded-lg outline-none mt-4"
            required
            maxLength={10}
          />

          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ubicación (ciudad)"
            className="w-full p-2 border border-[#444444] rounded-lg outline-none"
            required
          />

          {/* 💸 Datos bancarios */}
          <div className="pt-8 border-t border-gray-300 mt-8">
            <h3 className="text-md font-semibold mb-2 text-[#333]">
              💰 Datos para transferirte tu dinero
            </h3>
            

            <input
              type="text"
              name="cbuCvu"
              value={formData.cbuCvu}
              onChange={handleChange}
              placeholder="CBU / CVU (sin espacios)"
              className="w-full p-2 border border-[#444444] rounded-lg outline-none"
              required
              maxLength={22}
              minLength={22}
            />

            <div className="mt-4 mb-4">
              <Select
                options={opcionesBancos}
                placeholder="Banco o billetera virtual"
                value={opcionesBancos.find(
                  (op) => op.value === formData.bancoOBilletera
                )}
                onChange={handleSelectChange}
                className="text-[#333]"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#ffffff",
                    borderColor: "#444444",
                    borderRadius: "0.5rem",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#444444",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#ffffff",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor:
                      state.isFocused || state.isSelected
                        ? "#f3e8ff"
                        : "#ffffff",
                    color: "#333333",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="block mx-auto text-center mt-10 bg-pink-400 text-white py-2 px-6 min-w-max rounded-3xl hover:bg-pink-600 transition"
          >
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
}
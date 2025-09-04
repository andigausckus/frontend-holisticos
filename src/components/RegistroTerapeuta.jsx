import { useState } from "react";
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
    setMensaje("🌟 ¡Registro exitoso! Bienvenido/a a Servicios Holísticos. Ya podés iniciar sesión y empezar a ofrecer tus terapias.");  
    setTimeout(() => {

navigate("/login"); // o la ruta de tu pantalla de login
}, 5000); // espera 5 segundos
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
<div className="bg-white pt-24 max-w-full mx-auto p-8 rounded-xl">
<h2 className="text-xl font-normal text-center text-gray-800 mb-4">
🐣 Publicá tus servicios y sé parte de nuestra comunidad 
</h2>

{mensaje && (  
    <p className="mb-2 text-sm text-center text-red-600">{mensaje}</p>  
  )}  

  <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mt-6 mx-auto mb-32">  
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

    {/* 💸 Datos para transferencias */}  
    <div className="pt-8 border-t border-gray-300 mt-8">  
      <h3 className="text-md font-semibold mb-2 text-[#333]">  
        💰 Datos para transferirte tu dinero  
      </h3>  
      <p className="text-sm text-gray-600 mb-4">  
        Te enviamos el <strong>90%</strong> del valor de cada sesión. El <strong>10%</strong> es comisión por el uso de nuestra plataforma.   
      </p>  

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
              backgroundColor: "#ffffff", // blanco  
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
              backgroundColor: state.isFocused || state.isSelected ? "#f3e8ff" : "#ffffff", // lila suave  
              color: "#333333",  
              cursor: "pointer",  
            }),  
          }}  
        />  
      </div>  
    </div>  

    <button  
      type="submit"  
      className="block mx-auto text-center mt-10 bg-pink-500 text-white py-2 px-6 min-w-max rounded-xl hover:bg-pink-600 transition"  
    >  
      Registrarme  
    </button>  
  </form>  
</div>

);
}

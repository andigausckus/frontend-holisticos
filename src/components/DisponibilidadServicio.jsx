import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

function obtenerSemanaActual() {
const hoy = new Date();
const dia = hoy.getDay();
const diferenciaAlLunes = dia === 0 ? -6 : 1 - dia;
const lunes = new Date(hoy);
lunes.setDate(hoy.getDate() + diferenciaAlLunes);
lunes.setHours(0, 0, 0, 0);

const dias = [];
for (let i = 0; i < 7; i++) {
const fecha = new Date(lunes);
fecha.setDate(lunes.getDate() + i);
dias.push({
fecha,
rangos: [],
nuevoDesde: "",
nuevoHasta: "",
});
}
return dias;
}

export default function DisponibilidadServicio() {
const [semana, setSemana] = useState([]);
const [guardando, setGuardando] = useState(false);
const [servicio, setServicio] = useState(null);

const navigate = useNavigate();
const { servicioId } = useParams();
const location = useLocation();
const servicioTemp = location.state?.servicioTemp || null;

  // 🔹 Cargar servicio
  useEffect(() => {
    if (!servicioId) {
      console.error("❌ servicioId es undefined, redirigiendo");
      navigate("/panel");
      return;
    }

    const cargarServicio = async () => {
      try {
        const token = localStorage.getItem("token");

        if (servicioTemp) {
          setServicio(servicioTemp);
        } else {
          const { data } = await axios.get(
            `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setServicio(data);
        }
      } catch (error) {
        console.error("❌ Error al obtener servicio:", error);
        navigate("/panel");
      }
    };

    cargarServicio();
  }, [servicioId, servicioTemp, navigate]);

// 🔹 Mapear horarios existentes
useEffect(() => {
if (servicio) {
const semanaBase = obtenerSemanaActual();

const semanaConHorarios = semanaBase.map((dia) => {
const diaExistente = servicio.horariosDisponibles?.find(
(d) => d.fecha === dia.fecha.toISOString().split("T")[0]
);
return {
...dia,
rangos: diaExistente ? diaExistente.horariosFijos : [],
};
});

setSemana(semanaConHorarios);
}

}, [servicio]);

// 🔹 Funciones de edición
const agregarRango = (index) => {
const { nuevoDesde, nuevoHasta } = semana[index];
if (!nuevoDesde || !nuevoHasta) return;

const copia = [...semana];
copia[index].rangos.push({ desde: nuevoDesde, hasta: nuevoHasta });
copia[index].nuevoDesde = "";
copia[index].nuevoHasta = "";
setSemana(copia);

};

const eliminarRango = (diaIndex, rangoIndex) => {
const copia = [...semana];
copia[diaIndex].rangos.splice(rangoIndex, 1);
setSemana(copia);
};

const aplicarAlResto = () => {
const lunes = semana[0].rangos;
const copia = [...semana];
for (let i = 1; i < 7; i++) {
copia[i].rangos = [...lunes];
}
setSemana(copia);
};

// 🔹 Guardar servicio y disponibilidad
const guardar = async () => {
setGuardando(true);

try {
const token = localStorage.getItem("token");
if (!token) return navigate("/login");

// Formatear disponibilidad
const disponibilidadFiltrada = semana
.map((d) => {
const rangosValidos = d.rangos.filter(
(r) =>
/^([01]\d|2[0-3]):[0-5]\d$/.test(r.desde) &&
/^([01]\d|2[0-3]):[0-5]\d$/.test(r.hasta)
);
if (rangosValidos.length === 0) return null;

return {    
    fecha:    
      d.fecha.getFullYear() +    
      "-" +    
      String(d.fecha.getMonth() + 1).padStart(2, "0") +    
      "-" +    
      String(d.fecha.getDate()).padStart(2, "0"),    
    horariosFijos: rangosValidos,    
  };    
})    
.filter(Boolean);

  let servicioGuardado;

  if (!servicio._id) {
    // Crear nuevo servicio
    const res = await axios.post(
      "https://servicios-holisticos-backend.onrender.com/api/servicios",
      {
        titulo: servicio.titulo,
        descripcion: servicio.descripcion,
        modalidad: servicio.modalidad,
        duracionMinutos: servicio.duracionMinutos,
        precio: servicio.precio,
        categoria: servicio.categoria,
        imagen: servicio.imagen || "",
        plataformas: servicio.plataformas || [],
        aprobado: false,
        terapeuta: idDelTerapeuta, // <- aquí asegurate de tener esta variable definida
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    servicioGuardado = res.data;
  } else {
    // Editar servicio existente
    await axios.put(
      `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicio._id}`,
      {
        titulo: servicio.titulo,
        descripcion: servicio.descripcion,
        modalidad: servicio.modalidad,
        duracionMinutos: servicio.duracionMinutos,
        precio: servicio.precio,
        categoria: servicio.categoria,
        imagen: servicio.imagen || "",
        plataformas: servicio.plataformas || [],
        aprobado: false,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    servicioGuardado = { _id: servicio._id };
  }

  console.log("📌 servicioGuardado:", servicioGuardado);
  console.log("📌 servicioGuardado._id:", servicioGuardado?._id);

  // Guardar horarios
  await axios.put(
    `https://servicios-holisticos-backend.onrender.com/api/servicios/${servicioGuardado._id}/horarios`,
    { horarios: disponibilidadFiltrada },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  console.log("✅ Servicio y horarios guardados correctamente");
  navigate("/panel");
  
  } catch (error) {
    console.error("❌ Error al guardar disponibilidad:", error);
    if (error.response?.data) {
      alert(
        `❌ Error al guardar: ${error.response.data.error || "Error desconocido"}`
      );
    } else {
      alert("❌ Error inesperado al guardar disponibilidad");
    }
  } finally {
    setGuardando(false);
  }

};

if (!servicio) return <p>Cargando servicio...</p>;

return (
<div className="bg-white p-4 pt-24 max-w-xl mx-auto">
<h2 className="text-2xl font-normal text-center text-[#444] mb-2">
Disponibilidad horaria 🗓️
</h2>
<div className="bg-gray-100 p-3 rounded-md text-sm text-gray-600 text-center mb-6">
Si aceptás sesiones fuera de la plataforma, te recomendamos eliminar el horario correspondiente para evitar conflictos con reservas en tus horarios cargados.
</div>

  <div className="grid grid-cols-2 gap-3 mb-12">  {semana.map((dia, index) => (

<div key={index} className="border rounded-xl p-2">  
<div className="text-sm font-semibold text-[#333] text-center mb-2">  
{dia.fecha.toLocaleDateString("es-AR", {  
weekday: "long",  
day: "numeric",  
month: "numeric",  
})}  
</div>  {dia.rangos.length > 0 ? (
<ul className="mb-2 text-sm text-[#333]">
{dia.rangos.map((r, i) => (
<li key={i} className="flex justify-between items-center">
{r.desde} - {r.hasta}
<button
onClick={() => eliminarRango(index, i)}
className="text-red-500 text-xs ml-2"
>
Eliminar
</button>
</li>
))}
</ul>
) : (
<p className="text-xs text-gray-500 text-center mb-2">
Sin horarios cargados
</p>
)}

{(dia.nuevoDesde || dia.nuevoHasta) && !dia.rangos.find(r => r.desde === dia.nuevoDesde && r.hasta === dia.nuevoHasta) && (
<p className="text-xs text-white bg-orange-500 text-center mb-2 p-1 rounded">
Agregá este horario para continuar
</p>

)}

  <div className="flex gap-1 mb-2">    
    <input    
      type="tel"    
      placeholder="__:__"    
      inputMode="numeric"    
      pattern="[0-9]{2}:[0-9]{2}"    
      maxLength={5}    
      value={dia.nuevoDesde}    
      onChange={(e) => {    
        let valor = e.target.value.replace(/[^0-9]/g, "");    
        if (valor.length >= 3) valor = valor.slice(0, 2) + ":" + valor.slice(2, 4);    
        const copia = [...semana];    
        copia[index].nuevoDesde = valor.slice(0, 5);    
        setSemana(copia);    
      }}    
      className="border rounded px-2 py-1 text-sm w-full text-center"    
    />    
    <input    
      type="tel"    
      placeholder="__:__"    
      inputMode="numeric"    
      pattern="[0-9]{2}:[0-9]{2}"    
      maxLength={5}    
      value={dia.nuevoHasta}    
      onChange={(e) => {    
        let valor = e.target.value.replace(/[^0-9]/g, "");    
        if (valor.length >= 3) valor = valor.slice(0, 2) + ":" + valor.slice(2, 4);    
        const copia = [...semana];    
        copia[index].nuevoHasta = valor.slice(0, 5);    
        setSemana(copia);    
      }}    
      className="border rounded px-2 py-1 text-sm w-full text-center"    
    />    
  </div>    <button
onClick={() => agregarRango(index)}
className="bg-pink-400 text-white px-3 py-1 rounded-full text-xs w-full"

> 

+ Agregar horario

  </button>    {index === 0 && (
<button    
onClick={aplicarAlResto}    
className="text-[11px] text-blue-600 mt-2 underline block text-center"    
>
Aplicar estos horarios a toda la semana
</button>
)}

</div>  ))}

</div>  <button  
onClick={guardar}  
disabled={guardando}  
className="mb-24 bg-violet-500 text-white block mx-auto px-3 py-2 rounded-full"  > 

{guardando ? "Guardando..." : "Guardar servicio"}
</button>

</div>  
);  
}
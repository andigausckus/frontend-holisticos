import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contacto() {
  const form = useRef();
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(false);
  const [errores, setErrores] = useState({});

  const validarCampos = () => {
    const campos = new FormData(form.current);
    const nombre = campos.get("from_name")?.trim();
    const email = campos.get("from_email")?.trim();
    const mensaje = campos.get("message")?.trim();

    const nuevosErrores = {};

    if (!nombre) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!email) {
      nuevosErrores.email = "El email es obligatorio.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      nuevosErrores.email = "El email no es válido.";
    }
    if (!mensaje) nuevosErrores.mensaje = "El mensaje es obligatorio.";

    return nuevosErrores;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const erroresValidacion = validarCampos();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    emailjs
      .sendForm(
        "service_bnnzebb",
        "template_sejvcqo",
        form.current,
        "bPyuluLbPnsrzdGQz"
      )
      .then(() => {
        setMensajeEnviado(true);
        setErrorEnvio(false);
        setErrores({});
        form.current.reset();
      })
      .catch((error) => {
        console.error("❌ Error al enviar:", error.text);
        setErrorEnvio(true);
      });
  };

  return (
    <section className="bg-[#F4F0FA] rounded-3xl mb-24 pt-12 pb-6 px-6 md:px-12 max-w-6xl mx-auto">
      <h2 className="text-xl md:text-3xl font-semibold text-[#333333] mb-6 text-center">
        Contáctanos
      </h2>

      {mensajeEnviado && (
        <div className="mb-4 text-green-600 text-center font-medium">
          ✅ Tu mensaje fue enviado.
        </div>
      )}

      {errorEnvio && (
        <div className="mb-4 text-red-600 text-center font-medium">
          ❌ Hubo un error al enviar tu mensaje. Por favor, intentá nuevamente.
        </div>
      )}

      <form
        ref={form}
        onSubmit={sendEmail}
        className="grid grid-cols-1 gap-6 bg-white p-8 rounded-2xl shadow-md"
      >
        <div>
          <input
            type="text"
            name="from_name"
            placeholder="Nombre"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-[#BCA8F9]"
          />
          {errores.nombre && (
            <p className="text-sm text-red-600 mt-1">{errores.nombre}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="from_email"
            placeholder="Correo electrónico"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-[#BCA8F9]"
          />
          {errores.email && (
            <p className="text-sm text-red-600 mt-1">{errores.email}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="subject"
            placeholder="Asunto"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-[#BCA8F9]"
          />
        </div>

        <div>
          <textarea
            name="message"
            rows="5"
            placeholder="Mensaje"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none outline-none focus:ring-1 focus:ring-[#BCA8F9]"
          ></textarea>
          {errores.mensaje && (
            <p className="text-sm text-red-600 mt-1">{errores.mensaje}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-violet-500 text-white px-4 py-3 rounded-3xl hover:bg-violet-600 transition w-fit mx-auto"
        >
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}
import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Contacto() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_bnnzebb",
        "template_sejvcqo",
        form.current,
        "bPyuluLbPnsrzdGQz"
      )
      .then(
        (result) => {
          console.log("Mensaje enviado", result.text);
        },
        (error) => {
          console.log("Error al enviar", error.text);
        }
      );
  };

  return (
    <section className="bg-[#F4F0FA] py-12 rounded-3xl px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-3xl font-semibold text-[#333333] mb-6 text-center">
        Contáctanos
      </h2>
      <form
        ref={form}
        onSubmit={sendEmail}
        className="grid grid-cols-1 gap-6 bg-white p-8 rounded-2xl shadow-md"
      >
        <div>
          <input
            type="text"
            name="from_name"
            placeholder="Nombre completo"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-[#BCA8F9]"
          />
        </div>
        <div>
          <input
            type="email"
            name="from_email"
            placeholder="Correo electrónico"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-[#BCA8F9]"
          />
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
            required
            placeholder="Escribe tu mensaje aquí"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none outline-none focus:ring-1 focus:ring-[#BCA8F9]"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-violet-500 text-white px-6 py-3 rounded-3xl hover:bg-violet-600"
        >
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}
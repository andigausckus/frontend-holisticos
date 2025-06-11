import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Contacto() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_bnnzebb",         // ✅ Tu Service ID
      "template_sejvcqo",        // ✅ Tu Template ID
      form.current,
      "bPyuluLbPnsrzdGQz"        // ✅ Tu Public Key
    )
    .then(() => {
      alert("✅ ¡Mensaje enviado con éxito!");
      form.current.reset();
    })
    .catch((error) => {
      console.error("Error al enviar:", error);
      alert("❌ Error al enviar el mensaje.");
    });
  };

  return (
    <section id="contacto" className="bg-[#EFE9FB] rounded-xl py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#333333] text-center mb-8">
          Contáctanos
        </h2>
        <form ref={form} onSubmit={sendEmail} className="grid grid-cols-1 gap-6 bg-white p-8 rounded-2xl shadow-md">
          <div>
            <label className="block text-[#333333] font-medium mb-1">
              Nombre completo
            </label>
            <input type="text" name="from_name" required className="w-full border rounded-xl px-4 py-2" />
          </div>
          <div>
            <label className="block text-[#333333] font-medium mb-1">
              Correo electrónico
            </label>
            <input type="email" name="from_email" required className="w-full border rounded-xl px-4 py-2" />
          </div>
          <div>
            <label className="block text-[#333333] font-medium mb-1">
              Asunto
            </label>
            <input type="text" name="subject" className="w-full border rounded-xl px-4 py-2" />
          </div>
          <div>
            <label className="block text-[#333333] font-medium mb-1">
              Mensaje
            </label>
            <textarea name="message" rows="5" required className="w-full border rounded-xl px-4 py-2 resize-none"></textarea>
          </div>
          <button type="submit" className="bg-violet-500 text-white px-6 py-3 rounded-3xl hover:bg-violet-600">
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
}
import React from "react";

export default function Privacidad() {
  return (
    <div className="bg-white max-w-4xl pt-24 mx-auto px-6 py-12 text-[#333]">
      <h1 className="text-2xl text-center font-semibold text-[#7F56D9] mb-6">
        Política de Privacidad
      </h1>

      <p className="mb-4 text-base">
        En Servicios Holísticos, valoramos tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal al interactuar con nuestra plataforma.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. Datos que recopilamos</h2>
      <p className="mb-4 text-sm">
        Recopilamos datos como nombre, correo electrónico, ubicación, especialidades (en caso de terapeutas), información de reservas y preferencias de uso, con el fin de brindar un mejor servicio.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">2. Uso de la información</h2>
      <p className="mb-4 text-sm">
        Utilizamos los datos para gestionar cuentas, mostrar perfiles profesionales, facilitar reservas, emitir notificaciones y mejorar la experiencia del usuario. No compartimos tus datos con terceros sin tu consentimiento expreso.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. Seguridad</h2>
      <p className="mb-4 text-sm">
        Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos. Aunque trabajamos con altos estándares de seguridad, ninguna transmisión en línea es 100% segura.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. Derechos del usuario</h2>
      <p className="mb-4 text-sm">
        Tenés derecho a acceder, modificar o eliminar tus datos personales. También podés solicitar la limitación del tratamiento o ejercer tu derecho de oposición escribiéndonos mediante el formulario de contacto.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. Cookies</h2>
      <p className="mb-4 text-sm">
        Usamos cookies para mejorar la navegación, personalizar contenido y analizar el tráfico del sitio. Podés gestionar tus preferencias de cookies desde tu navegador.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">6. Modificaciones</h2>
      <p className="mb-4 text-sm">
        Esta política puede ser modificada en cualquier momento. Te sugerimos revisarla con frecuencia para mantenerte informado sobre cómo protegemos tu información.
      </p>

      <p className="mt-10 text-sm text-gray-600">
        Última actualización: {new Date().getFullYear()}.
      </p>
    </div>
  );
}
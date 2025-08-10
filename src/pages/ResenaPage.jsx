// src/pages/ResenaPage.jsx
import { useParams } from "react-router-dom";

function ResenaPage() {
  const { reservaId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dejá tu reseña</h1>
      <p>Reserva ID: {reservaId}</p>
      {/* Aquí después va el formulario real de reseña */}
    </div>
  );
}

export default ResenaPage;
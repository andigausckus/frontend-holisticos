import { Link, useParams } from "react-router-dom";

export default function TestRouter() {
  const { slug } = useParams();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🚀 Test Router</h1>
      {slug ? (
        <p>Slug recibido: <strong>{slug}</strong></p>
      ) : (
        <p>No se pasó ningún slug</p>
      )}
      <Link to="/">Ir a Home</Link> <br />
      <Link to="/servicios/yoga">Ir a Servicio Yoga</Link>
    </div>
  );
}
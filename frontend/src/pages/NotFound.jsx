import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty-state">
        <h2>Página no encontrada</h2>
        <p><Link to="/">Volver al inicio</Link></p>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api.js';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="container">
      <section className="hero">
        <h1>Todo lo que buscas, en un solo lugar</h1>
        <p>
          Tecnología, maquillaje, hogar, cocina y juguetes: productos importados
          seleccionados con buena relación calidad-precio.
        </p>
      </section>

      {error && <p className="empty-state">No se pudo cargar las categorías: {error}</p>}

      <div className="category-grid">
        {categories.map((cat) => (
          <Link key={cat.id} to={`/categoria/${cat.slug}`} className="category-card">
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

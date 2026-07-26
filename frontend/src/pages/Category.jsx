import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts, getCategories } from '../services/api.js';

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getProducts(slug), getCategories()])
      .then(([productsData, categories]) => {
        setProducts(productsData);
        const match = categories.find((c) => c.slug === slug);
        setCategoryName(match ? match.name : slug);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="container">
      <div className="category-header">
        <h2>{categoryName}</h2>
        {!loading && !error && (
          <span className="category-count">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </span>
        )}
      </div>

      {loading && <p className="empty-state">Cargando productos...</p>}
      {error && <p className="empty-state">Ocurrió un problema al cargar los productos: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="empty-state">No hay productos en esta categoría todavía.</p>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

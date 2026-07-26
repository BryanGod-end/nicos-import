import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="container"><p className="empty-state">{error}</p></div>;
  if (!product) return <div className="container"><p className="empty-state">Cargando...</p></div>;

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: '40px 24px' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 10 }} />
      <div>
        <h2>{product.name}</h2>
        <p className="product-price" style={{ margin: '12px 0' }}>S/ {product.price.toFixed(2)}</p>
        <p style={{ color: 'var(--color-text-muted)' }}>{product.description}</p>
        <p style={{ fontSize: 13, marginTop: 8 }}>Stock disponible: {product.stock}</p>
        <button className="btn btn-accent" style={{ marginTop: 20 }} onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

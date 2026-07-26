import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/producto/${product.id}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="product-card-body">
        <Link to={`/producto/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <span className="product-price">S/ {product.price.toFixed(2)}</span>
        <button className="btn btn-accent" onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

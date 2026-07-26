import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <img src="/images/logoNicos.png" alt="Nico's Import" className="logo-img" />
        </Link>

        <div className="navbar-right">
          <ul className="nav-links">
            <li><Link to="/categoria/tecnologia">Tecnología</Link></li>
            <li><Link to="/categoria/maquillaje">Maquillaje</Link></li>
            <li><Link to="/categoria/hogar">Hogar</Link></li>
            <li><Link to="/categoria/cocina">Cocina</Link></li>
            <li><Link to="/categoria/juguetes">Juguetes</Link></li>
          </ul>

          <Link to="/Carrito" className="cart-link">
            <img src="/images/Carrito.png" alt="Carrito" className="cart-icon" />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}

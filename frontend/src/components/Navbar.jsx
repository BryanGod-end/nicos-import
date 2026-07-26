import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
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

          <button
            className="menu-toggle"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      <div className={`nav-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu} />

      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="nav-drawer-header">
          <span>Menú</span>
          <button className="nav-drawer-close" onClick={closeMenu} aria-label="Cerrar menú">✕</button>
        </div>
        <ul className="nav-drawer-links">
          <li><Link to="/categoria/tecnologia" onClick={closeMenu}>Tecnología</Link></li>
          <li><Link to="/categoria/maquillaje" onClick={closeMenu}>Maquillaje</Link></li>
          <li><Link to="/categoria/hogar" onClick={closeMenu}>Hogar</Link></li>
          <li><Link to="/categoria/cocina" onClick={closeMenu}>Cocina</Link></li>
          <li><Link to="/categoria/juguetes" onClick={closeMenu}>Juguetes</Link></li>
        </ul>
      </div>
    </header>
  );
}
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const { items, isOpen, closeCart, increaseQuantity, decreaseQuantity, removeFromCart, total } = useCart();

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={closeCart}
      />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Bolsa de compras</h3>
          <button className="cart-drawer-close" onClick={closeCart}>×</button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 && <p className="empty-state">Tu bolsa está vacía.</p>}

          {items.map((item) => (
            <div key={item.productId} className="cart-drawer-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-drawer-item-info">
                <p className="cart-drawer-item-name">{item.name}</p>
                <p className="cart-drawer-item-price">S/ {item.price.toFixed(2)}</p>
                <div className="cart-drawer-qty">
                  <button onClick={() => decreaseQuantity(item.productId)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.productId)}>+</button>
                </div>
                <button className="cart-drawer-remove" onClick={() => removeFromCart(item.productId)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-subtotal">
              <span>Subtotal</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <Link to="/carrito" className="btn-pagar" onClick={closeCart}>
              Pagar
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
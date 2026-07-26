import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

export default function Cart() {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, total } = useCart();

  return (
    <div className="container" style={{ padding: '32px 24px 64px' }}>
      <CheckoutSteps currentStep={1} />

      {items.length === 0 ? (
        <p className="empty-state">Tu carrito está vacío.</p>
      ) : (
        <div className="checkout-layout">
          <div className="cart-table-card">
            <div className="cart-table-header">
              <span>Producto</span>
              <span>Cantidad</span>
              <span>Precio</span>
            </div>

            {items.map((item) => (
              <div key={item.productId} className="cart-table-row">
                <div className="cart-table-product">
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                </div>

                <div className="cart-table-qty">
                  <button onClick={() => decreaseQuantity(item.productId)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.productId)}>+</button>
                </div>

                <div className="cart-table-price">
                  <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                  <button className="cart-table-remove" onClick={() => removeFromCart(item.productId)}>×</button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary">
            <div className="checkout-summary-total">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <Link to="/checkout/identificacion" className="btn-pagar" style={{ display: 'block', marginTop: 16 }}>
              Finalizar compra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
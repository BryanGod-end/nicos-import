import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

export default function Identificacion() {
  const { items, total } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: '',
    nombre: '',
    apellidos: '',
    documento: '',
    telefono: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/checkout/entrega'); // el paso "Entrega" lo construimos después
  }

  return (
    <div className="container" style={{ padding: '32px 24px 64px' }}>
      <CheckoutSteps currentStep={2} />

      <div className="checkout-layout">
        <div className="checkout-form-card">
          <h3>Identificación</h3>
          <p className="checkout-form-hint">
            Solicitamos únicamente la información esencial para finalizar la compra.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="checkout-field">
              Correo
              <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
            </label>

            <div className="checkout-field-row">
              <label className="checkout-field">
                Nombre
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
              </label>
              <label className="checkout-field">
                Apellidos
                <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} required />
              </label>
            </div>

            <div className="checkout-field-row">
              <label className="checkout-field">
                Documento de identidad
                <input type="text" name="documento" value={form.documento} onChange={handleChange} required />
              </label>
              <label className="checkout-field">
                Teléfono / móvil
                <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} required />
              </label>
            </div>

            <button type="submit" className="btn-pagar" style={{ width: '100%', border: 'none', marginTop: 20 }}>
              Ir para la entrega
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h4 style={{ marginBottom: 12 }}>Resumen de la compra</h4>
          {items.map((item) => (
            <div key={item.productId} className="checkout-summary-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p style={{ margin: 0, fontSize: 13 }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {item.quantity} x S/ {item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className="checkout-summary-total">
            <span>Total</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
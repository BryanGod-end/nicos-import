import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useCheckout } from '../context/CheckoutContext.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

export default function Identificacion() {
  const { items, total } = useCart();
  const { identificacion, updateIdentificacion } = useCheckout();
  const navigate = useNavigate();

  const [form, setForm] = useState(identificacion);

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'documento' || name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '');
      setForm({ ...form, [name]: soloNumeros });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  function validar() {
    const nuevosErrores = {};

    const todosIguales = (valor) => /^(\d)\1+$/.test(valor);

    if (form.documento.length !== 8) {
      nuevosErrores.documento = 'El DNI debe tener exactamente 8 dígitos';
    } else if (todosIguales(form.documento)) {
      nuevosErrores.documento = 'Ingresa un DNI válido';
    }

    if (form.telefono.length < 9) {
      nuevosErrores.telefono = 'El teléfono debe tener al menos 9 dígitos';
    } else if (todosIguales(form.telefono)) {
      nuevosErrores.telefono = 'Ingresa un teléfono válido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validar()) return;

    updateIdentificacion(form);
    navigate('/checkout/entrega');
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
                <input
                  type="text"
                  name="documento"
                  value={form.documento}
                  onChange={handleChange}
                  maxLength={8}
                  inputMode="numeric"
                  required
                />
                {errors.documento && (
                  <span style={{ color: 'crimson', fontSize: 12 }}>{errors.documento}</span>
                )}
              </label>
              <label className="checkout-field">
                Teléfono / móvil
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  maxLength={9}
                  inputMode="numeric"
                  required
                />
                {errors.telefono && (
                  <span style={{ color: 'crimson', fontSize: 12 }}>{errors.telefono}</span>
                )}
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
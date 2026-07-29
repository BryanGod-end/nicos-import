import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useCheckout } from '../context/CheckoutContext.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import ubigeo from '../data/peru-ubigeo.json';

export default function Entrega() {
  const { items, total } = useCart();
  const { identificacion, entrega, updateEntrega } = useCheckout();
  const navigate = useNavigate();

  const [metodo, setMetodo] = useState(entrega.metodo);
  const [departamento, setDepartamento] = useState(entrega.departamento);
  const [provincia, setProvincia] = useState(entrega.provincia);
  const [distrito, setDistrito] = useState(entrega.distrito);
  const [direccion, setDireccion] = useState(entrega.direccion);
  const [referencia, setReferencia] = useState(entrega.referencia);

  const provincias = useMemo(() => {
    const dep = ubigeo.find((d) => d.nombre === departamento);
    return dep ? dep.provincias : [];
  }, [departamento]);

  const distritos = useMemo(() => {
    const prov = provincias.find((p) => p.nombre === provincia);
    return prov ? prov.distritos : [];
  }, [provincias, provincia]);

  function handleDepartamentoChange(e) {
    setDepartamento(e.target.value);
    setProvincia('');
    setDistrito('');
  }

  function handleProvinciaChange(e) {
    setProvincia(e.target.value);
    setDistrito('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateEntrega({ metodo, departamento, provincia, distrito, direccion, referencia });
    navigate('/checkout/pago');
  }

  function handleEditarIdentificacion() {
    updateEntrega({ metodo, departamento, provincia, distrito, direccion, referencia });
    navigate('/checkout/identificacion');
  }

  return (
    <div className="container" style={{ padding: '32px 24px 64px' }}>
      <CheckoutSteps currentStep={3} />

      <div className="checkout-layout">
        <div className="checkout-form-column">
          <div className="checkout-form-card">
            <div className="checkout-summary-header">
              <div>
                <h4 style={{ margin: 0 }}>Identificación</h4>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {identificacion.correo}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {identificacion.nombre} {identificacion.apellidos}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {identificacion.telefono}
                </p>
              </div>
              <button
                type="button"
                className="checkout-edit-btn"
                onClick={handleEditarIdentificacion}
                aria-label="Editar identificación"
              >
                Editar
              </button>
            </div>
          </div>

          <div className="checkout-form-card">
            <h3>Entrega</h3>
            <p className="checkout-form-hint">
              Elige cómo quieres recibir tu pedido.
            </p>

            <div className="delivery-toggle">
              <button
                type="button"
                className={`delivery-toggle-btn ${metodo === 'envio' ? 'active' : ''}`}
                onClick={() => setMetodo('envio')}
              >
                Enviar
                <span>a la dirección</span>
              </button>
              <button
                type="button"
                className={`delivery-toggle-btn ${metodo === 'recojo' ? 'active' : ''}`}
                onClick={() => setMetodo('recojo')}
              >
                Recoger
                <span>en la tienda</span>
              </button>
            </div>

            {metodo === 'envio' && (
              <form onSubmit={handleSubmit}>
                <label className="checkout-field">
                  Departamento
                  <select value={departamento} onChange={handleDepartamentoChange} required>
                    <option value="" disabled>Selecciona un departamento</option>
                    {ubigeo.map((d) => (
                      <option key={d.nombre} value={d.nombre}>{d.nombre}</option>
                    ))}
                  </select>
                </label>

                <label className="checkout-field">
                  Provincia
                  <select
                    value={provincia}
                    onChange={handleProvinciaChange}
                    required
                    disabled={!departamento}
                  >
                    <option value="" disabled>
                      {departamento ? 'Selecciona una provincia' : 'Primero elige un departamento'}
                    </option>
                    {provincias.map((p) => (
                      <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
                    ))}
                  </select>
                </label>

                <label className="checkout-field">
                  Distrito
                  <select
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    required
                    disabled={!provincia}
                  >
                    <option value="" disabled>
                      {provincia ? 'Selecciona un distrito' : 'Primero elige una provincia'}
                    </option>
                    {distritos.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </label>

                <label className="checkout-field">
                  Dirección
                  <input
                    type="text"
                    placeholder="Av. / Calle / Jr., número"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </label>

                <label className="checkout-field">
                  Referencia (opcional)
                  <input
                    type="text"
                    placeholder="Ej: frente al parque, casa azul"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                  />
                </label>

                <button type="submit" className="btn-pagar" style={{ width: '100%', border: 'none', marginTop: 20 }}>
                  Ir para el pago
                </button>
              </form>
            )}

            {metodo === 'recojo' && (
              <div>
                <p className="checkout-form-hint">
                  Puedes recoger tu pedido en nuestra tienda en Trujillo. Te avisaremos por correo cuando esté listo.
                </p>
                <button
                  type="button"
                  className="btn-pagar"
                  style={{ width: '100%', border: 'none', marginTop: 8 }}
                  onClick={() => navigate('/checkout/pago')}
                >
                  Ir para el pago
                </button>
              </div>
            )}
          </div>
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
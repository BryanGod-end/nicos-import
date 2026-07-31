import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useCheckout } from '../context/CheckoutContext.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

const MESES = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS = Array.from({ length: 10 }, (_, i) => String(ANIO_ACTUAL + i).slice(-2));

export default function Pago() {
  const { items, total } = useCart();
  const { identificacion, entrega } = useCheckout();
  const navigate = useNavigate();

  const [metodoPago, setMetodoPago] = useState('tarjeta'); // 'tarjeta' | 'qr'
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [estadoPago, setEstadoPago] = useState('idle'); // 'idle' | 'qr' | 'procesando' | 'error' | 'exito'
  const [formError, setFormError] = useState(''); // para terminos y condiciones (toast)
  const [cardErrors, setCardErrors] = useState({});
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    cuotas: '',
    nombre: '',
    mes: '',
    anio: '',
    cvv: '',
    documento: '',
  });

  function handleTarjetaChange(e) {
    const { name, value } = e.target;
    setTarjeta({ ...tarjeta, [name]: value });
    if (cardErrors[name]) {
      setCardErrors({ ...cardErrors, [name]: undefined });
    }
  }

  function handleEditarIdentificacion() {
    navigate('/checkout/identificacion');
  }

  function handleEditarEntrega() {
    navigate('/checkout/entrega');
  }

  function validarTarjeta() {
    const nuevosErrores = {};

    if (tarjeta.numero.replace(/\s/g, '').length < 15) {
      nuevosErrores.numero = 'Ingresa un numero de tarjeta valido.';
    }
    if (!tarjeta.cuotas) {
      nuevosErrores.cuotas = 'Selecciona en cuantas cuotas deseas pagar.';
    }
    if (!tarjeta.nombre.trim()) {
      nuevosErrores.nombre = 'Ingresa el nombre y apellido como figura en la tarjeta.';
    }
    if (!tarjeta.mes || !tarjeta.anio) {
      nuevosErrores.fecha = 'Selecciona la fecha de vencimiento.';
    }
    if (tarjeta.cvv.length < 3) {
      nuevosErrores.cvv = 'Ingresa el codigo de seguridad (CVV).';
    }

    setCardErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleComprarAhora() {
    if (!aceptaTerminos) {
      setFormError('Debes aceptar los Terminos y Condiciones y las Politicas de privacidad.');
      return;
    }

    if (metodoPago === 'qr') {
      setFormError('');
      setEstadoPago('qr');
      return;
    }

    if (metodoPago === 'tarjeta' && !validarTarjeta()) {
      return;
    }

    procesarPago();
  }

  function procesarPago() {
    setEstadoPago('procesando');

    // SIMULACION TEMPORAL: aqui luego se conecta la respuesta real de la pasarela (Culqi).
    setTimeout(() => {
      const exito = Math.random() > 0.4; // 60% exito, solo para probar el diseno
      if (exito) {
        setEstadoPago('exito');
        setTimeout(() => {
          navigate('/checkout/confirmacion');
        }, 1200);
      } else {
        setEstadoPago('error');
      }
    }, 2000);
  }

  function handleReintentar() {
    setEstadoPago('idle');
  }

  return (
    <div className="container" style={{ padding: '32px 24px 64px' }}>
      <CheckoutSteps currentStep={4} />

      <div className="checkout-layout">
        <div className="checkout-form-column">
          <div className="checkout-form-card">
            <div className="checkout-summary-header">
              <div>
                <h4 style={{ margin: 0 }}>Identificacion</h4>
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
              <button type="button" className="checkout-edit-btn" onClick={handleEditarIdentificacion}>
                Editar
              </button>
            </div>
          </div>

          <div className="checkout-form-card">
            <div className="checkout-summary-header">
              <div>
                <h4 style={{ margin: 0 }}>Entrega</h4>
                {entrega.metodo === 'envio' ? (
                  <>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                      {entrega.direccion}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
                      {entrega.distrito}, {entrega.provincia}, {entrega.departamento}
                    </p>
                  </>
                ) : (
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                    Recojo en tienda - Trujillo
                  </p>
                )}
              </div>
              <button type="button" className="checkout-edit-btn" onClick={handleEditarEntrega}>
                Editar
              </button>
            </div>
          </div>

          <div className="checkout-form-card">
            <h3>Pago</h3>

            <div className="payment-method">
              <label className={`payment-method-option ${metodoPago === 'tarjeta' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="tarjeta"
                  checked={metodoPago === 'tarjeta'}
                  onChange={() => { setMetodoPago('tarjeta'); setFormError(''); }}
                />
                <span className="payment-method-icons">
                  <img src="/payment-icons/visa.png" alt="Visa" />
                  <img src="/payment-icons/mastercard.png" alt="Mastercard" />
                </span>
              </label>

             {metodoPago === 'tarjeta' && (
                <div className="payment-method-body">
                  <label className="checkout-field">
                    Numero
                    <input
                      type="text"
                      name="numero"
                      value={tarjeta.numero}
                      onChange={handleTarjetaChange}
                      maxLength={19}
                    />
                    {cardErrors.numero && <span className="field-error-text">{cardErrors.numero}</span>}
                  </label>

                  <label className="checkout-field">
                    Cuotas disponibles:
                    <select name="cuotas" value={tarjeta.cuotas} onChange={handleTarjetaChange}>
                      <option value="">Selecciona cuantas cuotas deseas pagar</option>
                      <option value="1">1 cuota</option>
                      <option value="3">3 cuotas</option>
                      <option value="6">6 cuotas</option>
                      <option value="12">12 cuotas</option>
                    </select>
                    {cardErrors.cuotas && <span className="field-error-text">{cardErrors.cuotas}</span>}
                  </label>

                  <label className="checkout-field">
                    Nombre y Apellido como figura en la tarjeta
                    <input type="text" name="nombre" value={tarjeta.nombre} onChange={handleTarjetaChange} />
                    {cardErrors.nombre && <span className="field-error-text">{cardErrors.nombre}</span>}
                  </label>

                  <div className="checkout-field-row">
                    <label className="checkout-field">
                      Fecha de Vencimiento
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select name="mes" value={tarjeta.mes} onChange={handleTarjetaChange}>
                          <option value="">MM</option>
                          {MESES.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <select name="anio" value={tarjeta.anio} onChange={handleTarjetaChange}>
                          <option value="">AA</option>
                          {ANIOS.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                      {cardErrors.fecha && <span className="field-error-text">{cardErrors.fecha}</span>}
                    </label>
                    <label className="checkout-field">
                      Codigo de Seguridad
                      <input
                        type="text"
                        name="cvv"
                        value={tarjeta.cvv}
                        onChange={handleTarjetaChange}
                        maxLength={4}
                        style={{ width: 70 }}
                      />
                      {cardErrors.cvv && <span className="field-error-text">{cardErrors.cvv}</span>}
                    </label>
                  </div>

                  <label className="checkout-field">
                    Documento de Identidad del pagador (Opcional)
                    <input type="text" name="documento" value={tarjeta.documento} onChange={handleTarjetaChange} />
                  </label>
                </div>
              )}
            </div>

            <div className="payment-method" style={{ marginTop: 16 }}>
              <label className={`payment-method-option ${metodoPago === 'qr' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="qr"
                  checked={metodoPago === 'qr'}
                  onChange={() => { setMetodoPago('qr'); setFormError(''); }}
                />
                <span className="payment-method-label">Pago con QR, YAPE o PLIN</span>
              </label>

              {metodoPago === 'qr' && (
                <div className="payment-method-body" style={{ textAlign: 'center' }}>
                  <div className="izipay-badge">izipay</div>
                  <p className="checkout-form-hint">
                    Te ofrecemos diferentes metodos de pago para que puedas completar tu compra.
                    Dale clic a <strong>Comprar ahora</strong> y seras redirigido a la pasarela de pagos de izipay.
                  </p>
                  <p className="checkout-form-hint">
                    Paga de forma segura con cualquiera de tus tarjetas de credito o debito, o de
                    forma rapida con tu billetera favorita a traves del QR izipay.
                  </p>
                </div>
              )}
            </div>
          </div>

          {formError && (
            <div className="form-error-toast">
              <span className="form-error-icon">!</span>
              <span className="form-error-text">{formError}</span>
              <button
                type="button"
                className="form-error-close"
                onClick={() => setFormError('')}
                aria-label="Cerrar"
              >
                x
              </button>
            </div>
          )}
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

          <label className="checkout-terms">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            Acepto los Terminos y Condiciones y Politicas de privacidad
          </label>

          <button
            type="button"
            className="btn-pagar"
            style={{ width: '100%', border: 'none', marginTop: 12 }}
            onClick={handleComprarAhora}
            disabled={estadoPago === 'procesando'}
          >
            Comprar ahora
          </button>
        </div>
      </div>

      {estadoPago === 'qr' && (
        <div className="payment-modal-overlay">
          <div className="payment-modal payment-modal-qr">
            <h3>Escanea para pagar</h3>
            <p className="checkout-form-hint">
              Usa Yape, Plin o tu app de banco para escanear el codigo y completar el pago de{' '}
              <strong>S/ {total.toFixed(2)}</strong>.
            </p>
            <img
              className="payment-qr-image"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=NicosImport-Pago-${total.toFixed(2)}`}
              alt="Codigo QR de pago"
            />
            <p className="checkout-form-hint">
              Este codigo expira en unos minutos. No cierres esta ventana hasta confirmar el pago.
            </p>
            <button type="button" className="payment-modal-btn payment-modal-btn-dark" onClick={procesarPago}>
              Ya realice el pago
            </button>
            <button type="button" className="payment-modal-link" onClick={() => setEstadoPago('idle')}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {estadoPago === 'procesando' && (
        <div className="payment-modal-overlay">
          <div className="payment-modal payment-modal-dark">
            <span className="payment-spinner" />
            <div>
              <h3>Muchas gracias!</h3>
              <p>Tu pedido esta siendo procesado.</p>
            </div>
          </div>
        </div>
      )}

      {estadoPago === 'error' && (
        <div className="payment-modal-overlay">
          <div className="payment-modal payment-modal-warning">
            <h3>Por favor, revisa los detalles de pago</h3>
            <p>Tu compra no se ha finalizado debido a un problema en la autorizacion de pago.</p>
            <p>Tu pago ha sido rechazado debido a informacion incorrecta o saldo insuficiente.</p>
            <button type="button" className="payment-modal-btn" onClick={handleReintentar}>
              Verifica los datos o selecciona otro medio de pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { Link, useLocation } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

export default function Confirmacion() {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;

  return (
    <div className="container" style={{ padding: '32px 24px 64px', textAlign: 'center' }}>
      <CheckoutSteps currentStep={5} />

      <div style={{ maxWidth: 480, margin: '40px auto' }}>
        <h2>Gracias por tu compra!</h2>
        {pedidoId && (
          <p style={{ fontWeight: 600 }}>
            Numero de pedido: #{pedidoId}
          </p>
        )}
        <p className="checkout-form-hint">
          Tu pedido fue confirmado. Te enviaremos un correo con los detalles del envio.
        </p>
        <Link
          to="/"
          className="btn-pagar"
          style={{ display: 'inline-block', marginTop: 20, textDecoration: 'none' }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
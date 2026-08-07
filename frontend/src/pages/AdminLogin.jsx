import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api.js';

export default function AdminLogin() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setCargando(true);

    try {
      const { token } = await adminLogin({ usuario, clave });

      sessionStorage.setItem('adminToken', token);

      navigate('/admin/pedidos');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div
      className="container"
      style={{
        padding: '64px 24px',
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      {/* Logo */}
      <div className="admin-login-icon">
        <img src="/images/logoNicos.png" alt="Nico's Import" />
      </div>

      {/* Título */}
      <h2
        style={{
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Panel de administración
      </h2>

      {/* Subtítulo */}
      <p
        style={{
          textAlign: 'center',
          color: '#777',
          marginBottom: 25,
          fontSize: 14,
        }}
      >
        Acceso exclusivo para administradores
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <label className="checkout-field">
          Usuario

          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="checkout-field">
          Clave

          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {/* Mensaje de error */}
        {error && (
          <p
            style={{
              color: '#c0392b',
              fontSize: 14,
              marginTop: 8,
            }}
          >
            {error}
          </p>
        )}

        {/* Botón */}
        <button
          type="submit"
          className="btn-pagar"
          style={{
            width: '100%',
            border: 'none',
            marginTop: 20,
          }}
          disabled={cargando}
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminOrders, getAdminOrderById } from '../services/api.js';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    setCargando(true);
    setError('');
    try {
      const data = await getAdminOrders();
      setPedidos(data);
    } catch (err) {
      if (err.message.includes('autorizado') || err.message.includes('invalido')) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function verDetalle(pedidoId) {
    try {
      const data = await getAdminOrderById(pedidoId);
      setSeleccionado(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('adminToken');
    navigate('/admin/login');
  }

  if (cargando) {
    return <div className="container" style={{ padding: 48 }}>Cargando pedidos...</div>;
  }

  return (
    <div className="container" style={{ padding: '32px 24px 64px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Panel de pedidos</h2>
        <button type="button" className="checkout-edit-btn" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: 8 }}>#</th>
                <th style={{ padding: 8 }}>Cliente</th>
                <th style={{ padding: 8 }}>Total</th>
                <th style={{ padding: 8 }}>Estado</th>
                <th style={{ padding: 8 }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr
                  key={p.PedidoId}
                  onClick={() => verDetalle(p.PedidoId)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  <td style={{ padding: 8 }}>#{p.PedidoId}</td>
                  <td style={{ padding: 8 }}>{p.Nombre} {p.Apellido}</td>
                  <td style={{ padding: 8 }}>S/ {Number(p.Total).toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{p.Estado}</td>
                  <td style={{ padding: 8 }}>{new Date(p.FechaPedido).toLocaleString('es-PE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pedidos.length === 0 && <p>No hay pedidos todavia.</p>}
        </div>

        {seleccionado && (
          <div style={{ flex: '1 1 300px', border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
            <h3>Pedido #{seleccionado.pedido.PedidoId}</h3>
            <p><strong>{seleccionado.pedido.Nombre} {seleccionado.pedido.Apellido}</strong></p>
            <p>{seleccionado.pedido.Email} · {seleccionado.pedido.Telefono}</p>
            <p>DNI: {seleccionado.pedido.DNI}</p>
            <hr />
            <p>
              {seleccionado.pedido.DireccionCompleta}<br />
              {seleccionado.pedido.Distrito}, {seleccionado.pedido.Provincia}, {seleccionado.pedido.Departamento}
              {seleccionado.pedido.Referencia && <><br />Ref: {seleccionado.pedido.Referencia}</>}
            </p>
            <hr />
            <h4>Productos</h4>
            <ul>
              {seleccionado.items.map((item) => (
                <li key={item.ProductoId}>
                  {item.Nombre} — {item.Cantidad} x S/ {Number(item.PrecioUnitario).toFixed(2)} = S/ {Number(item.Subtotal).toFixed(2)}
                </li>
              ))}
            </ul>
            <hr />
            {seleccionado.pago && (
              <p>
                Pago: {seleccionado.pago.MetodoPago} — S/ {Number(seleccionado.pago.MontoPagado).toFixed(2)}
                {' '}({seleccionado.pago.EstagoPago})
              </p>
            )}
            <p><strong>Total: S/ {Number(seleccionado.pedido.Total).toFixed(2)}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
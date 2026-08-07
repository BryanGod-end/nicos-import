const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Wrapper único para fetch: centraliza manejo de errores HTTP.
// Si mañana se cambia de REST a GraphQL, solo se reescribe este archivo.
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.error?.message || 'Error al conectar con el servidor');
  }

  return body.data;
}

export const getProducts = (category) =>
  request(category ? `/products?category=${category}` : '/products');

export const getProductById = (id) => request(`/products/${id}`);

export const getCategories = () => request('/categories');

export const calculateCart = (items) =>
  request('/cart/calculate', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });

export const createOrder = (orderData) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

export const adminLogin = (credenciales) =>
  request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credenciales),
  });

function authHeader() {
  const token = sessionStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getAdminOrders = () =>
  fetch(`${API_URL}/orders`, { headers: { ...authHeader() } })
    .then((res) => res.json())
    .then((body) => {
      if (body.error) throw new Error(body.error.message);
      return body.data;
    });

export const getAdminOrderById = (id) =>
  fetch(`${API_URL}/orders/${id}`, { headers: { ...authHeader() } })
    .then((res) => res.json())
    .then((body) => {
      if (body.error) throw new Error(body.error.message);
      return body.data;
    });
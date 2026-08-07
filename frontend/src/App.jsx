import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Category from './pages/Category.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Identificacion from './pages/Identificacion.jsx';
import Entrega from './pages/Entrega.jsx';
import Pago from './pages/Pago.jsx';
import Confirmacion from './pages/Confirmacion.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminPedidos from './pages/AdminPedidos.jsx';
import AdminRoute from './components/AdminRoute.jsx';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {!isHome && <Navbar />}
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:slug" element={<Category />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout/identificacion" element={<Identificacion/>} />
        <Route path="/checkout/entrega" element={<Entrega />} />
        <Route path="/checkout/pago" element={<Pago />} />
        <Route path="/checkout/confirmacion" element={<Confirmacion />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/pedidos" element={<AdminRoute><AdminPedidos /></AdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isHome && <Footer />}
    </>
  );
}
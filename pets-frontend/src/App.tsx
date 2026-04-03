import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

import About from './pages/About';
import Register from './pages/Register';
import Promotions from './pages/Promotions';
import Categories from './pages/Categories';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminContacts from './pages/admin/AdminContacts';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Catalog />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="categories" element={<Categories />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

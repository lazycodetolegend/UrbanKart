import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />

        {/* Protected Routes */}
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  );
}

export default App;

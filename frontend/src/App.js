import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import GlobalLoader from "./components/ui/GlobalLoader";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import "./index.css";

// 📦 Lazy Pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Notfound = lazy(() => import("./pages/Notfound"));

const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Profile = lazy(() => import("./pages/Profile"));

const ShippingPolicy = lazy(() => import("./pages/support/ShippingPolicy"));
const ReturnsRefunds = lazy(() => import("./pages/support/ReturnsRefunds"));
const BulkOrders = lazy(() => import("./pages/support/BulkOrders"));
const ContactUs = lazy(() => import("./pages/support/ContactUs"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminInventory = lazy(() => import("./pages/admin/Inventory"));
const AdminBilling = lazy(() => import("./pages/admin/Billing"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminSuppliers = lazy(() => import("./pages/admin/Suppliers"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));

function App() {
  const [lang, setLang] = useState("en");

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#10b981",
                color: "#fff",
                borderRadius: "16px",
              },
            }}
          />

          <Suspense fallback={<GlobalLoader />}>
            <Routes>

              {/* USER */}
              <Route element={<UserLayout lang={lang} setLang={setLang} />}>
                <Route path="/" element={<Home lang={lang} />} />
                <Route path="/products" element={<Products lang={lang} />} />
                <Route path="/product/:id" element={<ProductDetails lang={lang} />} />
                <Route path="/login" element={<Login lang={lang} />} />
                <Route path="/register" element={<Register lang={lang} />} />

                <Route path="/shipping" element={<ShippingPolicy />} />
                <Route path="/returns" element={<ReturnsRefunds />} />
                <Route path="/bulk" element={<BulkOrders />} />
                <Route path="/contact" element={<ContactUs />} />

                <Route path="/cart" element={<ProtectedRoute><Cart lang={lang} /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout lang={lang} /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders lang={lang} /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails lang={lang} /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile lang={lang} setLang={setLang} /></ProtectedRoute>} />
              </Route>

              {/* ADMIN */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard lang={lang} />} />
                <Route path="products" element={<AdminProducts lang={lang} />} />
                <Route path="inventory" element={<AdminInventory lang={lang} />} />
                <Route path="billing" element={<AdminBilling lang={lang} />} />
                <Route path="orders" element={<AdminOrders lang={lang} />} />
                <Route path="customers" element={<AdminCustomers lang={lang} />} />
                <Route path="suppliers" element={<AdminSuppliers lang={lang} />} />
                <Route path="reports" element={<AdminReports lang={lang} />} />
                <Route path="settings" element={<AdminSettings lang={lang} />} />
                <Route path="users" element={<AdminUsers lang={lang} />} />
              </Route>

              <Route path="*" element={<Notfound lang={lang} />} />

            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
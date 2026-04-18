import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Core Layout (Load Synchronously - DO NOT LAZY LOAD ROOT WRAPPERS)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import GlobalLoader from "./components/ui/GlobalLoader";

import "./index.css";

// 📦 Chunk Setup: Lazy Loaded Pages
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

// Support Pages
const ShippingPolicy = lazy(() => import("./pages/support/ShippingPolicy"));
const ReturnsRefunds = lazy(() => import("./pages/support/ReturnsRefunds"));
const BulkOrders = lazy(() => import("./pages/support/BulkOrders"));
const ContactUs = lazy(() => import("./pages/support/ContactUs"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));


function App() {
  const [lang, setLang] = useState("en"); // Changed default to 'en' for development standard, but language toggle works fine

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#333', color: '#fff', borderRadius: '10px' },
            }}
          />
          <div className="flex flex-col min-h-screen">
            <Navbar lang={lang} setLang={setLang} />
            <main className="flex-grow">
              <Suspense fallback={<GlobalLoader />}>
                <Routes>
                  {/* 🌐 PUBLIC ROUTES */}
                  <Route path="/" element={<Home lang={lang} />} />
                  <Route path="/products" element={<Products lang={lang} />} />
                  <Route path="/product/:id" element={<ProductDetails lang={lang} />} />
                  <Route path="/login" element={<Login lang={lang} />} />
                  <Route path="/register" element={<Register lang={lang} />} />

                  {/* 📝 SUPPORT ROUTES */}
                  <Route path="/shipping" element={<ShippingPolicy />} />
                  <Route path="/returns" element={<ReturnsRefunds />} />
                  <Route path="/bulk" element={<BulkOrders />} />
                  <Route path="/contact" element={<ContactUs />} />

                  {/* 🔐 PROTECTED USER ROUTES */}
                  <Route path="/cart" element={
                    <ProtectedRoute><Cart lang={lang} /></ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute><Checkout lang={lang} /></ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute><Orders lang={lang} /></ProtectedRoute>
                  } />
                  <Route path="/orders/:id" element={
                    <ProtectedRoute><OrderDetails lang={lang} /></ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute><Profile lang={lang} /></ProtectedRoute>
                  } />

                  {/* 🛠️ PROTECTED ADMIN ROUTES */}
                  <Route path="/admin/dashboard" element={
                    <AdminRoute><AdminDashboard lang={lang} /></AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute><AdminProducts lang={lang} /></AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute><AdminOrders lang={lang} /></AdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRoute><AdminUsers lang={lang} /></AdminRoute>
                  } />

                  {/* ❌ 404 ROUTE */}
                  <Route path="*" element={<Notfound lang={lang} />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
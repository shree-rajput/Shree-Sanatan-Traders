import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Core Layout
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notfound from "./pages/Notfound";

// Protected User Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";

// Protected Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";

import "./index.css";

function App() {
  const [lang, setLang] = useState("hi");

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
              <Routes>
                {/* 🌐 PUBLIC ROUTES */}
                <Route path="/" element={<Home lang={lang} />} />
                <Route path="/products" element={<Products lang={lang} />} />
                <Route path="/products/:id" element={<ProductDetails lang={lang} />} />
                <Route path="/login" element={<Login lang={lang} />} />
                <Route path="/register" element={<Register lang={lang} />} />
                
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
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
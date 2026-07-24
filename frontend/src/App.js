import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { socket } from "./socket/socket";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import GlobalLoader from "./components/ui/GlobalLoader";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import "./index.css";

import TrialCompo from "./components/TrialCompo";

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
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Profile = lazy(() => import("./pages/Profile"));

const ShippingPolicy = lazy(() => import("./pages/support/ShippingPolicy"));
const ReturnsRefunds = lazy(() => import("./pages/support/ReturnsRefunds"));
const BulkOrders = lazy(() => import("./pages/support/BulkOrders"));
const ContactUs = lazy(() => import("./pages/support/ContactUs"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminBilling = lazy(() => import("./pages/admin/Billing"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminSuppliers = lazy(() => import("./pages/admin/Suppliers"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const InventoryAnalytics = lazy(() => import("./pages/admin/InventoryAnalytics"));
const BarcodeScanner = lazy(() => import("./pages/admin/BarcodeScanner"));
const PurchaseOrders = lazy(() => import("./pages/admin/PurchaseOrders"));
const LowStockAlerts = lazy(() => import("./pages/admin/LowStockAlerts"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminSupport = lazy(() => import("./pages/admin/AdminSupport"));


// trials for reserve feature 
// import {socket} from './socket/socket.js';

function App() {

  // useEffect(() => {

  //   socket.connect();

  //   return () => {
  //     socket.disconnect();
  //   };

  // }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#00e41b",
                    color: "#fff",
                    borderRadius: "16px",
                  },
                }}
              />

              <Suspense fallback={<GlobalLoader />}>
                <Routes>
                  <Route path='loading' element={<TrialCompo/>}/>

                  {/* USER */}
                  <Route element={<UserLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/shipping" element={<ShippingPolicy />} />
                    <Route path="/returns" element={<ReturnsRefunds />} />
                    <Route path="/bulk" element={<BulkOrders />} />
                    <Route path="/contact" element={<ContactUs />} />

                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                    <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="billing" element={<AdminBilling />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="suppliers" element={<AdminSuppliers />} />
                    <Route path="reports" element={<AdminAnalytics />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="ai-inventory" element={<InventoryAnalytics />} />
                    <Route path="barcode-scanner" element={<BarcodeScanner />} />
                    <Route path="purchases" element={<PurchaseOrders />} />
                    <Route path="low-stock" element={<LowStockAlerts />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="support" element={<AdminSupport />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="users" element={<AdminUsers />} />
                  </Route>

                  <Route path="*" element={<Notfound />} />

                </Routes>
              </Suspense>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;



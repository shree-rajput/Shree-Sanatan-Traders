import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home    from "./pages/Home";
import Cart    from "./pages/Cart";
import Login   from "./pages/Login";
import Register from "./pages/Register";
import Orders  from "./pages/Orders";
import "./index.css";

function App() {
  const [lang, setLang] = useState("hi"); // default Hindi for farmers

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar lang={lang} setLang={setLang} />
          <Routes>
            <Route path="/"         element={<Home    lang={lang} />} />
            <Route path="/login"    element={<Login   lang={lang} />} />
            <Route path="/register" element={<Register lang={lang} />} />
            <Route path="/cart"     element={
              <ProtectedRoute><Cart lang={lang} /></ProtectedRoute>
            }/>
            <Route path="/orders"   element={
              <ProtectedRoute><Orders lang={lang} /></ProtectedRoute>
            }/>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize state directly from LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem("cart");
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      console.error("Cart hydration error", e);
      return [];
    }
  });

  // Persist back to LocalStorage on every state update automatically
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        toast.success("Cart quantity updated!");
        return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + quantity } : i);
      }
      toast.success(`${product.name || "Item"} added to your cart!`);
      return [...prev, { ...product, qty: quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
    toast.error("Item removed from cart");
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return removeFromCart(id);
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty: newQty } : i));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cartItems.reduce((s, i) => s + (i.qty || 1), 0);
  const totalPrice = cartItems.reduce((s, i) => s + (i.price || i.product?.price || 0) * (i.qty || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
import React, { useEffect, useState } from "react";
import API from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.items);
    };

    fetchCart();
  }, []);

  return (
    <div>
      <h2>Cart</h2>

      {cart.map((item) => (
        <div key={item._id}>
          <p>{item.product?.name}</p>
          <p>Qty: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default Cart;
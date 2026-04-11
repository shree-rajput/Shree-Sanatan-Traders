import React, { useEffect, useState } from "react";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>

      {orders.map((o) => (
        <div key={o._id}>
          <p>Amount: ₹{o.finalAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
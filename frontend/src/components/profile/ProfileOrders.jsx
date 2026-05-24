import React from "react";
import { useNavigate } from "react-router-dom";
import { LuShoppingBag } from "react-icons/lu";
import EmptyState from "./EmptyState";
import OrderCard from "./OrderCard";
import { SectionHeader } from "./ProfileInput";

const ProfileOrders = ({ orders = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Order History"
        description="Track your purchases, payment status, and delivery progress."
        icon={LuShoppingBag}
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={LuShoppingBag}
          title="No orders yet"
          description="Your marketplace purchases will appear here after checkout."
          actionLabel="Start Shopping"
          onAction={() => navigate("/products")}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onDetails={() => navigate(`/orders/${order._id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileOrders;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import {
  LuShoppingCart,
  LuChevronLeft,
  LuCheck,
  LuArrowRight,
  LuMinus,
  LuPlus,
  LuTriangleAlert,
} from "react-icons/lu";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600" />
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product not found
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="text-green-600 font-bold flex items-center gap-2"
        >
          <LuChevronLeft size={20} /> Back to Products
        </button>
      </div>
    );

  const imageUrl = product.image || product.images?.[0] || "/box1.png";
  const price = product.price || product.variants?.[0]?.price || 0;
  const isOutOfStock =
    product.stock === 0 || product.stockStatus === "out_of_stock";
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({ ...product, price }, quantity);
    setIsAdded(true);
    toast.success(`${t("add_to_cart")} ✓`, { icon: "🛒" });
    setTimeout(() => setIsAdded(false), 2000);
  };

  // 🛍️ Amazon-style Buy Now — skip cart, go straight to checkout with this product
  const handleBuyNow = () => {
    if (isOutOfStock) return;
    navigate("/checkout", {
      state: {
        buyNowItem: {
          _id: product._id,
          name: product.name,
          price,
          qty: quantity,
          image: imageUrl,
          images: product.images,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors"
        >
          <LuChevronLeft size={20} /> {t("back")}
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div
            className={`relative bg-gray-50 rounded-[40px] p-12 md:p-20 border border-gray-100 aspect-square flex items-center justify-center overflow-hidden ${isOutOfStock ? "opacity-60" : ""}`}
          >
            {isOutOfStock && (
              <div className="absolute top-6 right-6 z-10">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {t("out_of_stock")}
                </span>
              </div>
            )}
            {isLowStock && !isOutOfStock && (
              <div className="absolute top-6 right-6 z-10">
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Only {product.stock} left!
                </span>
              </div>
            )}
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
                {product.category?.name || product.category || "Agriculture"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gray-900">
                ₹{price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 font-medium">
                {t("inclusive_taxes")}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {t("product_description")}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="pt-8 border-t border-gray-100 space-y-6">
              {/* Quantity */}
              {!isOutOfStock && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all"
                    >
                      <LuMinus size={18} />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock || 99, quantity + 1))
                      }
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all"
                    >
                      <LuPlus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Subtotal
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{(price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              {isOutOfStock ? (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-6 py-4">
                  <LuTriangleAlert size={20} className="text-red-500" />
                  <div>
                    <p className="font-bold text-red-700">
                      {t("out_of_stock")}
                    </p>
                    <p className="text-sm text-red-500">
                      स्टॉक समाप्त — This item is currently unavailable
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-lg font-bold transition-all shadow-xl ${isAdded ? "bg-amber-500 text-white shadow-amber-100" : "bg-green-600 text-white shadow-green-100 hover:bg-green-700"}`}
                  >
                    {isAdded ? (
                      <LuCheck size={24} />
                    ) : (
                      <LuShoppingCart size={24} />
                    )}
                    {isAdded ? "Added!" : t("add_to_cart")}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-gray-900 text-white rounded-2xl text-lg font-bold hover:bg-amber-600 transition-all shadow-xl shadow-gray-100"
                  >
                    {t("buy_now")} <LuArrowRight size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="pt-6 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-500" : isLowStock ? "bg-amber-500 animate-pulse" : "bg-green-500 animate-pulse"}`}
                />
                <span className="text-xs font-bold text-gray-500">
                  {isOutOfStock
                    ? t("out_of_stock")
                    : isLowStock
                      ? `Low Stock (${product.stock} left)`
                      : "In Stock"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">SKU:</span>
                <span className="text-xs font-bold text-gray-900">
                  ST-{id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>

            {/* WhatsApp Order */}
            <a
              href={`https://wa.me/917828196171?text=Hi! I want to order ${product.name} (${quantity} qty) for ₹${(price * quantity).toLocaleString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-2xl font-bold text-sm hover:bg-green-600 transition-all"
            >
              📱 {t("whatsapp_order")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

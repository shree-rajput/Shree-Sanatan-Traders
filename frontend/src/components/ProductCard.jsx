import React, { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { LuPlus, LuCheck, LuShoppingCart } from "react-icons/lu";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isAdded, setIsAdded] = useState(false);

    const imageUrl = product.image || product.images?.[0] || "/box1.png";
    const price = product.price || product.variants?.[0]?.price || 0;
    const isOutOfStock =
        product.stock === 0 || product.stockStatus === "out_of_stock";
    const isLowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (isOutOfStock) return;
        addToCart({ ...product, price });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    // Amazon-style Buy Now — skip cart
    const handleBuyNow = (e) => {
        e.preventDefault();
        if (isOutOfStock) return;
        navigate("/checkout", {
            state: {
                buyNowItem: {
                    _id: product._id,
                    name: product.name,
                    price,
                    qty: 1,
                    image: imageUrl,
                    images: product.images,
                },
            },
        });
    };

    return (
        <div
            className={`relative bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5 transition-all p-4 flex flex-col group ${isOutOfStock ? "opacity-60" : ""}`}
        >
            {/* Out of Stock Badge */}
            {isOutOfStock && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                        {t("out_of_stock")}
                    </span>
                </div>
            )}

            {/* Low Stock Badge */}
            {isLowStock && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                        Only {product.stock} left
                    </span>
                </div>
            )}

            {/* Image */}
            {/* <Link
        to={`/product/${product._id}`}
        className={`aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 block ${isOutOfStock ? "grayscale" : ""}`}
      > */}
            <Link
                to={`/product/${product._id}`}
                className={`aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 block`}
            >
                <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Info */}
            <div className="flex-grow">
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-gray-900 font-bold hover:text-green-600 transition-colors line-clamp-1 mb-1">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-gray-400 text-xs font-medium mb-4">
                    {product.category?.name || product.category || "General"}
                </p>
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {t("price")}
                        </span>
                        <span className="text-xl font-bold text-gray-900">
                            ₹{price.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded || isOutOfStock}
                        title={isOutOfStock ? t("out_of_stock") : t("add_to_cart")}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOutOfStock
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                : isAdded
                                    ? "bg-amber-500 text-white shadow-lg shadow-amber-100"
                                    : "bg-green-600 text-white shadow-lg shadow-green-100 hover:bg-green-700"
                            }`}
                    >
                        {isAdded ? <LuCheck size={20} /> : <LuPlus size={20} />}
                    </button>
                </div>

                {/* Buy Now — only show if in stock */}
                {!isOutOfStock && (
                    <button
                        onClick={handleBuyNow}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all"
                    >
                        <LuShoppingCart size={14} /> {t("buy_now")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default memo(ProductCard);

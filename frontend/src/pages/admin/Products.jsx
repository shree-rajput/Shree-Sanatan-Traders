import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Error deleting product.");
    }
  };

  return (
    <AdminSidebar>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Inventory</h1>
          <button className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-orange-700 hover:shadow-lg transition-all focus:ring-4 focus:ring-orange-500/50">
            + Add New Product
          </button>
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                    <th className="p-4 pl-6 w-20">Image</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center pr-6 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors items-center">
                      <td className="p-4 pl-6">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.image?.[0] ? 
                            <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover" /> : 
                            <span className="text-xl">📦</span>
                          }
                        </div>
                      </td>
                      <td className="p-4 font-bold text-gray-900 max-w-xs truncate">{product.name}</td>
                      <td className="p-4 font-black text-orange-600 border-l border-r border-transparent">₹{product.price}</td>
                      <td className="p-4 pr-6 text-center space-x-3 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-900 font-bold px-2">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 font-bold px-2">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500 italic">No products available in the inventory.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminSidebar>
  );
};

export default AdminProducts;

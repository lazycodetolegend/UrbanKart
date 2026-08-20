import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/formatPrice';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ show: false, productId: null });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?page=${page}&limit=10&search=${search}`);
      setProducts(res.data.products);
      setTotalPages(res.data.pages || 1);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteModal.productId}`);
      setDeleteModal({ show: false, productId: null });
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-navy-900">Products</h1>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <FaPlus /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><Spinner /></div>
        ) : error ? (
          <div className="p-6 text-red-500 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium text-center">Stock</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No products found</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/40'} 
                          alt={product.name} 
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                        />
                        <span className="text-sm font-medium text-navy-900 max-w-[200px] truncate">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name || product.category || 'Uncategorized'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-navy-900">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-semibold ${product.stock <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.isFeatured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link to={`/admin/products/${product._id}/edit`} className="text-blue-600 hover:text-blue-800 inline-block p-1">
                          <FaEdit size={16} />
                        </Link>
                        <button 
                          onClick={() => setDeleteModal({ show: true, productId: product._id })}
                          className="text-red-600 hover:text-red-800 inline-block p-1"
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm flex items-center">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-navy-900 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, productId: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

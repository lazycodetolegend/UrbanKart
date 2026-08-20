import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.categories || res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setFormData({ name: '', description: '' });
    setModalError('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditId(cat._id);
    setFormData({ name: cat.name, description: cat.description || '' });
    setModalError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleteModal.id}`);
      setDeleteModal({ show: false, id: null });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
      setDeleteModal({ show: false, id: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy-900">Categories</h1>
        <button onClick={openAddModal} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Spinner /></div>
        ) : error ? (
          <div className="p-6 text-red-500 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No categories found</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-navy-900">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cat.description || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => openEditModal(cat)} className="text-blue-600 hover:text-blue-800 p-1">
                          <FaEdit size={16} />
                        </button>
                        <button onClick={() => setDeleteModal({ show: true, id: cat._id })} className="text-red-600 hover:text-red-800 p-1">
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
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-navy-900">{editId ? 'Edit Category' : 'Add Category'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalError && <div className="text-sm text-red-500 bg-red-50 p-3 rounded">{modalError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-900 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-navy-900 mb-2">Delete Category</h3>
            <p className="text-gray-600 mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ show: false, id: null })} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

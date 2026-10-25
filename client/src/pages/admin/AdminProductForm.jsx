import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const AdminProductForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    brand: '',
    stock: '',
    isFeatured: false,
    imageUrl: '',
  });
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data.categories || catRes.data || []);

        if (isEditing) {
          const prodRes = await api.get(`/products/${id}`);
          const p = prodRes.data?.product || prodRes.data;
          if (p) {
            setFormData({
              name: p.name || '',
              description: p.description || '',
              price: p.price ?? '',
              comparePrice: p.comparePrice ?? '',
              category: p.category?._id || p.category || '',
              brand: p.brand || '',
              stock: p.stock ?? '',
              isFeatured: p.featured ?? p.isFeatured ?? false,
              imageUrl: p.images?.[0] || '',
            });
            setExistingImages(p.images || []);
          }
        }
      } catch (err) {
        console.error('Failed to load product data:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const uploadImages = async (productId) => {
    if (!imageFiles || imageFiles.length === 0) return;
    const formDataObj = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formDataObj.append('images', imageFiles[i]);
    }
    await api.post(`/products/${productId}/images`, formDataObj, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
        category: formData.category,
        brand: formData.brand,
        stock: Number(formData.stock),
        featured: Boolean(formData.isFeatured),
      };

      if (formData.imageUrl && formData.imageUrl.trim()) {
        payload.images = [formData.imageUrl.trim(), ...existingImages.filter(img => img !== formData.imageUrl.trim())];
      }

      let productId = id;
      if (isEditing) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated successfully!');
      } else {
        const res = await api.post('/products', payload);
        productId = res.data?.product?._id || res.data?._id;
        toast.success('Product created successfully!');
      }

      if (imageFiles && imageFiles.length > 0 && productId) {
        await uploadImages(productId);
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Product save error:', err);
      setError(err.response?.data?.message || 'Failed to save product');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Spinner /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Product Name *</label>
              <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Category *</label>
              <select 
                required 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Price (₹) *</label>
              <input 
                required 
                type="number" 
                min="0" 
                step="1" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Compare at Price / MRP (₹)</label>
              <input 
                type="number" 
                min="0" 
                step="1" 
                name="comparePrice" 
                value={formData.comparePrice} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Stock Quantity *</label>
              <input 
                required 
                type="number" 
                min="0" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Brand</label>
              <input 
                type="text" 
                name="brand" 
                value={formData.brand} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea 
              rows="4" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input 
              type="checkbox" 
              id="isFeatured" 
              name="isFeatured" 
              checked={formData.isFeatured} 
              onChange={handleChange} 
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" 
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
              🌟 Featured Product (Highlight on UrbanKart homepage)
            </label>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700">Product Image URL</label>
            <input 
              type="url" 
              name="imageUrl" 
              placeholder="https://images.unsplash.com/..." 
              value={formData.imageUrl} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" 
            />
            
            {existingImages.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">Current Images:</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {existingImages.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Or Upload Local Image Files</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => navigate('/admin/products')} 
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting} 
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-2 transition"
          >
            {submitting && <Spinner className="w-4 h-4 border-2" />}
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;

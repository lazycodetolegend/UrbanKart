import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/ui/Spinner';
import { FaFilter } from 'react-icons/fa';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialSort = searchParams.get('sort') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');

  const [filters, setFilters] = useState({
    search: initialSearch,
    category: initialCategory,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    sort: initialSort,
    page: initialPage
  });

  const [priceInput, setPriceInput] = useState({
    min: initialMinPrice,
    max: initialMaxPrice
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.page > 1) params.append('page', filters.page);

        setSearchParams(params);

        const { data } = await api.get(`/products?${params.toString()}`);
        if (data.success) {
          setProducts(data.products);
          setTotalProducts(data.total);
          setTotalPages(data.pages);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const applyPriceFilter = () => {
    setFilters(prev => ({ 
      ...prev, 
      minPrice: priceInput.min, 
      maxPrice: priceInput.max,
      page: 1 
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: '', page: 1 });
    setPriceInput({ min: '', max: '' });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-navy-900">Shop</h1>
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="btn-outline flex items-center gap-2"
        >
          <FaFilter /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              <button onClick={clearFilters} className="text-sm text-orange-600 hover:underline">Clear All</button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category"
                    checked={filters.category === ''}
                    onChange={() => handleFilterChange('category', '')}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-600">All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio"
                      name="category"
                      checked={filters.category === cat.name}
                      onChange={() => handleFilterChange('category', cat.name)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-600">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
              <div className="flex items-center gap-2 mb-3">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={priceInput.min}
                  onChange={(e) => setPriceInput({...priceInput, min: e.target.value})}
                  className="input-field w-full text-sm py-1 px-2"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={priceInput.max}
                  onChange={(e) => setPriceInput({...priceInput, max: e.target.value})}
                  className="input-field w-full text-sm py-1 px-2"
                />
              </div>
              <button 
                onClick={applyPriceFilter}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-navy-900">
                {filters.category ? filters.category : 'All Products'}
              </h1>
              <p className="text-gray-500 mt-1">Showing {products.length} of {totalProducts} products</p>
            </div>
            
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-gray-600 text-sm">Sort by:</label>
              <select 
                id="sort"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field py-2 bg-white"
              >
                <option value="">Featured</option>
                <option value="-createdAt">Newest Arrivals</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-avgRating">Customer Rating</option>
              </select>
            </div>
          </div>
          
          {/* Mobile Sort */}
          <div className="md:hidden mb-6">
            <select 
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input-field w-full py-2 bg-white"
            >
              <option value="">Sort: Featured</option>
              <option value="-createdAt">Newest Arrivals</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-avgRating">Customer Rating</option>
            </select>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <button 
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${
                          filters.page === i + 1 
                            ? 'bg-navy-900 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No products found</h2>
              <p className="text-gray-500 mb-6">Try adjusting your filters or searching for something else.</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;

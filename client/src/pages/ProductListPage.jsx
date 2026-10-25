import React, { useState, useEffect, useCallback } from 'react';
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

  // Derive active filters directly from current URL search parameters
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [priceInput, setPriceInput] = useState({
    min: currentMinPrice,
    max: currentMaxPrice
  });

  // Keep price inputs in sync with URL
  useEffect(() => {
    setPriceInput({
      min: currentMinPrice,
      max: currentMaxPrice
    });
  }, [currentMinPrice, currentMaxPrice]);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever URL searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (currentSearch) queryParams.append('search', currentSearch);
        if (currentCategory && currentCategory !== 'All') queryParams.append('category', currentCategory);
        if (currentMinPrice) queryParams.append('minPrice', currentMinPrice);
        if (currentMaxPrice) queryParams.append('maxPrice', currentMaxPrice);
        if (currentSort) queryParams.append('sort', currentSort);
        if (currentPage > 1) queryParams.append('page', currentPage.toString());

        const { data } = await api.get(`/products?${queryParams.toString()}`);
        if (data.success) {
          setProducts(data.products || []);
          setTotalProducts(data.total || 0);
          setTotalPages(data.pages || 1);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCategory, currentSearch, currentMinPrice, currentMaxPrice, currentSort, currentPage]);

  // Helper to update specific search param while preserving others
  const updateParams = useCallback((newParams) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined || value === 'All') {
        next.delete(key);
      } else {
        next.set(key, value.toString());
      }
    });
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const handleCategorySelect = (catName) => {
    if (!catName || catName === 'All') {
      updateParams({ category: '', page: 1 });
    } else {
      updateParams({ category: catName, page: 1 });
    }
  };

  const handleSortChange = (sortVal) => {
    updateParams({ sort: sortVal, page: 1 });
  };

  const applyPriceFilter = () => {
    updateParams({
      minPrice: priceInput.min ? priceInput.min.trim() : '',
      maxPrice: priceInput.max ? priceInput.max.trim() : '',
      page: 1
    });
  };

  const clearFilters = () => {
    setPriceInput({ min: '', max: '' });
    navigate('/products');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParams({ page: newPage });
    }
  };

  const displayCategoryTitle = currentCategory && currentCategory !== 'All' 
    ? currentCategory 
    : (currentSearch ? `Search Results for "${currentSearch}"` : 'All Products');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-navy-900">{displayCategoryTitle}</h1>
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="btn-outline flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
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
              {(currentCategory || currentSearch || currentMinPrice || currentMaxPrice || currentSort) && (
                <button onClick={clearFilters} className="text-xs font-semibold text-orange-600 hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Categories</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <label className="flex items-center gap-2 cursor-pointer py-1 hover:text-orange-600">
                  <input 
                    type="radio" 
                    name="category"
                    checked={!currentCategory || currentCategory === 'All'}
                    onChange={() => handleCategorySelect('')}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className={`text-sm ${(!currentCategory || currentCategory === 'All') ? 'font-bold text-orange-600' : 'text-gray-600'}`}>
                    All Products
                  </span>
                </label>
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center gap-2 cursor-pointer py-1 hover:text-orange-600">
                    <input 
                      type="radio"
                      name="category"
                      checked={currentCategory === cat.name}
                      onChange={() => handleCategorySelect(cat.name)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className={`text-sm ${currentCategory === cat.name ? 'font-bold text-orange-600' : 'text-gray-600'}`}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Price Range (₹)</h3>
              <div className="flex items-center gap-2 mb-3">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={priceInput.min}
                  onChange={(e) => setPriceInput({...priceInput, min: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={priceInput.max}
                  onChange={(e) => setPriceInput({...priceInput, max: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button 
                onClick={applyPriceFilter}
                className="w-full bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-800 font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                Apply Price
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="hidden md:flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div>
              <h1 className="text-2xl font-extrabold text-navy-900">
                {displayCategoryTitle}
              </h1>
              <p className="text-xs text-gray-500 mt-1">Showing {products.length} of {totalProducts} items</p>
            </div>
            
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-gray-600 text-sm font-medium">Sort by:</label>
              <select 
                id="sort"
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="py-1.5 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
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
          <div className="md:hidden mb-4">
            <select 
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white"
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
            <div className="flex justify-center items-center py-24">
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
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition ${
                          currentPage === i + 1 
                            ? 'bg-orange-500 text-white shadow-sm' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">No products found</h2>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                We couldn't find any products matching your current filters.
              </p>
              <button 
                onClick={clearFilters} 
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-sm"
              >
                View All Products
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;

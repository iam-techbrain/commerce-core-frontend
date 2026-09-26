import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/product/ProductCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIdParam = searchParams.get('categoryId');

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryIdParam ? parseInt(categoryIdParam) : null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state if URL query param changes
  useEffect(() => {
    if (categoryIdParam) {
      setSelectedCategoryId(parseInt(categoryIdParam));
    } else {
      setSelectedCategoryId(null);
    }
  }, [categoryIdParam]);

  // Fetch Categories for Filter Pills
  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch Paginated Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        sortBy,
        sortOrder
      });
      if (selectedCategoryId) params.append('categoryId', selectedCategoryId);
      if (search) params.append('search', search);

      const res = await API.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategoryId, search, sortBy, sortOrder]);

  const handleCategorySelect = (catId) => {
    setSelectedCategoryId(catId);
    setPage(1);
    if (catId) {
      setSearchParams({ categoryId: catId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="wrap" style={{ padding: '50px 32px' }}>
      <div className="sec-head" style={{ marginBottom: '28px' }}>
        <div>
          <span className="eyebrow">Browse Sports Catalog</span>
          <h1 className="display" style={{ fontSize: '36px', color: 'var(--pitch)', marginTop: '6px' }}>
            Products Catalog
          </h1>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              style={{ paddingLeft: '36px', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '13px' }}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <select
            className="form-control"
            style={{ width: 'auto', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: '4px', padding: '10px 14px', fontSize: '13px', fontWeight: 600 }}
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by);
              setSortOrder(order);
              setPage(1);
            }}
          >
            <option value="createdAt-desc">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="filter-pills">
        <button
          className={`pill-btn ${selectedCategoryId === null ? 'active' : ''}`}
          onClick={() => handleCategorySelect(null)}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`pill-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat.id)}
          >
            {cat.name} ({cat._count?.products || 0})
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink-soft)' }}>Loading Products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--line)' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--ink-soft)' }}>No products found in this category.</p>
        </div>
      ) : (
        <div className="prod-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '48px' }}>
          <button 
            className="btn btn-outline" 
            style={{ color: 'var(--pitch)', borderColor: 'var(--line)' }}
            disabled={!pagination.hasPrevPage} 
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={18} />
            <span>Prev</span>
          </button>
          <span style={{ fontWeight: 700, fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button 
            className="btn btn-outline" 
            style={{ color: 'var(--pitch)', borderColor: 'var(--line)' }}
            disabled={!pagination.hasNextPage} 
            onClick={() => setPage(page + 1)}
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

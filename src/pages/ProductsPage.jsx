import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/common/Pagination';
import { Search, Filter } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIdParam = searchParams.get('categoryId');
  const subCategoryIdParam = searchParams.get('subCategoryId');

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryIdParam ? parseInt(categoryIdParam) : null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(subCategoryIdParam ? parseInt(subCategoryIdParam) : null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state if URL query params change
  useEffect(() => {
    if (categoryIdParam) {
      setSelectedCategoryId(parseInt(categoryIdParam));
    } else {
      setSelectedCategoryId(null);
    }

    if (subCategoryIdParam) {
      setSelectedSubCategoryId(parseInt(subCategoryIdParam));
    } else {
      setSelectedSubCategoryId(null);
    }
  }, [categoryIdParam, subCategoryIdParam]);

  // Fetch Categories for Filter Pills
  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch Subcategories (filtered by category if selected)
  useEffect(() => {
    const url = selectedCategoryId ? `/subcategories?categoryId=${selectedCategoryId}` : '/subcategories';
    API.get(url)
      .then((res) => {
        if (res.data.success) setSubcategories(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [selectedCategoryId]);

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

      if (selectedSubCategoryId) {
        params.append('subCategoryId', selectedSubCategoryId);
      } else if (selectedCategoryId) {
        params.append('categoryId', selectedCategoryId);
      }

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
  }, [page, selectedCategoryId, selectedSubCategoryId, search, sortBy, sortOrder]);

  const handleCategorySelect = (catId) => {
    setSelectedCategoryId(catId);
    setSelectedSubCategoryId(null); // Reset subcategory filter when switching main category
    setPage(1);
    if (catId) {
      setSearchParams({ categoryId: catId });
    } else {
      setSearchParams({});
    }
  };

  const handleSubCategorySelect = (subId) => {
    setSelectedSubCategoryId(subId);
    setPage(1);
    const newParams = {};
    if (selectedCategoryId) newParams.categoryId = selectedCategoryId;
    if (subId) newParams.subCategoryId = subId;
    setSearchParams(newParams);
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

      {/* Main Category Filter Pills */}
      <div className="filter-pills" style={{ marginBottom: '12px' }}>
        <button
          className={`pill-btn ${selectedCategoryId === null && selectedSubCategoryId === null ? 'active' : ''}`}
          onClick={() => {
            setSelectedSubCategoryId(null);
            handleCategorySelect(null);
          }}
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

      {/* SubCategory Filter Pills (When Main Category or SubCategory is Active) */}
      {subcategories.length > 0 && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            background: 'var(--parchment)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid var(--line-dark)',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: 'var(--pitch)', marginRight: '8px' }}>
            <Filter size={14} />
            <span>SUBCATEGORIES:</span>
          </div>

          <button
            style={{
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedSubCategoryId === null ? '1px solid var(--pitch)' : '1px solid var(--line-dark)',
              background: selectedSubCategoryId === null ? 'var(--pitch)' : 'var(--white)',
              color: selectedSubCategoryId === null ? '#fff' : 'var(--ink)'
            }}
            onClick={() => handleSubCategorySelect(null)}
          >
            All Subcategories
          </button>

          {subcategories.map((sub) => (
            <button
              key={sub.id}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedSubCategoryId === sub.id ? '1px solid var(--gold-dark)' : '1px solid var(--line-dark)',
                background: selectedSubCategoryId === sub.id ? 'var(--gold-dark)' : 'var(--white)',
                color: selectedSubCategoryId === sub.id ? '#fff' : 'var(--ink)'
              }}
              onClick={() => handleSubCategorySelect(sub.id)}
            >
              {sub.name} ({sub._count?.products || 0})
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink-soft)' }}>Loading Products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--line)' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--ink-soft)' }}>No products found in this selection.</p>
        </div>
      ) : (
        <div className="prod-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage || page}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          limit={pagination.limit || 12}
          onPageChange={(newPage) => setPage(newPage)}
          scrollToTop={true}
        />
      )}
    </div>
  );
};

export default ProductsPage;

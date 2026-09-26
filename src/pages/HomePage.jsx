import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import CategoryGrid from '../components/category/CategoryGrid';
import ProductGrid from '../components/product/ProductGrid';
import { Sparkles, ArrowRight } from 'lucide-react';

const HomePage = ({ searchQuery }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [page, setPage] = useState(1);

  // 1. Fetch Categories
  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 2. Fetch Products with Pagination & Filter
  const fetchProducts = async (currentPage, categoryId, search) => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 8
      });
      if (categoryId) params.append('categoryId', categoryId);
      if (search) params.append('search', search);

      const res = await API.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts(page, selectedCategoryId, searchQuery);
  }, [page, selectedCategoryId, searchQuery]);

  const handleSelectCategory = (catId) => {
    setSelectedCategoryId(catId);
    setPage(1); // Reset to page 1 when category changes
  };

  return (
    <div>
      {/* Hero Banner */}
      {!searchQuery && !selectedCategoryId && (
        <section className="hero-banner">
          <div className="hero-content">
            <h1>Elevate Your Lifestyle with Premium SaaS Products</h1>
            <p>Discover handpicked collections with instant Razorpay checkout & 24h fast dispatch.</p>
            <button className="btn-primary">
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* Category Cards Grid */}
      <CategoryGrid
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* Product Cards Grid with Pagination */}
      <ProductGrid
        products={products}
        pagination={pagination}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default HomePage;

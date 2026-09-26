import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Layers } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="wrap" style={{ padding: '50px 32px' }}>
      <div className="sec-head" style={{ marginBottom: '36px' }}>
        <div>
          <span className="eyebrow">Explore Store Categories</span>
          <h1 className="display" style={{ fontSize: '36px', color: 'var(--pitch)', marginTop: '6px' }}>
            All Sports Categories
          </h1>
        </div>
        <p style={{ color: 'var(--ink-soft)' }}>Select a category to view high performance gear</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink-soft)' }}>Loading Categories...</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--line)' }}>
          <p style={{ color: 'var(--ink-soft)' }}>No categories found in store.</p>
        </div>
      ) : (
        <div className="cat-grid">
          {categories.map((cat) => {
            const imageSrc = cat.imageUrl
              ? (cat.imageUrl.startsWith('http') ? cat.imageUrl : `http://localhost:5000${cat.imageUrl}`)
              : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500';

            return (
              <div
                key={cat.id}
                className="cat-card"
                onClick={() => navigate(`/products?categoryId=${cat.id}`)}
              >
                <img src={imageSrc} alt={cat.name} />
                <div className="cat-overlay">
                  <div className="cat-label">
                    <span>{cat.name} ({cat._count?.products || 0})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

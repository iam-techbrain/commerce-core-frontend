import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ChevronRight, Tag } from 'lucide-react';
import { getImageUrl } from '../utils/image.util';

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
          <span className="eyebrow">Explore Sports Taxonomy</span>
          <h1 className="display" style={{ fontSize: '36px', color: 'var(--pitch)', marginTop: '6px' }}>
            Categories & Subcategories
          </h1>
        </div>
        <p style={{ color: 'var(--ink-soft)' }}>Select a main category or specific subcategory to view specialized sports gear</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink-soft)' }}>Loading Categories...</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--line)' }}>
          <p style={{ color: 'var(--ink-soft)' }}>No categories found in store.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {categories.map((cat) => {
            const imageSrc = getImageUrl(cat.imageUrl, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500');

            return (
              <div
                key={cat.id}
                style={{
                  background: 'var(--white)',
                  borderRadius: '16px',
                  border: '1px solid var(--line)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="hover-card"
              >
                {/* Image Banner Header */}
                <div 
                  style={{ position: 'relative', height: '180px', cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                >
                  <img 
                    src={imageSrc} 
                    alt={cat.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 70%)' }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', color: '#fff' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                      {cat.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.85, margin: '2px 0 0' }}>
                      {cat.subcategories?.length || 0} Subcategories Available
                    </p>
                  </div>
                </div>

                {/* Subcategories List Pills */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={12} />
                      <span>Subcategories</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        cat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products?subCategoryId=${sub.id}`);
                            }}
                            style={{
                              background: 'var(--parchment)',
                              border: '1px solid var(--line-dark)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: 'var(--pitch)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--pitch)';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'var(--parchment)';
                              e.currentTarget.style.color = 'var(--pitch)';
                            }}
                          >
                            {sub.name} ({sub._count?.products || 0})
                          </button>
                        ))
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--ink-soft)', fontStyle: 'italic' }}>No subcategories created yet</span>
                      )}
                    </div>
                  </div>

                  {/* View All Button */}
                  <button
                    onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      marginTop: '20px',
                      justifyContent: 'center',
                      fontSize: '13px',
                      padding: '8px',
                      borderColor: 'var(--line)'
                    }}
                  >
                    <span>Explore All {cat.name}</span>
                    <ChevronRight size={16} />
                  </button>
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

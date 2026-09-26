import React from 'react';
import CategoryCard from './CategoryCard';
import { Layers } from 'lucide-react';

const CategoryGrid = ({ categories, selectedCategoryId, onSelectCategory }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section style={{ marginBottom: '40px' }}>
      <div className="section-header">
        <h2 className="section-title">
          <Layers size={22} color="var(--primary)" />
          <span>Shop by Categories</span>
        </h2>
        {selectedCategoryId && (
          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => onSelectCategory(null)}>
            Clear Category Filter
          </button>
        )}
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;

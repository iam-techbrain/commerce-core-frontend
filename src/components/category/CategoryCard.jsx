import React from 'react';

const CategoryCard = ({ category, selectedCategoryId, onSelectCategory }) => {
  const isSelected = selectedCategoryId === category.id;
  const imageSrc = category.imageUrl
    ? `${category.imageUrl}`
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';

  return (
    <div
      className={`category-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelectCategory(isSelected ? null : category.id)}
      style={{
        borderColor: isSelected ? 'var(--primary)' : 'var(--card-border)',
        boxShadow: isSelected ? '0 0 0 2px var(--primary)' : 'none'
      }}
    >
      <img src={imageSrc} alt={category.name} className="category-image" />
      <h3>{category.name}</h3>
      <p>{category._count?.products || 0} Items</p>
    </div>
  );
};

export default CategoryCard;

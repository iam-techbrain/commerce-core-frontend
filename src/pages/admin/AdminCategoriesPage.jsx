import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Layers, X, Home, ChevronRight, Tag } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Form State for SubCategory
  const [showSubModal, setShowSubModal] = useState(false);
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [parentCatId, setParentCatId] = useState('');

  const fetchAllData = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        API.get('/categories'),
        API.get('/subcategories')
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (subRes.data.success) setSubcategories(subRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (imageFile) formData.append('image', imageFile);

      const res = await API.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert('Main Category successfully add ho gayi! 📁');
        setShowCategoryModal(false);
        setName('');
        setDescription('');
        setImageFile(null);
        fetchAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Category add error!');
    }
  };

  const handleCreateSubCategory = async (e) => {
    e.preventDefault();
    try {
      if (!parentCatId) {
        alert('Kripya Parent Category select karein!');
        return;
      }

      const res = await API.post('/subcategories', {
        name: subName,
        description: subDesc,
        categoryId: parseInt(parentCatId)
      });

      if (res.data.success) {
        alert('Subcategory successfully add ho gayi! 🏷️');
        setShowSubModal(false);
        setSubName('');
        setSubDesc('');
        setParentCatId('');
        fetchAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Subcategory add error!');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Kya aap is main category ko delete karna chahte hain?')) return;
    try {
      const res = await API.delete(`/categories/${id}`);
      if (res.data.success) {
        alert('Category delete ho gayi!');
        fetchAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Category delete nahi ho sakti!');
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (!window.confirm('Kya aap is subcategory ko delete karna chahte hain?')) return;
    try {
      const res = await API.delete(`/subcategories/${id}`);
      if (res.data.success) {
        alert('Subcategory delete ho gayi!');
        fetchAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Subcategory delete nahi ho sakti!');
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* Admin Page Header with Breadcrumb */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1>Manage Categories & Subcategories</h1>
            <p>Organize products into main categories and subcategories taxonomy.</p>
          </div>

          <div className="admin-breadcrumb">
            <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} />
              <span>Home</span>
            </NavLink>
            <ChevronRight size={12} style={{ opacity: 0.5 }} />
            <span>Taxonomy</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button
            className="btn-primary"
            onClick={() => setShowCategoryModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--admin-primary)',
              borderColor: 'var(--admin-primary)'
            }}
          >
            <Plus size={18} />
            <span>Add Main Category</span>
          </button>

          <button
            className="btn-primary"
            onClick={() => setShowSubModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#10B981',
              borderColor: '#10B981'
            }}
          >
            <Plus size={18} />
            <span>Add Subcategory</span>
          </button>
        </div>

        {/* Add Category Modal */}
        {showCategoryModal && (
          <div
            className="cart-overlay"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            onClick={() => setShowCategoryModal(false)}
          >
            <div
              className="auth-card"
              style={{ maxWidth: '480px', width: '92%', borderRadius: '12px', padding: '24px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--admin-text-dark)' }}>
                  Add New Main Category
                </h2>
                <button
                  className="icon-btn"
                  onClick={() => setShowCategoryModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateCategory}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    className="form-control"
                    required
                    placeholder="e.g. Cricket"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    className="form-control"
                    placeholder="Bats, balls, and protective gear"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Banner Image</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '16px', background: 'var(--admin-primary)', borderColor: 'var(--admin-primary)' }}
                >
                  Save Main Category
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Add SubCategory Modal */}
        {showSubModal && (
          <div
            className="cart-overlay"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            onClick={() => setShowSubModal(false)}
          >
            <div
              className="auth-card"
              style={{ maxWidth: '480px', width: '92%', borderRadius: '12px', padding: '24px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--admin-text-dark)' }}>
                  Add New Subcategory
                </h2>
                <button
                  className="icon-btn"
                  onClick={() => setShowSubModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSubCategory}>
                <div className="form-group">
                  <label>Select Parent Category *</label>
                  <select
                    className="form-control"
                    required
                    value={parentCatId}
                    onChange={(e) => setParentCatId(e.target.value)}
                  >
                    <option value="">-- Choose Parent Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subcategory Name *</label>
                  <input
                    className="form-control"
                    required
                    placeholder="e.g. Cricket Bats"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    className="form-control"
                    placeholder="English Willow & Kashmir Willow bats"
                    value={subDesc}
                    onChange={(e) => setSubDesc(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '16px', background: '#10B981', borderColor: '#10B981' }}
                >
                  Save Subcategory
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Categories Table Card */}
        <div className="admin-card" style={{ marginBottom: '32px' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Layers size={20} color="var(--admin-primary)" />
              <span>Main Categories ({categories.length})</span>
            </h3>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Loading categories...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Subcategories Count</th>
                    <th>Product Count</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={c.imageUrl ? (c.imageUrl.startsWith('http') ? c.imageUrl : `http://localhost:5000${c.imageUrl}`) : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100'}
                          alt={c.name}
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
                        />
                        <span style={{ fontWeight: 700, color: 'var(--admin-text-dark)' }}>{c.name}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#10B981' }}>
                          {c.subcategories?.length || 0} Subcategories
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(78, 115, 223, 0.1)', color: 'var(--admin-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                          {c._count?.products || 0} Products
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="icon-btn"
                          style={{ color: 'var(--admin-danger)', borderColor: 'transparent' }}
                          onClick={() => handleDeleteCategory(c.id)}
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Subcategories Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Tag size={20} color="#10B981" />
              <span>Subcategories Table ({subcategories.length})</span>
            </h3>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Loading subcategories...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subcategory Name</th>
                    <th>Parent Main Category</th>
                    <th>Products Count</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((sub) => (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 700, color: 'var(--admin-text-dark)' }}>{sub.name}</td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', background: '#F3F4F6', fontWeight: 700, fontSize: '0.75rem', color: '#1F2937' }}>
                          {sub.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(78, 115, 223, 0.1)', color: 'var(--admin-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                          {sub._count?.products || 0} Products
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="icon-btn"
                          style={{ color: 'var(--admin-danger)', borderColor: 'transparent' }}
                          onClick={() => handleDeleteSubCategory(sub.id)}
                          title="Delete Subcategory"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;

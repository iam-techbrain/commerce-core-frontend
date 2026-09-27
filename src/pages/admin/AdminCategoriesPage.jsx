import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Layers, X, Home, ChevronRight } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
        alert('Category successfully add ho gayi! 📁');
        setShowModal(false);
        setName('');
        setDescription('');
        setImageFile(null);
        fetchCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Category add error!');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Kya aap is category ko delete karna chahte hain?')) return;
    try {
      const res = await API.delete(`/categories/${id}`);
      if (res.data.success) {
        alert('Category delete ho gayi!');
        fetchCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Category delete nahi ho sakti kyunki isme products hain!');
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* Admin Page Header with Breadcrumb */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1>Manage Categories</h1>
            <p>Organize products into hierarchical sport categories and collections.</p>
          </div>

          <div className="admin-breadcrumb">
            <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} />
              <span>Home</span>
            </NavLink>
            <ChevronRight size={12} style={{ opacity: 0.5 }} />
            <span>Categories</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--admin-primary)',
              borderColor: 'var(--admin-primary)',
              boxShadow: '0 4px 12px rgba(78, 115, 223, 0.25)'
            }}
          >
            <Plus size={18} />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div
            className="cart-overlay"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="auth-card"
              style={{ maxWidth: '480px', width: '92%', borderRadius: '12px', padding: '24px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--admin-text-dark)' }}>
                  Add New Category
                </h2>
                <button
                  className="icon-btn"
                  onClick={() => setShowModal(false)}
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
                    placeholder="e.g. Badminton Gear"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    className="form-control"
                    placeholder="Racquets, shuttlecocks, and grips"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Category Banner Image</label>
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
                  Save & Publish Category
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Categories Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Layers size={20} color="var(--admin-primary)" />
              <span>All Categories ({categories.length})</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
              Master taxonomy list
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Loading categories...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
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
                      <td style={{ color: 'var(--admin-text-muted)' }}>{c.description || 'N/A'}</td>
                      <td>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: 'rgba(78, 115, 223, 0.1)',
                            color: 'var(--admin-primary)',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
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
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;

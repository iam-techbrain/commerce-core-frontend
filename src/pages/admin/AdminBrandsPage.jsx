import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Tag, X, Home, ChevronRight } from 'lucide-react';

const AdminBrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  const fetchBrands = async () => {
    try {
      const res = await API.get('/brands');
      if (res.data.success) setBrands(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (logoFile) formData.append('logo', logoFile);

      const res = await API.post('/brands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert('Brand successfully add ho gaya! 🏷️');
        setShowModal(false);
        setName('');
        setDescription('');
        setLogoFile(null);
        fetchBrands();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Brand add error!');
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Kya aap is brand ko delete karna chahte hain?')) return;
    try {
      const res = await API.delete(`/brands/${id}`);
      if (res.data.success) {
        alert('Brand delete ho gaya!');
        fetchBrands();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Brand delete nahi ho sakta!');
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* Admin Page Header with Breadcrumb */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1>Manage Brands</h1>
            <p>Maintain authorized manufacturer brands, logos, and athletic partnerships.</p>
          </div>

          <div className="admin-breadcrumb">
            <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} />
              <span>Home</span>
            </NavLink>
            <ChevronRight size={12} style={{ opacity: 0.5 }} />
            <span>Brands</span>
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
            <span>Add New Brand</span>
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
                  Add New Brand
                </h2>
                <button
                  className="icon-btn"
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateBrand}>
                <div className="form-group">
                  <label>Brand Name *</label>
                  <input
                    className="form-control"
                    required
                    placeholder="e.g. Yonex, Wilson, Cosco"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Brand details or tagline"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Brand Logo</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '16px', background: 'var(--admin-primary)', borderColor: 'var(--admin-primary)' }}
                >
                  Save & Publish Brand
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Brands Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Tag size={20} color="var(--admin-primary)" />
              <span>All Brands ({brands.length})</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
              Official brand partners
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Loading brands...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Brand Name</th>
                    <th>Description</th>
                    <th>Product Count</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '28px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                        No brands found. Click "Add New Brand" to create one.
                      </td>
                    </tr>
                  ) : (
                    brands.map((b) => (
                      <tr key={b.id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={b.logoUrl ? (b.logoUrl.startsWith('http') ? b.logoUrl : `http://localhost:5000${b.logoUrl}`) : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'}
                            alt={b.name}
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
                          />
                          <span style={{ fontWeight: 700, color: 'var(--admin-text-dark)' }}>{b.name}</span>
                        </td>
                        <td style={{ color: 'var(--admin-text-muted)' }}>{b.description || 'N/A'}</td>
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
                            {b._count?.products || 0} Products
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="icon-btn"
                            style={{ color: 'var(--admin-danger)', borderColor: 'transparent' }}
                            onClick={() => handleDeleteBrand(b.id)}
                            title="Delete Brand"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBrandsPage;

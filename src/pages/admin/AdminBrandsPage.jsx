import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Tag, X, Home, ChevronRight, Edit2, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/image.util';
import { compressImage } from '../../utils/imageCompressor';

const AdminBrandsPage = () => {
  const queryClient = useQueryClient();

  // Modal State for Adding New Brand
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrlInput, setLogoUrlInput] = useState('');

  // Inline Editing State
  // editingId: id of brand currently being edited
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    file: null,
    previewUrl: ''
  });
  const [savingId, setSavingId] = useState(null);

  const fileInputRef = useRef(null);

  // TanStack Query: Brands
  const { data: brands = [], isLoading: loading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await API.get('/brands');
      return res.data?.success ? res.data.data : [];
    }
  });

  const fetchBrands = () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  };

  // Start Inline Edit
  const handleStartEdit = (b) => {
    setEditingId(b.id);
    setEditFormData({
      name: b.name || '',
      description: b.description || '',
      logoUrl: b.logoUrl || '',
      file: null,
      previewUrl: b.logoUrl ? getImageUrl(b.logoUrl) : ''
    });
  };

  // Cancel Inline Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      name: '',
      description: '',
      logoUrl: '',
      file: null,
      previewUrl: ''
    });
  };

  // Handle Logo File in Inline Edit (Auto compressed to ~30-50 KB)
  const handleEditFileChange = async (e) => {
    const rawFile = e.target.files[0];
    if (rawFile) {
      const file = await compressImage(rawFile);
      const objectUrl = URL.createObjectURL(file);
      setEditFormData((prev) => ({
        ...prev,
        file: file,
        previewUrl: objectUrl
      }));
    }
  };

  // Save Inline Edit
  const handleSaveEdit = async (id) => {
    if (!editFormData.name.trim()) {
      alert('Brand name cannot be empty!');
      return;
    }

    setSavingId(id);
    try {
      if (editFormData.file) {
        const formData = new FormData();
        formData.append('name', editFormData.name.trim());
        formData.append('description', editFormData.description.trim());
        formData.append('logo', editFormData.file);

        const res = await API.put(`/brands/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          handleCancelEdit();
          fetchBrands();
        }
      } else {
        // Simple JSON update (supports updating name, description, or logoUrl)
        const res = await API.put(`/brands/${id}`, {
          name: editFormData.name.trim(),
          description: editFormData.description.trim(),
          logoUrl: editFormData.logoUrl.trim()
        });
        if (res.data.success) {
          handleCancelEdit();
          fetchBrands();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update brand!');
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (logoFile) {
        formData.append('logo', logoFile);
      } else if (logoUrlInput.trim()) {
        formData.append('logoUrl', logoUrlInput.trim());
      }

      const res = await API.post('/brands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert('Brand successfully add ho gaya! 🏷️');
        setShowModal(false);
        setName('');
        setDescription('');
        setLogoFile(null);
        setLogoUrlInput('');
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
            <p>Maintain authorized sports brands. Quick-edit any name, description, or logo directly in the list or via the edit icon.</p>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            💡 <strong>Quick Edit:</strong> Click the <strong>Edit (✏️)</strong> icon on the right or click on any brand to edit directly in the table.
          </div>
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

        {/* Modal Form for Adding Brand */}
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
                    placeholder="e.g. Yonex, Head, SS Cricket"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Brand details, specialty or tagline"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Upload Logo File (Auto-compressed to ~50 KB)</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files[0]) {
                        const compressed = await compressImage(e.target.files[0]);
                        setLogoFile(compressed);
                      }
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Or Logo Image URL</label>
                  <input
                    className="form-control"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
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
                    <th style={{ width: '80px' }}>Logo</th>
                    <th style={{ width: '220px' }}>Brand Name</th>
                    <th>Description</th>
                    <th style={{ width: '130px' }}>Products</th>
                    <th style={{ width: '160px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '28px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                        No brands found. Click "Add New Brand" to create one.
                      </td>
                    </tr>
                  ) : (
                    brands.map((b) => {
                      const isEditing = editingId === b.id;
                      const isSaving = savingId === b.id;

                      if (isEditing) {
                        return (
                          <tr key={b.id} style={{ background: 'rgba(78, 115, 223, 0.05)', borderLeft: '3px solid var(--admin-primary)' }}>
                            {/* Editable Logo */}
                            <td>
                              <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                                <img
                                  src={editFormData.previewUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'}
                                  alt="Preview"
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                    border: '1.5px solid var(--admin-primary)'
                                  }}
                                />
                                <label
                                  title="Change Logo Image"
                                  style={{
                                    position: 'absolute',
                                    bottom: '-4px',
                                    right: '-4px',
                                    background: 'var(--admin-primary)',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                  }}
                                >
                                  <Upload size={12} />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleEditFileChange}
                                  />
                                </label>
                              </div>
                            </td>

                            {/* Editable Brand Name */}
                            <td>
                              <input
                                className="form-control"
                                style={{ fontWeight: 700, padding: '6px 10px', fontSize: '13.5px' }}
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                placeholder="Brand Name"
                                autoFocus
                              />
                              <div style={{ marginTop: '4px' }}>
                                <input
                                  className="form-control"
                                  style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--admin-text-muted)' }}
                                  value={editFormData.logoUrl}
                                  onChange={(e) => setEditFormData({ ...editFormData, logoUrl: e.target.value, previewUrl: e.target.value })}
                                  placeholder="Or paste image URL"
                                />
                              </div>
                            </td>

                            {/* Editable Description */}
                            <td>
                              <textarea
                                className="form-control"
                                rows={2}
                                style={{ fontSize: '13px', padding: '6px 10px', resize: 'vertical' }}
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                placeholder="Brand description or tagline"
                              />
                            </td>

                            {/* Products Count */}
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

                            {/* Inline Actions */}
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                  className="btn-primary"
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: '#10B981',
                                    borderColor: '#10B981'
                                  }}
                                  onClick={() => handleSaveEdit(b.id)}
                                  disabled={isSaving}
                                  title="Save changes"
                                >
                                  <Check size={14} />
                                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                </button>
                                <button
                                  className="icon-btn"
                                  style={{
                                    padding: '6px 10px',
                                    background: '#F3F4F6',
                                    border: '1px solid var(--admin-border)',
                                    color: '#4B5563',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={handleCancelEdit}
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      // Normal Display Row (Clicking name or Edit icon activates inline editing)
                      return (
                        <tr
                          key={b.id}
                          style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                          onDoubleClick={() => handleStartEdit(b)}
                          title="Double-click row or click edit icon to edit"
                        >
                          <td>
                            <img
                              src={b.logoUrl ? (b.logoUrl.startsWith('http') ? b.logoUrl : getImageUrl(b.logoUrl)) : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'}
                              alt={b.name}
                              style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
                              onClick={() => handleStartEdit(b)}
                            />
                          </td>
                          <td>
                            <div
                              onClick={() => handleStartEdit(b)}
                              style={{
                                fontWeight: 700,
                                color: 'var(--admin-text-dark)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <span>{b.name}</span>
                            </div>
                          </td>
                          <td
                            onClick={() => handleStartEdit(b)}
                            style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}
                          >
                            {b.description || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>No description</span>}
                          </td>
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
                            <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                              <button
                                className="icon-btn"
                                style={{
                                  color: 'var(--admin-primary)',
                                  borderColor: 'var(--admin-border)',
                                  background: '#fff',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(b);
                                }}
                                title="Edit Brand inline"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="icon-btn"
                                style={{
                                  color: 'var(--admin-danger)',
                                  borderColor: 'var(--admin-border)',
                                  background: '#fff',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBrand(b.id);
                                }}
                                title="Delete Brand"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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

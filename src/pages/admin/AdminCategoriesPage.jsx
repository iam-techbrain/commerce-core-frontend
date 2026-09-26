import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Layers, X } from 'lucide-react';

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
        alert('Category add ho gayi! 📁');
        setShowModal(false);
        setName(''); setDescription(''); setImageFile(null);
        fetchCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Category add error!');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await API.delete(`/categories/${id}`);
      if (res.data.success) {
        alert('Category delete ho gayi!');
        fetchCategories();
      }
    } catch (err) {
      // Show Backend Product Protection Validation Error Message!
      alert(err.response?.data?.message || 'Category delete Nahi ho sakti!');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <h1 className="section-title">Manage Categories</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add New Category
          </button>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="cart-overlay">
            <div className="auth-card" style={{ maxWidth: '480px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Add New Category</h2>
                <button className="icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateCategory}>
                <div className="form-group">
                  <label>Category Name</label>
                  <input className="form-control" required placeholder="Electronics" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input className="form-control" placeholder="Gadgets and electronic items" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Category Banner Image</label>
                  <input className="form-control" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  Save Category
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="profile-card">
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading categories...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px' }}>Category Name</th>
                  <th style={{ padding: '12px' }}>Description</th>
                  <th style={{ padding: '12px' }}>Product Count</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={c.imageUrl ? `http://localhost:5000${c.imageUrl}` : 'https://via.placeholder.com/40'} alt={c.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{c.description || 'N/A'}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{c._count?.products || 0} Products</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button className="icon-btn" style={{ color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => handleDeleteCategory(c.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;

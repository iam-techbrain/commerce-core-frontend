import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Tag, X } from 'lucide-react';

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
        alert('Brand add ho gaya! 🏷️');
        setShowModal(false);
        setName(''); setDescription(''); setLogoFile(null);
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
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <h1 className="section-title">Manage Brands</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add New Brand
          </button>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="cart-overlay">
            <div className="auth-card" style={{ maxWidth: '480px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Add New Brand</h2>
                <button className="icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateBrand}>
                <div className="form-group">
                  <label>Brand Name</label>
                  <input className="form-control" required placeholder="e.g. Nike, Adidas, Cosco" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows={3} placeholder="Brand details or tagline" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Brand Logo</label>
                  <input className="form-control" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  Save Brand
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Brands Table */}
        <div className="profile-card">
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading brands...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px' }}>Brand Name</th>
                  <th style={{ padding: '12px' }}>Description</th>
                  <th style={{ padding: '12px' }}>Product Count</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Koi Brand nahi mila. Naya brand add karein!
                    </td>
                  </tr>
                ) : (
                  brands.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={b.logoUrl ? `http://localhost:5000${b.logoUrl}` : 'https://via.placeholder.com/40?text=Brand'}
                          alt={b.name}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{b.name}</span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{b.description || 'N/A'}</td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{b._count?.products || 0} Products</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button className="icon-btn" style={{ color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => handleDeleteBrand(b.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBrandsPage;

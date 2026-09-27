import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Edit3, Package, X } from 'lucide-react';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        API.get('/products?limit=100'),
        API.get('/categories'),
        API.get('/brands')
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (brandRes.data.success) setBrands(brandRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('categoryId', categoryId);
      if (brandId) formData.append('brandId', brandId);
      if (description) formData.append('description', description);
      if (imageFile) formData.append('image', imageFile);

      const res = await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert('Product add ho gaya! 📦');
        setShowModal(false);
        setName(''); setPrice(''); setStock(''); setCategoryId(''); setBrandId(''); setDescription(''); setImageFile(null);
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Product add error!');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Kya aap is product ko delete karna chahte hain?')) return;
    try {
      const res = await API.delete(`/products/${id}`);
      if (res.data.success) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete error');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <h1 className="section-title">Manage Products</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add New Product
          </button>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="cart-overlay">
            <div className="auth-card" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Add New Product</h2>
                <button className="icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateProduct}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input className="form-control" required placeholder="e.g. Yonex Badminton Racket" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input className="form-control" type="number" required placeholder="999" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Stock Count</label>
                    <input className="form-control" type="number" required placeholder="50" value={stock} onChange={(e) => setStock(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Brand (Optional)</label>
                    <select className="form-control" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                      <option value="">-- Select Brand --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows={3} placeholder="Product features, specifications and details..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input className="form-control" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  Save Product
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="profile-card">
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading products...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px' }}>Product</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Brand</th>
                  <th style={{ padding: '12px' }}>Price</th>
                  <th style={{ padding: '12px' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Koi Product nahi mila. Naya product add karein!
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={
                            p.imageUrl
                              ? p.imageUrl.startsWith('http')
                                ? p.imageUrl
                                : `http://localhost:5000${p.imageUrl}`
                              : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100'
                          }
                          alt={p.name}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          {p.description && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>{p.category?.name || 'General'}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: p.brand?.name || p.brandName ? 'var(--primary)' : 'var(--text-muted)'
                        }}>
                          {p.brand?.name || p.brandName || 'No Brand'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--secondary)', fontWeight: 700 }}>₹{p.price}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ color: p.stock <= 5 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                          {p.stock} units
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button className="icon-btn" style={{ color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => handleDeleteProduct(p.id)}>
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

export default AdminProductsPage;

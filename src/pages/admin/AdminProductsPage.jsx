import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Plus,
  Trash2,
  Package,
  X,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [masterAttributes, setMasterAttributes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State (Single Add/Edit)
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [mrp, setMrp] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [description, setDescription] = useState('');
  
  // Image handling
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'file'
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState('');
  const [downloadImages, setDownloadImages] = useState(true); // Download locally to prevent 3rd-party dependency!

  // Variants handling
  const [hasVariants, setHasVariants] = useState(false);
  const [variantsList, setVariantsList] = useState([]);

  // Bulk Upload Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkDownloadImages, setBulkDownloadImages] = useState(true);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState(null);

  const fetchProducts = async () => {
    try {
      const [prodRes, catRes, brandRes, attrRes] = await Promise.all([
        API.get('/products?limit=100'),
        API.get('/categories'),
        API.get('/brands'),
        API.get('/attributes').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (brandRes.data.success) setBrands(brandRes.data.data);
      if (attrRes.data?.success) setMasterAttributes(attrRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Download Sample Excel Template
  const handleDownloadTemplate = async () => {
    try {
      const res = await API.get('/products/sample-template', { responseType: 'blob' });
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'chhabra_sports_products_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Template download failed. Kripya dobara try karein.');
    }
  };

  // Add Variant Row
  const handleAddVariantRow = () => {
    setVariantsList([
      ...variantsList,
      {
        attr1Name: masterAttributes[0]?.name || 'Color',
        attr1Val: masterAttributes[0]?.values[0]?.value || '',
        attr2Name: masterAttributes[1]?.name || 'Size',
        attr2Val: masterAttributes[1]?.values[0]?.value || '',
        mrp: mrp || '',
        price: price || '',
        stock: '10',
        imageUrl: ''
      }
    ]);
  };

  const handleRemoveVariantRow = (index) => {
    setVariantsList(variantsList.filter((_, i) => i !== index));
  };

  const handleUpdateVariantField = (index, field, value) => {
    const updated = [...variantsList];
    updated[index][field] = value;
    setVariantsList(updated);
  };

  // Create Single Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      let finalImages = [];
      if (galleryUrls.trim()) {
        finalImages = galleryUrls.split(',').map((u) => u.trim()).filter(Boolean);
      } else if (imageUrl.trim()) {
        finalImages = [imageUrl.trim()];
      }

      // Format variants payload
      const formattedVariants = hasVariants
        ? variantsList.map((v) => {
            const attrs = {};
            if (v.attr1Name && v.attr1Val) attrs[v.attr1Name] = v.attr1Val;
            if (v.attr2Name && v.attr2Val) attrs[v.attr2Name] = v.attr2Val;

            const title = Object.values(attrs).join(' / ') || 'Standard Variant';

            return {
              title,
              attributes: attrs,
              mrp: v.mrp ? parseFloat(v.mrp) : null,
              price: parseFloat(v.price || price),
              stock: parseInt(v.stock || 0),
              imageUrl: v.imageUrl?.trim() || null
            };
          })
        : [];

      if (imageMode === 'file' && imageFile) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('sku', sku);
        if (mrp) formData.append('mrp', mrp);
        formData.append('price', price);
        formData.append('stock', stock || 0);
        formData.append('categoryId', categoryId);
        if (brandId) formData.append('brandId', brandId);
        if (description) formData.append('description', description);
        formData.append('image', imageFile);
        formData.append('hasVariants', hasVariants);
        if (hasVariants) formData.append('variants', JSON.stringify(formattedVariants));
        formData.append('downloadImages', downloadImages);

        const res = await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
          alert('🎉 Product successfully create ho gaya!');
          resetForm();
          fetchProducts();
        }
      } else {
        const payload = {
          name,
          sku: sku || undefined,
          mrp: mrp ? parseFloat(mrp) : null,
          price: parseFloat(price),
          stock: parseInt(stock || 0),
          categoryId: parseInt(categoryId),
          brandId: brandId ? parseInt(brandId) : null,
          description: description || null,
          imageUrl: imageUrl.trim() || finalImages[0] || null,
          images: finalImages,
          hasVariants,
          variants: formattedVariants,
          downloadImages
        };

        const res = await API.post('/products', payload);
        if (res.data.success) {
          alert('🎉 Product successfully create ho gaya!');
          resetForm();
          fetchProducts();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Product save karne me error aaya!');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setName('');
    setSku('');
    setMrp('');
    setPrice('');
    setStock('');
    setCategoryId('');
    setBrandId('');
    setDescription('');
    setImageFile(null);
    setImageUrl('');
    setGalleryUrls('');
    setHasVariants(false);
    setVariantsList([]);
  };

  // Submit Bulk Upload
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      alert('Kripya ek Excel (.xlsx / .csv) file select karein!');
      return;
    }

    setBulkUploading(true);
    setBulkMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', bulkFile);
      formData.append('downloadImages', bulkDownloadImages);

      const res = await API.post('/products/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setBulkMessage({ type: 'success', text: res.data.message });
        fetchProducts();
        setTimeout(() => {
          setShowBulkModal(false);
          setBulkFile(null);
          setBulkMessage(null);
        }, 2200);
      }
    } catch (err) {
      setBulkMessage({
        type: 'error',
        text: err.response?.data?.message || 'Bulk upload error. Kripya check karein file me max 50 rows hon.'
      });
    } finally {
      setBulkUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Kya aap sach me is product ko delete karna chahte hain?')) return;
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
        {/* Header with Title & Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={26} color="var(--gold)" />
              Product Catalog
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Manage single products, variants (Color, Size, Weight, Height), and batch Excel uploads.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Download Template Button */}
            <button
              className="btn-outline"
              onClick={handleDownloadTemplate}
              title="Download official sample Excel template"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} />
              <span>Download Excel Template</span>
            </button>

            {/* Bulk Upload Button */}
            <button
              className="btn-outline"
              onClick={() => {
                setShowBulkModal(true);
                setBulkMessage(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderColor: 'var(--gold)',
                color: 'var(--gold)'
              }}
            >
              <FileSpreadsheet size={16} />
              <span>Bulk Upload (Excel)</span>
            </button>

            {/* Add New Product Button */}
            <button
              className="btn-primary"
              onClick={() => {
                setShowModal(true);
                if (masterAttributes.length === 0) fetchProducts();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* -------------------- 📤 BULK UPLOAD MODAL -------------------- */}
        {showBulkModal && (
          <div className="cart-overlay">
            <div className="auth-card" style={{ maxWidth: '580px', width: '92%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: 'rgba(201, 168, 76, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold)'
                    }}
                  >
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Excel / CSV Bulk Upload</h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Upload up to 50 products per batch
                    </span>
                  </div>
                </div>
                <button className="icon-btn" onClick={() => setShowBulkModal(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Strict Batch Limit Warning Banner */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.08)',
                  border: '1px solid rgba(201, 168, 76, 0.25)',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  marginBottom: '18px',
                  fontSize: '0.82rem',
                  lineHeight: '1.4'
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: '4px' }}>
                  ⚡ Batch Upload Rules:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--ink-soft)' }}>
                  <li><strong>Limit:</strong> Maximum <strong>50 products</strong> per batch (system load safety).</li>
                  <li><strong>Variants:</strong> Rows with the same <code>productHandle</code> will group as variants.</li>
                  <li><strong>Multi-Images:</strong> Comma-separated URLs supported in the <code>images</code> column.</li>
                </ul>
              </div>

              {bulkMessage && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: bulkMessage.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: `1px solid ${bulkMessage.type === 'success' ? '#22c55e' : '#ef4444'}`,
                    color: bulkMessage.type === 'success' ? '#22c55e' : '#ef4444'
                  }}
                >
                  {bulkMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{bulkMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleBulkUpload}>
                {/* File Dropzone */}
                <div className="form-group">
                  <label>Select Spreadsheet File (.xlsx, .xls, .csv)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".xlsx, .xls, .csv"
                    required
                    onChange={(e) => setBulkFile(e.target.files[0])}
                  />
                  {bulkFile && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--gold)', marginTop: '6px' }}>
                      Selected: <strong>{bulkFile.name}</strong> ({(bulkFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>

                {/* Option to Download & Store Images Locally */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--card-border)',
                    marginBottom: '20px'
                  }}
                >
                  <input
                    type="checkbox"
                    id="bulkDownloadImages"
                    checked={bulkDownloadImages}
                    onChange={(e) => setBulkDownloadImages(e.target.checked)}
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                  />
                  <label htmlFor="bulkDownloadImages" style={{ cursor: 'pointer', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 600 }}>📥 Download & store images on local server (Recommended)</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                      Third-party links down hone par bhi aapki photos hamare server par safe rahengi.
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ flex: 1 }}
                    onClick={() => setShowBulkModal(false)}
                    disabled={bulkUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    disabled={bulkUploading}
                  >
                    {bulkUploading ? (
                      <>
                        <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                        <span>Importing & Processing...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span>Upload & Import Products</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* -------------------- ➕ ADD PRODUCT MODAL -------------------- */}
        {showModal && (
          <div className="cart-overlay">
            <div className="auth-card" style={{ maxWidth: '640px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Add New Product</h2>
                <button className="icon-btn" onClick={resetForm}><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateProduct}>
                {/* Product Name & SKU */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      className="form-control"
                      required
                      placeholder="e.g. Yonex Astrox 88D Pro"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>SKU (Optional)</label>
                    <input
                      className="form-control"
                      placeholder="e.g. YNX-88DP"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                </div>

                {/* Pricing: MRP vs Selling Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label>MRP (Strike-through)</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="e.g. 17999"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Selling Price (₹) *</label>
                    <input
                      className="form-control"
                      type="number"
                      required
                      placeholder="e.g. 14999"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Units *</label>
                    <input
                      className="form-control"
                      type="number"
                      required
                      placeholder="e.g. 25"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category & Brand */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      className="form-control"
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Brand (Optional)</label>
                    <select
                      className="form-control"
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                    >
                      <option value="">-- Select Brand --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Product specifications, details, and features..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* 🖼️ IMAGE CONFIGURATION (Link vs File + Download Option) */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px',
                    padding: '14px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>Product Images</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className={imageMode === 'url' ? 'btn-primary' : 'btn-outline'}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => setImageMode('url')}
                      >
                        Image Link (URL)
                      </button>
                      <button
                        type="button"
                        className={imageMode === 'file' ? 'btn-primary' : 'btn-outline'}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => setImageMode('file')}
                      >
                        Upload Local File
                      </button>
                    </div>
                  </div>

                  {imageMode === 'file' ? (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="form-group">
                        <input
                          className="form-control"
                          placeholder="Primary Image URL (e.g. https://images.unsplash.com/...)"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <input
                          className="form-control"
                          placeholder="Additional Gallery URLs (comma-separated, e.g. url1, url2)"
                          value={galleryUrls}
                          onChange={(e) => setGalleryUrls(e.target.value)}
                        />
                      </div>

                      {/* Download images locally checkbox */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                        <input
                          type="checkbox"
                          id="downloadImages"
                          checked={downloadImages}
                          onChange={(e) => setDownloadImages(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor="downloadImages" style={{ cursor: 'pointer', fontSize: '0.78rem', color: 'var(--gold)' }}>
                          📥 Download & store external image on local server (prevents broken link if external site goes down)
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🎛️ VARIANTS SECTION (Dynamic Attributes Dropdowns) */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px',
                    padding: '14px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        id="hasVariants"
                        checked={hasVariants}
                        onChange={(e) => {
                          setHasVariants(e.target.checked);
                          if (e.target.checked && variantsList.length === 0) {
                            handleAddVariantRow();
                          }
                        }}
                        style={{ cursor: 'pointer', transform: 'scale(1.15)' }}
                      />
                      <label htmlFor="hasVariants" style={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem' }}>
                        This product has variants (Color, Size, Weight, Height, etc.)
                      </label>
                    </div>

                    {hasVariants && (
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--gold)', color: 'var(--gold)' }}
                        onClick={handleAddVariantRow}
                      >
                        <Plus size={14} /> Add Variant
                      </button>
                    )}
                  </div>

                  {hasVariants && (
                    <div style={{ marginTop: '14px' }}>
                      {variantsList.map((v, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '6px',
                            padding: '10px 12px',
                            marginBottom: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold)' }}>
                              Variant #{idx + 1}
                            </span>
                            <button
                              type="button"
                              className="icon-btn"
                              style={{ color: 'var(--danger)', padding: '2px' }}
                              onClick={() => handleRemoveVariantRow(idx)}
                              title="Delete variant"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Dynamic Attribute Selectors */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                            {/* Option 1 Dropdown */}
                            <div>
                              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Option 1 Type</label>
                              <select
                                className="form-control"
                                style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                                value={v.attr1Name}
                                onChange={(e) => {
                                  const selectedAttr = masterAttributes.find((a) => a.name === e.target.value);
                                  handleUpdateVariantField(idx, 'attr1Name', e.target.value);
                                  handleUpdateVariantField(idx, 'attr1Val', selectedAttr?.values[0]?.value || '');
                                }}
                              >
                                {masterAttributes.map((a) => (
                                  <option key={a.id} value={a.name}>{a.name}</option>
                                ))}
                              </select>

                              {/* Value select for Option 1 */}
                              <select
                                className="form-control"
                                style={{ fontSize: '0.78rem', padding: '6px 8px', marginTop: '4px' }}
                                value={v.attr1Val}
                                onChange={(e) => handleUpdateVariantField(idx, 'attr1Val', e.target.value)}
                              >
                                {masterAttributes
                                  .find((a) => a.name === v.attr1Name)
                                  ?.values.map((val) => (
                                    <option key={val.id} value={val.value}>{val.value}</option>
                                  ))}
                              </select>
                            </div>

                            {/* Option 2 Dropdown (Optional second dimension) */}
                            <div>
                              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Option 2 (Optional)</label>
                              <select
                                className="form-control"
                                style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                                value={v.attr2Name}
                                onChange={(e) => {
                                  const selectedAttr = masterAttributes.find((a) => a.name === e.target.value);
                                  handleUpdateVariantField(idx, 'attr2Name', e.target.value);
                                  handleUpdateVariantField(idx, 'attr2Val', selectedAttr?.values[0]?.value || '');
                                }}
                              >
                                <option value="">-- None --</option>
                                {masterAttributes.map((a) => (
                                  <option key={a.id} value={a.name}>{a.name}</option>
                                ))}
                              </select>

                              {v.attr2Name && (
                                <select
                                  className="form-control"
                                  style={{ fontSize: '0.78rem', padding: '6px 8px', marginTop: '4px' }}
                                  value={v.attr2Val}
                                  onChange={(e) => handleUpdateVariantField(idx, 'attr2Val', e.target.value)}
                                >
                                  {masterAttributes
                                    .find((a) => a.name === v.attr2Name)
                                    ?.values.map((val) => (
                                      <option key={val.id} value={val.value}>{val.value}</option>
                                    ))}
                                </select>
                              )}
                            </div>
                          </div>

                          {/* Variant Price, Stock & Optional Image */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                            <div>
                              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Price (₹)</label>
                              <input
                                className="form-control"
                                type="number"
                                style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                                placeholder={price || 'Price'}
                                value={v.price}
                                onChange={(e) => handleUpdateVariantField(idx, 'price', e.target.value)}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stock</label>
                              <input
                                className="form-control"
                                type="number"
                                style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                                placeholder="Stock"
                                value={v.stock}
                                onChange={(e) => handleUpdateVariantField(idx, 'stock', e.target.value)}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Photo URL (Opt)</label>
                              <input
                                className="form-control"
                                style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                                placeholder="https://..."
                                value={v.imageUrl}
                                onChange={(e) => handleUpdateVariantField(idx, 'imageUrl', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Save & Publish Product
                </button>
              </form>
            </div>
          </div>
        )}

        {/* -------------------- 📋 PRODUCTS TABLE -------------------- */}
        <div className="profile-card">
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading products...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px' }}>Product</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Brand</th>
                    <th style={{ padding: '12px' }}>Pricing & MRP</th>
                    <th style={{ padding: '12px' }}>Variants</th>
                    <th style={{ padding: '12px' }}>Stock</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Koi Product nahi mila. Naya product add karein ya Excel bulk upload karein!
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => {
                      const hasDiscount = p.mrp && p.mrp > p.price;
                      const discountPercent = hasDiscount ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                          {/* Image & Name */}
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
                              style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                SKU: <code>{p.sku || `PRD-${p.id}`}</code>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                            {p.category?.name || 'Sports'}
                          </td>

                          {/* Brand */}
                          <td style={{ padding: '12px' }}>
                            <span
                              style={{
                                padding: '3px 8px',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                color: p.brand?.name || p.brandName ? 'var(--gold)' : 'var(--text-muted)'
                              }}
                            >
                              {p.brand?.name || p.brandName || 'No Brand'}
                            </span>
                          </td>

                          {/* Price & MRP */}
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '0.95rem' }}>
                              ₹{p.price?.toLocaleString('en-IN')}
                            </div>
                            {hasDiscount && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  ₹{p.mrp?.toLocaleString('en-IN')}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: '#22c55e',
                                    background: 'rgba(34, 197, 94, 0.12)',
                                    padding: '1px 4px',
                                    borderRadius: '3px'
                                  }}
                                >
                                  -{discountPercent}%
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Variants Column */}
                          <td style={{ padding: '12px' }}>
                            {p.hasVariants && p.variants && p.variants.length > 0 ? (
                              <div>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    background: 'rgba(59, 130, 246, 0.15)',
                                    color: '#60a5fa',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    marginBottom: '4px'
                                  }}
                                >
                                  <Layers size={12} />
                                  {p.variants.length} Variants
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                                  {p.variants.slice(0, 3).map((v) => (
                                    <span
                                      key={v.id}
                                      style={{
                                        fontSize: '0.68rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        color: 'var(--text-muted)'
                                      }}
                                    >
                                      {v.title}
                                    </span>
                                  ))}
                                  {p.variants.length > 3 && (
                                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                      +{p.variants.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Single</span>
                            )}
                          </td>

                          {/* Stock */}
                          <td style={{ padding: '12px' }}>
                            <span
                              style={{
                                color: p.stock <= 5 ? 'var(--danger)' : '#22c55e',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                              }}
                            >
                              {p.stock} units
                            </span>
                            {p.stock <= 5 && (
                              <div style={{ fontSize: '0.68rem', color: 'var(--danger)', fontWeight: 600 }}>
                                Low Stock!
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <button
                              className="icon-btn"
                              style={{ color: 'var(--danger)', borderColor: 'transparent' }}
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
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

export default AdminProductsPage;

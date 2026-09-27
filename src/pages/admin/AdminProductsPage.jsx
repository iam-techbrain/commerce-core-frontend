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
  ChevronDown,
  Eye,
  Edit2,
  Save,
  Tag,
  Settings,
  Check
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

  // Variants handling (when creating new product)
  const [hasVariants, setHasVariants] = useState(false);
  const [variantsList, setVariantsList] = useState([]);

  // Bulk Upload Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkDownloadImages, setBulkDownloadImages] = useState(true);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState(null);

  // 👁️ & ➕ MANAGE VARIANTS MODAL STATE
  const [selectedProductForVariants, setSelectedProductForVariants] = useState(null);
  const [variantActionMsg, setVariantActionMsg] = useState(null);
  const [addingVariant, setAddingVariant] = useState(false);

  // New Variant Form State
  const [newVarAttr1Name, setNewVarAttr1Name] = useState('Weight');
  const [newVarAttr1Val, setNewVarAttr1Val] = useState('');
  const [newVarAttr2Name, setNewVarAttr2Name] = useState('');
  const [newVarAttr2Val, setNewVarAttr2Val] = useState('');
  const [newVarTitle, setNewVarTitle] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');
  const [newVarMrp, setNewVarMrp] = useState('');
  const [newVarStock, setNewVarStock] = useState('10');
  const [newVarSku, setNewVarSku] = useState('');
  const [newVarImageUrl, setNewVarImageUrl] = useState('');
  const [newVarDownloadImages, setNewVarDownloadImages] = useState(true);

  // Inline Variant Edit State
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [editVarTitle, setEditVarTitle] = useState('');
  const [editVarPrice, setEditVarPrice] = useState('');
  const [editVarMrp, setEditVarMrp] = useState('');
  const [editVarStock, setEditVarStock] = useState('');
  const [editVarImageUrl, setEditVarImageUrl] = useState('');
  const [savingVariant, setSavingVariant] = useState(false);

  // ⚙️ MASTER ATTRIBUTES MODAL STATE
  const [showAttributesModal, setShowAttributesModal] = useState(false);
  const [newMasterAttrName, setNewMasterAttrName] = useState('');
  const [newValInputs, setNewValInputs] = useState({});

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

  // -------------------- 👁️ & ➕ MANAGE VARIANTS HANDLERS --------------------
  const openVariantsModal = (product) => {
    setSelectedProductForVariants(product);
    setVariantActionMsg(null);
    setEditingVariantId(null);

    const firstAttr = masterAttributes[0]?.name || 'Weight';
    const firstVal = masterAttributes[0]?.values[0]?.value || '';
    setNewVarAttr1Name(firstAttr);
    setNewVarAttr1Val(firstVal);
    setNewVarAttr2Name('');
    setNewVarAttr2Val('');
    setNewVarTitle(firstVal ? `${firstAttr}: ${firstVal}` : '');
    setNewVarPrice(product.price ? String(product.price) : '');
    setNewVarMrp(product.mrp ? String(product.mrp) : '');
    setNewVarStock('10');
    setNewVarSku('');
    setNewVarImageUrl('');
    setNewVarDownloadImages(true);
  };

  const handleAddVariantToProduct = async (e) => {
    e.preventDefault();
    if (!selectedProductForVariants) return;
    if (!newVarPrice) {
      alert('Variant Price zaroori hai!');
      return;
    }

    setAddingVariant(true);
    setVariantActionMsg(null);

    try {
      const attrs = {};
      if (newVarAttr1Name && newVarAttr1Val) attrs[newVarAttr1Name] = newVarAttr1Val;
      if (newVarAttr2Name && newVarAttr2Val) attrs[newVarAttr2Name] = newVarAttr2Val;

      const title = newVarTitle.trim() || Object.values(attrs).join(' / ') || 'Standard Variant';

      const payload = {
        title,
        attributes: attrs,
        price: parseFloat(newVarPrice),
        mrp: newVarMrp ? parseFloat(newVarMrp) : null,
        stock: parseInt(newVarStock || 0),
        sku: newVarSku.trim() || undefined,
        imageUrl: newVarImageUrl.trim() || null,
        downloadImages: newVarDownloadImages
      };

      const res = await API.post(`/products/${selectedProductForVariants.id}/variants`, payload);
      if (res.data.success) {
        setVariantActionMsg({ type: 'success', text: res.data.message });

        // Refresh all products and update selectedProductForVariants
        const updatedProdRes = await API.get('/products?limit=100');
        if (updatedProdRes.data.success) {
          setProducts(updatedProdRes.data.data);
          const freshProd = updatedProdRes.data.data.find((p) => p.id === selectedProductForVariants.id);
          if (freshProd) setSelectedProductForVariants(freshProd);
        }

        // Reset inputs
        setNewVarSku('');
        setNewVarImageUrl('');
      }
    } catch (err) {
      setVariantActionMsg({
        type: 'error',
        text: err.response?.data?.message || 'Variant add karne me error aaya!'
      });
    } finally {
      setAddingVariant(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Kya aap sach me is variant ko delete karna chahte hain?')) return;
    try {
      const res = await API.delete(`/products/variants/${variantId}`);
      if (res.data.success) {
        setVariantActionMsg({ type: 'success', text: 'Variant successfully delete ho gaya!' });

        const updatedProdRes = await API.get('/products?limit=100');
        if (updatedProdRes.data.success) {
          setProducts(updatedProdRes.data.data);
          const freshProd = updatedProdRes.data.data.find((p) => p.id === selectedProductForVariants.id);
          if (freshProd) setSelectedProductForVariants(freshProd);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Variant delete error');
    }
  };

  const handleStartEditVariant = (variant) => {
    setEditingVariantId(variant.id);
    setEditVarTitle(variant.title || '');
    setEditVarPrice(String(variant.price || ''));
    setEditVarMrp(variant.mrp ? String(variant.mrp) : '');
    setEditVarStock(String(variant.stock || '0'));
    setEditVarImageUrl(variant.imageUrl || '');
  };

  const handleSaveEditVariant = async (variantId) => {
    try {
      setSavingVariant(true);
      const res = await API.put(`/products/variants/${variantId}`, {
        title: editVarTitle,
        price: parseFloat(editVarPrice),
        mrp: editVarMrp ? parseFloat(editVarMrp) : null,
        stock: parseInt(editVarStock),
        imageUrl: editVarImageUrl ? editVarImageUrl.trim() : null
      });

      if (res.data.success) {
        setVariantActionMsg({ type: 'success', text: 'Variant successfully update ho gaya!' });
        setEditingVariantId(null);

        const updatedProdRes = await API.get('/products?limit=100');
        if (updatedProdRes.data.success) {
          setProducts(updatedProdRes.data.data);
          const freshProd = updatedProdRes.data.data.find((p) => p.id === selectedProductForVariants.id);
          if (freshProd) setSelectedProductForVariants(freshProd);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Variant update error');
    } finally {
      setSavingVariant(false);
    }
  };

  // -------------------- ⚙️ MASTER ATTRIBUTES HANDLERS --------------------
  const handleCreateMasterAttribute = async (e) => {
    e.preventDefault();
    if (!newMasterAttrName.trim()) return;
    try {
      const res = await API.post('/attributes', { name: newMasterAttrName.trim() });
      if (res.data.success) {
        setNewMasterAttrName('');
        const attrRes = await API.get('/attributes');
        if (attrRes.data.success) setMasterAttributes(attrRes.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Attribute create error');
    }
  };

  const handleAddAttributeValue = async (attributeId) => {
    const input = newValInputs[attributeId];
    if (!input || !input.value || !input.value.trim()) {
      alert('Kripya value enter karein!');
      return;
    }
    try {
      const res = await API.post(`/attributes/${attributeId}/values`, {
        value: input.value.trim(),
        colorCode: input.colorCode ? input.colorCode.trim() : null
      });
      if (res.data.success) {
        setNewValInputs({ ...newValInputs, [attributeId]: { value: '', colorCode: '' } });
        const attrRes = await API.get('/attributes');
        if (attrRes.data.success) setMasterAttributes(attrRes.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Value add error');
    }
  };

  const handleDeleteAttributeValue = async (valueId) => {
    if (!window.confirm('Delete this option?')) return;
    try {
      const res = await API.delete(`/attributes/values/${valueId}`);
      if (res.data.success) {
        const attrRes = await API.get('/attributes');
        if (attrRes.data.success) setMasterAttributes(attrRes.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Value delete error');
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* Admin Page Header with Breadcrumb */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1>Product Catalog</h1>
            <p>Manage single products, variants (Color, Size, Weight, Height), and batch Excel uploads.</p>
          </div>

          <div className="admin-breadcrumb">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Package size={14} color="var(--admin-primary)" />
              <span>Catalog</span>
            </span>
            <span style={{ opacity: 0.5 }}>/</span>
            <span>Products</span>
          </div>
        </div>

        {/* Action Buttons Toolbar Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Download Template Button */}
            <button
              className="btn-outline admin-btn"
              onClick={handleDownloadTemplate}
              title="Download official sample Excel template"
            >
              <Download size={16} />
              <span>Download Excel Template</span>
            </button>

            {/* Bulk Upload Button */}
            <button
              className="btn-outline admin-btn admin-btn-success"
              onClick={() => {
                setShowBulkModal(true);
                setBulkMessage(null);
              }}
            >
              <FileSpreadsheet size={16} />
              <span>Bulk Upload (Excel)</span>
            </button>

            {/* Attributes Master Button */}
            <button
              className="btn-outline admin-btn admin-btn-primary"
              onClick={() => setShowAttributesModal(true)}
            >
              <Sparkles size={16} />
              <span>Attributes Master</span>
            </button>
          </div>

          {/* Add New Product Button */}
          <button
            className="btn-primary admin-btn"
            onClick={() => {
              setShowModal(true);
              if (masterAttributes.length === 0) fetchProducts();
            }}
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* -------------------- 📤 BULK UPLOAD MODAL -------------------- */}
        {showBulkModal && (
          <div
            className="cart-overlay"
            onClick={() => {
              setShowBulkModal(false);
              setBulkMessage(null);
            }}
          >
            <div
              className="auth-card"
              style={{ maxWidth: '580px', width: '92%' }}
              onClick={(e) => e.stopPropagation()}
            >
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
          <div className="cart-overlay" onClick={resetForm}>
            <div
              className="auth-card"
              style={{ maxWidth: '640px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
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

        {/* -------------------- 👁️ & ➕ MANAGE VARIANTS MODAL -------------------- */}
        {selectedProductForVariants && (
          <div
            className="cart-overlay"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            onClick={() => setSelectedProductForVariants(null)}
          >
            <div
              className="auth-card"
              style={{
                maxWidth: '860px',
                width: '94%',
                maxHeight: '92vh',
                overflowY: 'auto',
                background: '#ffffff',
                border: '1px solid #e3e6f0',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e3e6f0', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={
                      selectedProductForVariants.imageUrl
                        ? selectedProductForVariants.imageUrl.startsWith('http')
                          ? selectedProductForVariants.imageUrl
                          : `http://localhost:5000${selectedProductForVariants.imageUrl}`
                        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'
                    }
                    alt={selectedProductForVariants.name}
                    style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #d1d3e2' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#4e73df', fontWeight: 800 }}>
                        {selectedProductForVariants.category?.name || 'Product'} • SKU: {selectedProductForVariants.sku || `PRD-${selectedProductForVariants.id}`}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 4px 0', color: '#2e384d' }}>
                      {selectedProductForVariants.name}
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: '#858796' }}>
                      Base Price: <strong style={{ color: '#1cc88a' }}>₹{selectedProductForVariants.price?.toLocaleString('en-IN')}</strong>
                      {selectedProductForVariants.mrp && ` (MRP: ₹${selectedProductForVariants.mrp?.toLocaleString('en-IN')})`}
                      {' • '}Total Combined Stock: <strong>{selectedProductForVariants.stock} units</strong>
                    </div>
                  </div>
                </div>

                <button
                  className="icon-btn"
                  onClick={() => setSelectedProductForVariants(null)}
                  style={{ background: '#f8f9fc', border: '1px solid #e3e6f0', color: '#858796', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Notification Toast */}
              {variantActionMsg && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '18px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: variantActionMsg.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: `1px solid ${variantActionMsg.type === 'success' ? '#22c55e' : '#ef4444'}`,
                    color: variantActionMsg.type === 'success' ? '#22c55e' : '#ef4444'
                  }}
                >
                  {variantActionMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{variantActionMsg.text}</span>
                </div>
              )}

              {/* SECTION 1: Existing Variants List */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#2e384d' }}>
                    <Layers size={18} color="#4e73df" />
                    <span>Existing Variants ({selectedProductForVariants.variants?.length || 0})</span>
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#858796' }}>
                    Each variant has independent pricing, stock & SKU
                  </span>
                </div>

                {(!selectedProductForVariants.variants || selectedProductForVariants.variants.length === 0) ? (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      background: '#f8f9fc',
                      border: '1px dashed #d1d3e2',
                      color: '#858796',
                      fontSize: '0.85rem'
                    }}
                  >
                    Is product ke liye abhi koi variant nahi hai. Neeche diye gaye form se naya variant add karein! 👇
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedProductForVariants.variants.map((v) => {
                      const isEditingThis = editingVariantId === v.id;
                      let parsedAttrs = null;
                      try {
                        parsedAttrs = v.attributes ? JSON.parse(v.attributes) : null;
                      } catch (e) {
                        parsedAttrs = null;
                      }

                      const displayImg = v.imageUrl
                        ? (v.imageUrl.startsWith('http') ? v.imageUrl : `http://localhost:5000${v.imageUrl}`)
                        : selectedProductForVariants.imageUrl
                        ? (selectedProductForVariants.imageUrl.startsWith('http') ? selectedProductForVariants.imageUrl : `http://localhost:5000${selectedProductForVariants.imageUrl}`)
                        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';

                      if (isEditingThis) {
                        return (
                          <div
                            key={v.id}
                            style={{
                              padding: '14px',
                              borderRadius: '8px',
                              background: 'rgba(78, 115, 223, 0.05)',
                              border: '1px solid #4e73df'
                            }}
                          >
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4e73df', marginBottom: '8px' }}>
                              ✏️ Edit Variant: {v.sku}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: '#858796', fontWeight: 600 }}>Variant Title</label>
                                <input
                                  className="form-control"
                                  style={{ fontSize: '0.8rem', padding: '6px 8px', background: '#ffffff', border: '1px solid #d1d3e2', color: '#2e384d' }}
                                  value={editVarTitle}
                                  onChange={(e) => setEditVarTitle(e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: '#858796', fontWeight: 600 }}>Price (₹)</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  style={{ fontSize: '0.8rem', padding: '6px 8px', background: '#ffffff', border: '1px solid #d1d3e2', color: '#2e384d' }}
                                  value={editVarPrice}
                                  onChange={(e) => setEditVarPrice(e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: '#858796', fontWeight: 600 }}>MRP (₹)</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  style={{ fontSize: '0.8rem', padding: '6px 8px', background: '#ffffff', border: '1px solid #d1d3e2', color: '#2e384d' }}
                                  value={editVarMrp}
                                  onChange={(e) => setEditVarMrp(e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: '#858796', fontWeight: 600 }}>Stock</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  style={{ fontSize: '0.8rem', padding: '6px 8px', background: '#ffffff', border: '1px solid #d1d3e2', color: '#2e384d' }}
                                  value={editVarStock}
                                  onChange={(e) => setEditVarStock(e.target.value)}
                                />
                              </div>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                              <label style={{ fontSize: '0.7rem', color: '#858796', fontWeight: 600 }}>Variant Image URL (Optional)</label>
                              <input
                                className="form-control"
                                style={{ fontSize: '0.8rem', padding: '6px 8px', background: '#ffffff', border: '1px solid #d1d3e2', color: '#2e384d' }}
                                value={editVarImageUrl}
                                onChange={(e) => setEditVarImageUrl(e.target.value)}
                                placeholder="https://..."
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                className="btn-outline admin-btn"
                                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                onClick={() => setEditingVariantId(null)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="btn-primary admin-btn"
                                style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                disabled={savingVariant}
                                onClick={() => handleSaveEditVariant(v.id)}
                              >
                                <Save size={14} />
                                <span>{savingVariant ? 'Saving...' : 'Save Changes'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={v.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            background: '#f8f9fc',
                            border: '1px solid #e3e6f0',
                            flexWrap: 'wrap',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ position: 'relative' }}>
                              <img
                                src={displayImg}
                                alt={v.title}
                                style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #d1d3e2' }}
                              />
                              {!v.imageUrl && (
                                <span
                                  title="Inherits photo from parent product"
                                  style={{
                                    position: 'absolute',
                                    bottom: '-4px',
                                    right: '-4px',
                                    fontSize: '0.55rem',
                                    background: '#4e73df',
                                    color: '#ffffff',
                                    borderRadius: '3px',
                                    padding: '0 3px',
                                    fontWeight: 700
                                  }}
                                >
                                  Auto
                                </span>
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2e384d' }}>
                                {v.title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                                <code style={{ fontSize: '0.7rem', color: '#858796' }}>{v.sku}</code>
                                {parsedAttrs &&
                                  Object.entries(parsedAttrs).map(([k, val]) => (
                                    <span
                                      key={k}
                                      style={{
                                        fontSize: '0.68rem',
                                        background: 'rgba(78, 115, 223, 0.1)',
                                        color: '#4e73df',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        fontWeight: 700
                                      }}
                                    >
                                      {k}: {val}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                            <div>
                              <div style={{ fontWeight: 800, color: '#1cc88a', fontSize: '0.95rem' }}>
                                ₹{v.price?.toLocaleString('en-IN')}
                              </div>
                              {v.mrp && v.mrp > v.price && (
                                <span style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: '#858796' }}>
                                  ₹{v.mrp?.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            <div>
                              <span
                                style={{
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: v.stock <= 5 ? '#e74a3b' : '#1cc88a'
                                }}
                              >
                                {v.stock} units
                              </span>
                              {v.stock <= 5 && (
                                <div style={{ fontSize: '0.65rem', color: '#e74a3b', fontWeight: 700 }}>
                                  Low Stock
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                className="icon-btn"
                                title="Edit Variant"
                                onClick={() => handleStartEditVariant(v)}
                                style={{ color: '#4e73df' }}
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="icon-btn"
                                title="Delete Variant"
                                onClick={() => handleDeleteVariant(v.id)}
                                style={{ color: '#e74a3b' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 2: ➕ Add New Variant Form */}
              <div
                style={{
                  background: 'rgba(78, 115, 223, 0.04)',
                  border: '1px solid rgba(78, 115, 223, 0.25)',
                  borderRadius: '10px',
                  padding: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Plus size={18} color="#4e73df" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#4e73df' }}>
                    Add New Variant to this Product
                  </h3>
                </div>

                <form onSubmit={handleAddVariantToProduct}>
                  {/* Attributes Selection */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    {/* Attribute 1 */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Option 1 (e.g. Weight, Size, Color)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                        <select
                          className="form-control"
                          style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                          value={newVarAttr1Name}
                          onChange={(e) => {
                            const sel = masterAttributes.find((a) => a.name === e.target.value);
                            setNewVarAttr1Name(e.target.value);
                            const val = sel?.values[0]?.value || '';
                            setNewVarAttr1Val(val);
                            setNewVarTitle(val ? `${e.target.value}: ${val}` : '');
                          }}
                        >
                          {masterAttributes.map((a) => (
                            <option key={a.id} value={a.name}>{a.name}</option>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>

                        {newVarAttr1Name === 'Custom' ? (
                          <input
                            className="form-control"
                            style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                            placeholder="Attribute Value"
                            value={newVarAttr1Val}
                            onChange={(e) => {
                              setNewVarAttr1Val(e.target.value);
                              setNewVarTitle(e.target.value);
                            }}
                          />
                        ) : (
                          <select
                            className="form-control"
                            style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                            value={newVarAttr1Val}
                            onChange={(e) => {
                              setNewVarAttr1Val(e.target.value);
                              const t2 = newVarAttr2Val ? ` / ${newVarAttr2Name}: ${newVarAttr2Val}` : '';
                              setNewVarTitle(`${newVarAttr1Name}: ${e.target.value}${t2}`);
                            }}
                          >
                            <option value="">-- Choose Value --</option>
                            {masterAttributes
                              .find((a) => a.name === newVarAttr1Name)
                              ?.values.map((val) => (
                                <option key={val.id} value={val.value}>{val.value}</option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Attribute 2 (Optional) */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Option 2 (Optional, e.g. Color, Grip)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                        <select
                          className="form-control"
                          style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                          value={newVarAttr2Name}
                          onChange={(e) => {
                            const sel = masterAttributes.find((a) => a.name === e.target.value);
                            setNewVarAttr2Name(e.target.value);
                            const val = sel?.values[0]?.value || '';
                            setNewVarAttr2Val(val);
                            if (val && newVarAttr1Val) {
                              setNewVarTitle(`${newVarAttr1Name}: ${newVarAttr1Val} / ${e.target.value}: ${val}`);
                            }
                          }}
                        >
                          <option value="">-- None --</option>
                          {masterAttributes.map((a) => (
                            <option key={a.id} value={a.name}>{a.name}</option>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>

                        {newVarAttr2Name && (
                          newVarAttr2Name === 'Custom' ? (
                            <input
                              className="form-control"
                              style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                              placeholder="Option 2 Value"
                              value={newVarAttr2Val}
                              onChange={(e) => setNewVarAttr2Val(e.target.value)}
                            />
                          ) : (
                            <select
                              className="form-control"
                              style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                              value={newVarAttr2Val}
                              onChange={(e) => {
                                setNewVarAttr2Val(e.target.value);
                                if (newVarAttr1Val) {
                                  setNewVarTitle(`${newVarAttr1Name}: ${newVarAttr1Val} / ${newVarAttr2Name}: ${e.target.value}`);
                                }
                              }}
                            >
                              <option value="">-- Choose Value --</option>
                              {masterAttributes
                                .find((a) => a.name === newVarAttr2Name)
                                ?.values.map((val) => (
                                  <option key={val.id} value={val.value}>{val.value}</option>
                                ))}
                            </select>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Variant Title */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Variant Display Title (Visible to Customers)
                    </label>
                    <input
                      className="form-control"
                      style={{ fontSize: '0.85rem', padding: '8px 10px', marginTop: '4px' }}
                      value={newVarTitle}
                      onChange={(e) => setNewVarTitle(e.target.value)}
                      placeholder="e.g. Weight: 20kg Pair / Color: Matte Black"
                      required
                    />
                  </div>

                  {/* Price, MRP, Stock & SKU */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Variant Price (₹) *
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.01"
                        required
                        style={{ fontSize: '0.85rem', padding: '8px 10px', marginTop: '4px' }}
                        value={newVarPrice}
                        onChange={(e) => setNewVarPrice(e.target.value)}
                        placeholder="₹ Price"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        MRP / Strike (₹)
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.01"
                        style={{ fontSize: '0.85rem', padding: '8px 10px', marginTop: '4px' }}
                        value={newVarMrp}
                        onChange={(e) => setNewVarMrp(e.target.value)}
                        placeholder="₹ MRP"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Stock Units
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        required
                        style={{ fontSize: '0.85rem', padding: '8px 10px', marginTop: '4px' }}
                        value={newVarStock}
                        onChange={(e) => setNewVarStock(e.target.value)}
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Custom SKU (Opt)
                      </label>
                      <input
                        className="form-control"
                        style={{ fontSize: '0.85rem', padding: '8px 10px', marginTop: '4px' }}
                        value={newVarSku}
                        onChange={(e) => setNewVarSku(e.target.value)}
                        placeholder="Auto-generated"
                      />
                    </div>
                  </div>

                  {/* Variant Photo URL & Download Locally */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '14px', alignItems: 'center' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Variant Specific Photo URL (Optional - leaves fallback to product photo)
                      </label>
                      <input
                        className="form-control"
                        style={{ fontSize: '0.85rem', padding: '8px 10px', marginTop: '4px' }}
                        value={newVarImageUrl}
                        onChange={(e) => setNewVarImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <input
                          type="checkbox"
                          checked={newVarDownloadImages}
                          onChange={(e) => setNewVarDownloadImages(e.target.checked)}
                        />
                        <span>Download Photo Locally</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    disabled={addingVariant}
                  >
                    <Plus size={18} />
                    <span>{addingVariant ? 'Adding Variant...' : 'Add Variant to Product'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- ⚙️ MASTER ATTRIBUTES MODAL -------------------- */}
        {showAttributesModal && (
          <div
            className="cart-overlay"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            onClick={() => setShowAttributesModal(false)}
          >
            <div
              className="auth-card"
              style={{
                maxWidth: '750px',
                width: '92%',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#ffffff',
                border: '1px solid #e3e6f0',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e3e6f0', paddingBottom: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(78, 115, 223, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e73df' }}>
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#2e384d' }}>
                      Master Product Attributes
                    </h2>
                    <div style={{ fontSize: '0.78rem', color: '#858796', marginTop: '2px' }}>
                      Pre-defined options for Colors, Sizes, Weights, Heights, and custom specs
                    </div>
                  </div>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setShowAttributesModal(false)}
                  style={{ background: '#f8f9fc', border: '1px solid #e3e6f0', color: '#858796', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Attributes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {masterAttributes.map((attr) => (
                  <div
                    key={attr.id}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      background: '#f8f9fc',
                      border: '1px solid #e3e6f0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#4e73df' }}>
                          {attr.name}
                        </span>
                        <code style={{ fontSize: '0.75rem', background: '#eaecf4', color: '#5a5c69', padding: '2px 8px', borderRadius: '4px' }}>
                          {attr.slug}
                        </code>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#858796', fontWeight: 600 }}>
                        {attr.values?.length || 0} options
                      </span>
                    </div>

                    {/* Values pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                      {attr.values?.map((val) => (
                        <span
                          key={val.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            background: '#ffffff',
                            border: '1px solid #d1d3e2',
                            fontSize: '0.82rem',
                            color: '#2e384d',
                            fontWeight: 600,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }}
                        >
                          {val.colorCode && (
                            <span
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: val.colorCode,
                                border: '1px solid rgba(0,0,0,0.2)',
                                display: 'inline-block'
                              }}
                            />
                          )}
                          <span>{val.value}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteAttributeValue(val.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#858796',
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Delete Option"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Quick add value row */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        className="form-control"
                        style={{ fontSize: '0.82rem', padding: '8px 12px', flex: 1, background: '#ffffff', border: '1px solid #d1d3e2', color: '#2e384d' }}
                        placeholder={`Add new ${attr.name} option (e.g. 30kg, UK 12)`}
                        value={newValInputs[attr.id]?.value || ''}
                        onChange={(e) =>
                          setNewValInputs({
                            ...newValInputs,
                            [attr.id]: { ...(newValInputs[attr.id] || {}), value: e.target.value }
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddAttributeValue(attr.id);
                          }
                        }}
                      />
                      {attr.name.toLowerCase().includes('color') && (
                        <input
                          type="color"
                          title="Choose Color Hex Code"
                          style={{
                            width: '40px',
                            height: '38px',
                            border: '1px solid #d1d3e2',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: '#ffffff',
                            padding: '2px'
                          }}
                          value={newValInputs[attr.id]?.colorCode || '#ff0000'}
                          onChange={(e) =>
                            setNewValInputs({
                              ...newValInputs,
                              [attr.id]: { ...(newValInputs[attr.id] || {}), colorCode: e.target.value }
                            })
                          }
                        />
                      )}
                      <button
                        type="button"
                        className="btn-outline admin-btn"
                        style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                        onClick={() => handleAddAttributeValue(attr.id)}
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Master Attribute Category */}
              <div
                style={{
                  background: 'rgba(78, 115, 223, 0.05)',
                  border: '1px solid rgba(78, 115, 223, 0.25)',
                  borderRadius: '10px',
                  padding: '16px'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#4e73df', marginBottom: '8px' }}>
                  ➕ Create New Attribute Category
                </div>
                <form onSubmit={handleCreateMasterAttribute} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '9px 14px', flex: 1, background: '#ffffff', border: '1px solid #d1d3e2', color: '#2e384d' }}
                    placeholder="e.g. Flavour, Material, Grip Thickness, Sole Type"
                    value={newMasterAttrName}
                    onChange={(e) => setNewMasterAttrName(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary admin-btn" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
                    Create Attribute
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- 📋 PRODUCTS TABLE -------------------- */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Package size={20} color="var(--admin-primary)" />
              <span>Products Catalog List</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(78, 115, 223, 0.1)',
                  color: 'var(--admin-primary)',
                  fontWeight: 700
                }}
              >
                {products.length} Products
              </span>
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
              Manage variants, stock, and batch inventory
            </div>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Loading products...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Pricing & MRP</th>
                    <th>Variants</th>
                    <th>Stock</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
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
                                <button
                                  type="button"
                                  onClick={() => openVariantsModal(p)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    background: 'rgba(59, 130, 246, 0.15)',
                                    border: '1px solid rgba(59, 130, 246, 0.35)',
                                    color: '#60a5fa',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    marginBottom: '4px',
                                    transition: 'all 0.15s ease'
                                  }}
                                  title="Click to view and add variants"
                                >
                                  <Layers size={13} />
                                  <span>{p.variants.length} Variants</span>
                                  <Eye size={12} style={{ opacity: 0.8 }} />
                                </button>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                                  {p.variants.slice(0, 2).map((v) => (
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
                                  {p.variants.length > 2 && (
                                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                      +{p.variants.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                                  Single SKU
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openVariantsModal(p)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    background: 'rgba(201, 168, 76, 0.12)',
                                    border: '1px solid rgba(201, 168, 76, 0.3)',
                                    color: 'var(--gold)',
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                  title="Add variants to this product"
                                >
                                  <Plus size={12} />
                                  <span>Add Variant</span>
                                </button>
                              </div>
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
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                className="icon-btn"
                                style={{ color: 'var(--gold)', borderColor: 'rgba(201, 168, 76, 0.3)' }}
                                onClick={() => openVariantsModal(p)}
                                title="View & Manage Variants"
                              >
                                <Layers size={16} />
                              </button>
                              <button
                                className="icon-btn"
                                style={{ color: 'var(--danger)', borderColor: 'transparent' }}
                                onClick={() => handleDeleteProduct(p.id)}
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
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

export default AdminProductsPage;

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Plus,
  Trash2,
  Layers,
  X,
  Home,
  ChevronRight,
  Tag,
  Edit2,
  Check,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { getImageUrl, getCategoryFallbackImage } from '../../utils/image.util';
import { compressImage } from '../../utils/imageCompressor';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding New Main Category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Form State for Adding New SubCategory
  const [showSubModal, setShowSubModal] = useState(false);
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [parentCatId, setParentCatId] = useState('');

  // Inline Editing State for Main Category
  const [editingCatId, setEditingCatId] = useState(null);
  const [catEditData, setCatEditData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    file: null,
    previewUrl: ''
  });
  const [savingCatId, setSavingCatId] = useState(null);

  // Inline Editing State for SubCategory
  const [editingSubId, setEditingSubId] = useState(null);
  const [subEditData, setSubEditData] = useState({
    name: '',
    description: '',
    categoryId: ''
  });
  const [savingSubId, setSavingSubId] = useState(null);

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

  // --- Main Category Inline Edit Handlers ---
  const handleStartCatEdit = (cat) => {
    setEditingCatId(cat.id);
    setCatEditData({
      name: cat.name || '',
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      file: null,
      previewUrl: cat.imageUrl
        ? getImageUrl(cat.imageUrl, null, cat.name)
        : getCategoryFallbackImage(cat.name)
    });
  };

  const handleCancelCatEdit = () => {
    setEditingCatId(null);
    setCatEditData({
      name: '',
      description: '',
      imageUrl: '',
      file: null,
      previewUrl: ''
    });
  };

  // Handle Category Image File in Inline Edit (Auto compressed to ~30-50 KB)
  const handleCatFileChange = async (e) => {
    const rawFile = e.target.files[0];
    if (rawFile) {
      const file = await compressImage(rawFile);
      const objectUrl = URL.createObjectURL(file);
      setCatEditData((prev) => ({
        ...prev,
        file: file,
        previewUrl: objectUrl
      }));
    }
  };

  const handleSaveCatEdit = async (id) => {
    if (!catEditData.name.trim()) {
      alert('Category name cannot be empty!');
      return;
    }

    setSavingCatId(id);
    try {
      if (catEditData.file) {
        const formData = new FormData();
        formData.append('name', catEditData.name.trim());
        formData.append('description', catEditData.description.trim());
        formData.append('image', catEditData.file);

        const res = await API.put(`/categories/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          handleCancelCatEdit();
          fetchAllData();
        }
      } else {
        const res = await API.put(`/categories/${id}`, {
          name: catEditData.name.trim(),
          description: catEditData.description.trim(),
          imageUrl: catEditData.imageUrl.trim()
        });
        if (res.data.success) {
          handleCancelCatEdit();
          fetchAllData();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update category!');
    } finally {
      setSavingCatId(null);
    }
  };

  // --- Subcategory Inline Edit Handlers ---
  const handleStartSubEdit = (sub) => {
    setEditingSubId(sub.id);
    setSubEditData({
      name: sub.name || '',
      description: sub.description || '',
      categoryId: sub.categoryId ? String(sub.categoryId) : (sub.category?.id ? String(sub.category.id) : '')
    });
  };

  const handleCancelSubEdit = () => {
    setEditingSubId(null);
    setSubEditData({
      name: '',
      description: '',
      categoryId: ''
    });
  };

  const handleSaveSubEdit = async (id) => {
    if (!subEditData.name.trim()) {
      alert('Subcategory name cannot be empty!');
      return;
    }
    if (!subEditData.categoryId) {
      alert('Please select a parent category!');
      return;
    }

    setSavingSubId(id);
    try {
      const res = await API.put(`/subcategories/${id}`, {
        name: subEditData.name.trim(),
        description: subEditData.description.trim(),
        categoryId: parseInt(subEditData.categoryId)
      });
      if (res.data.success) {
        handleCancelSubEdit();
        fetchAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update subcategory!');
    } finally {
      setSavingSubId(null);
    }
  };

  // --- Create Handlers ---
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrlInput.trim()) {
        formData.append('imageUrl', imageUrlInput.trim());
      }

      const res = await API.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert('Main Category successfully add ho gayi! 📁');
        setShowCategoryModal(false);
        setName('');
        setDescription('');
        setImageFile(null);
        setImageUrlInput('');
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
            <p>Update category names, images, descriptions, and assign subcategories directly from the list or via the edit icon.</p>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            💡 <strong>Quick Edit:</strong> Click the <strong>Edit (✏️)</strong> icon on the right or click on any row to edit name, image, or parent category directly in the table.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-primary"
              onClick={() => setShowCategoryModal(true)}
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
                borderColor: '#10B981',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Plus size={18} />
              <span>Add Subcategory</span>
            </button>
          </div>
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
                    placeholder="e.g. Cricket, Badminton, Tennis"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    className="form-control"
                    placeholder="Bats, balls, racquets and gear"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Upload Banner Image (Auto-compressed to ~50 KB)</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files[0]) {
                        const compressed = await compressImage(e.target.files[0]);
                        setImageFile(compressed);
                      }
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Or Image URL</label>
                  <input
                    className="form-control"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
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
                    placeholder="e.g. Cricket Bats, Badminton Shoes"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    className="form-control"
                    placeholder="Subcategory description"
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

        {/* 1. Main Categories Table Card */}
        <div className="admin-card" style={{ marginBottom: '32px' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Layers size={20} color="var(--admin-primary)" />
              <span>Main Categories ({categories.length})</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
              Click edit icon or row to edit image, name & description
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Loading categories...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Banner</th>
                    <th style={{ width: '220px' }}>Category Name</th>
                    <th>Description</th>
                    <th style={{ width: '150px' }}>Subcategories</th>
                    <th style={{ width: '120px' }}>Products</th>
                    <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => {
                    const isEditing = editingCatId === c.id;
                    const isSaving = savingCatId === c.id;
                    const defaultImg = c.imageUrl
                      ? (c.imageUrl.startsWith('http') ? c.imageUrl : getImageUrl(c.imageUrl, null, c.name))
                      : getCategoryFallbackImage(c.name);

                    if (isEditing) {
                      return (
                        <tr key={c.id} style={{ background: 'rgba(78, 115, 223, 0.05)', borderLeft: '3px solid var(--admin-primary)' }}>
                          {/* Image Edit with File Upload or URL */}
                          <td>
                            <div style={{ position: 'relative', width: '52px', height: '52px' }}>
                              <img
                                src={catEditData.previewUrl || defaultImg}
                                alt="Preview"
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border: '1.5px solid var(--admin-primary)'
                                }}
                              />
                              <label
                                title="Change Category Image"
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
                                  onChange={handleCatFileChange}
                                />
                              </label>
                            </div>
                          </td>

                          {/* Category Name Edit */}
                          <td>
                            <input
                              className="form-control"
                              style={{ fontWeight: 700, padding: '6px 10px', fontSize: '13.5px' }}
                              value={catEditData.name}
                              onChange={(e) => setCatEditData({ ...catEditData, name: e.target.value })}
                              placeholder="Category Name"
                              autoFocus
                            />
                            <div style={{ marginTop: '4px' }}>
                              <input
                                className="form-control"
                                style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--admin-text-muted)' }}
                                value={catEditData.imageUrl}
                                onChange={(e) => setCatEditData({ ...catEditData, imageUrl: e.target.value, previewUrl: e.target.value })}
                                placeholder="Or paste image URL"
                              />
                            </div>
                          </td>

                          {/* Description Edit */}
                          <td>
                            <input
                              className="form-control"
                              style={{ fontSize: '13px', padding: '6px 10px' }}
                              value={catEditData.description}
                              onChange={(e) => setCatEditData({ ...catEditData, description: e.target.value })}
                              placeholder="Category description"
                            />
                          </td>

                          {/* Subcategories count */}
                          <td>
                            <span style={{ fontWeight: 700, color: '#10B981', fontSize: '13px' }}>
                              {c.subcategories?.length || 0} Subcategories
                            </span>
                          </td>

                          {/* Products count */}
                          <td>
                            <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(78, 115, 223, 0.1)', color: 'var(--admin-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                              {c._count?.products || 0} Products
                            </span>
                          </td>

                          {/* Action Buttons */}
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
                                onClick={() => handleSaveCatEdit(c.id)}
                                disabled={isSaving}
                                title="Save Category"
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
                                onClick={handleCancelCatEdit}
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    // Normal Display Row
                    return (
                      <tr
                        key={c.id}
                        style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                        onDoubleClick={() => handleStartCatEdit(c)}
                        title="Double-click row or click edit icon to edit"
                      >
                        <td>
                          <img
                            src={defaultImg}
                            alt={c.name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
                            onClick={() => handleStartCatEdit(c)}
                          />
                        </td>
                        <td>
                          <div
                            onClick={() => handleStartCatEdit(c)}
                            style={{ fontWeight: 700, color: 'var(--admin-text-dark)', fontSize: '14px' }}
                          >
                            {c.name}
                          </div>
                        </td>
                        <td
                          onClick={() => handleStartCatEdit(c)}
                          style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}
                        >
                          {c.description || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>No description</span>}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#10B981', fontSize: '13px' }}>
                            {c.subcategories?.length || 0} Subcategories
                          </span>
                        </td>
                        <td>
                          <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(78, 115, 223, 0.1)', color: 'var(--admin-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                            {c._count?.products || 0} Products
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
                                handleStartCatEdit(c);
                              }}
                              title="Edit Category inline"
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
                                handleDeleteCategory(c.id);
                              }}
                              title="Delete Category"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 2. Subcategories Table Card with In-List Parent Category Change */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Tag size={20} color="#10B981" />
              <span>Subcategories Table ({subcategories.length})</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
              Change name, description, or reassign parent category directly in the list
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Loading subcategories...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '220px' }}>Subcategory Name</th>
                    <th style={{ width: '220px' }}>Parent Main Category</th>
                    <th>Description</th>
                    <th style={{ width: '130px' }}>Products</th>
                    <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((sub) => {
                    const isEditing = editingSubId === sub.id;
                    const isSaving = savingSubId === sub.id;

                    if (isEditing) {
                      return (
                        <tr key={sub.id} style={{ background: 'rgba(16, 185, 129, 0.06)', borderLeft: '3px solid #10B981' }}>
                          {/* Subcategory Name Input */}
                          <td>
                            <input
                              className="form-control"
                              style={{ fontWeight: 700, padding: '6px 10px', fontSize: '13.5px' }}
                              value={subEditData.name}
                              onChange={(e) => setSubEditData({ ...subEditData, name: e.target.value })}
                              placeholder="Subcategory Name"
                              autoFocus
                            />
                          </td>

                          {/* Parent Main Category Dropdown Selector */}
                          <td>
                            <select
                              className="form-control"
                              style={{ fontWeight: 600, padding: '6px 10px', fontSize: '13px' }}
                              value={subEditData.categoryId}
                              onChange={(e) => setSubEditData({ ...subEditData, categoryId: e.target.value })}
                            >
                              <option value="">-- Select Parent Category --</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Subcategory Description Input */}
                          <td>
                            <input
                              className="form-control"
                              style={{ fontSize: '13px', padding: '6px 10px' }}
                              value={subEditData.description}
                              onChange={(e) => setSubEditData({ ...subEditData, description: e.target.value })}
                              placeholder="Description"
                            />
                          </td>

                          {/* Products Count */}
                          <td>
                            <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(78, 115, 223, 0.1)', color: 'var(--admin-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                              {sub._count?.products || 0} Products
                            </span>
                          </td>

                          {/* Actions */}
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
                                onClick={() => handleSaveSubEdit(sub.id)}
                                disabled={isSaving}
                                title="Save Subcategory"
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
                                onClick={handleCancelSubEdit}
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    // Normal Display Row
                    return (
                      <tr
                        key={sub.id}
                        style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                        onDoubleClick={() => handleStartSubEdit(sub)}
                        title="Double-click row or click edit icon to edit"
                      >
                        <td>
                          <div
                            onClick={() => handleStartSubEdit(sub)}
                            style={{ fontWeight: 700, color: 'var(--admin-text-dark)', fontSize: '13.5px' }}
                          >
                            {sub.name}
                          </div>
                        </td>
                        <td>
                          <span
                            onClick={() => handleStartSubEdit(sub)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              background: '#F3F4F6',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              color: '#1F2937',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Click to change parent category"
                          >
                            <span>{sub.category?.name || 'Unassigned'}</span>
                            <Edit2 size={10} style={{ opacity: 0.5 }} />
                          </span>
                        </td>
                        <td
                          onClick={() => handleStartSubEdit(sub)}
                          style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}
                        >
                          {sub.description || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>No description</span>}
                        </td>
                        <td>
                          <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(78, 115, 223, 0.1)', color: 'var(--admin-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                            {sub._count?.products || 0} Products
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
                                handleStartSubEdit(sub);
                              }}
                              title="Edit Subcategory & change parent category inline"
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
                                handleDeleteSubCategory(sub.id);
                              }}
                              title="Delete Subcategory"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

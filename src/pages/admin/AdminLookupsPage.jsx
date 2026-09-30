import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Sliders,
  Plus,
  Trash2,
  Home,
  ChevronRight,
  Globe,
  ShieldCheck,
  FolderPlus,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AdminLookupsPage = () => {
  const queryClient = useQueryClient();

  // State for creating a new Group + Value
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupValue, setNewGroupValue] = useState('');

  // State for adding a value to an existing group
  const [activeAddGroup, setActiveAddGroup] = useState(null);
  const [quickValueInput, setQuickValueInput] = useState('');

  // Feedback message
  const [feedback, setFeedback] = useState(null);

  const showMsg = (text, isError = false) => {
    setFeedback({ text, isError });
    setTimeout(() => setFeedback(null), 3500);
  };

  // TanStack Query: Fetch grouped lookups
  const { data: lookupsGrouped = {}, isLoading } = useQuery({
    queryKey: ['admin-lookups'],
    queryFn: async () => {
      const res = await API.get('/lookups?grouped=true');
      return res.data?.success ? res.data.data : {};
    }
  });

  const invalidateLookups = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-lookups'] });
  };

  // Handle Add Value to existing group
  const handleAddValueToGroup = async (group) => {
    if (!quickValueInput.trim()) return;
    try {
      const res = await API.post('/lookups', {
        group,
        value: quickValueInput.trim()
      });
      if (res.data.success) {
        showMsg(`"${quickValueInput.trim()}" successfully added to ${group}! ✨`);
        setQuickValueInput('');
        setActiveAddGroup(null);
        invalidateLookups();
      }
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to add option!', true);
    }
  };

  // Handle Create New Group with initial value
  const handleCreateNewGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupValue.trim()) {
      showMsg('Group name aur Value dono required hain!', true);
      return;
    }
    try {
      const res = await API.post('/lookups', {
        group: newGroupName.trim(),
        value: newGroupValue.trim()
      });
      if (res.data.success) {
        showMsg(`New Group "${newGroupName.trim()}" successfully created! 🚀`);
        setNewGroupName('');
        setNewGroupValue('');
        setShowNewGroupModal(false);
        invalidateLookups();
      }
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error creating group!', true);
    }
  };

  // Handle Delete Option
  const handleDeleteOption = async (id, value, group) => {
    if (!window.confirm(`Are you sure you want to delete "${value}" from ${group}?`)) return;
    try {
      const res = await API.delete(`/lookups/${id}`);
      if (res.data.success) {
        showMsg(`Option "${value}" deleted.`);
        invalidateLookups();
      }
    } catch (err) {
      showMsg(err.response?.data?.message || 'Delete error!', true);
    }
  };

  const groupKeys = Object.keys(lookupsGrouped);

  const getGroupIcon = (groupName) => {
    const lower = groupName.toLowerCase();
    if (lower.includes('country') || lower.includes('origin')) return <Globe size={18} color="#4e73df" />;
    if (lower.includes('warranty')) return <ShieldCheck size={18} color="#1cc88a" />;
    return <Layers size={18} color="#f6c23e" />;
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1>Dynamic Specs & Metadata Groups</h1>
            <p>Manage product attributes like Country of Origin, Warranty terms, and custom taxonomy.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="admin-breadcrumb">
              <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Home size={14} />
                <span>Home</span>
              </NavLink>
              <ChevronRight size={12} style={{ opacity: 0.5 }} />
              <span>Metadata & Specs</span>
            </div>

            <button
              onClick={() => setShowNewGroupModal(true)}
              className="admin-btn admin-btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FolderPlus size={16} />
              <span>Create New Group</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedback && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              marginBottom: '20px',
              background: feedback.isError ? '#f8d7da' : '#d1e7dd',
              color: feedback.isError ? '#842029' : '#0f5132',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600
            }}
          >
            {feedback.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Groups Grid */}
        {isLoading ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: 'var(--admin-text-muted)' }}>Loading specification groups...</p>
          </div>
        ) : groupKeys.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: 'var(--admin-text-muted)' }}>No specification groups configured yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {groupKeys.map((group) => {
              const items = lookupsGrouped[group] || [];
              const isAddingHere = activeAddGroup === group;

              return (
                <div key={group} className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: 'rgba(78, 115, 223, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {getGroupIcon(group)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{group}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {items.length} Options Available
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isAddingHere) {
                          setActiveAddGroup(null);
                        } else {
                          setActiveAddGroup(group);
                          setQuickValueInput('');
                        }
                      }}
                      className="admin-btn admin-btn-sm admin-btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Option</span>
                    </button>
                  </div>

                  {/* Inline Add Option Box */}
                  {isAddingHere && (
                    <div
                      style={{
                        padding: '14px 18px',
                        background: 'var(--admin-bg)',
                        borderBottom: '1px solid var(--admin-card-border)',
                        display: 'flex',
                        gap: '8px'
                      }}
                    >
                      <input
                        type="text"
                        placeholder={`Enter new ${group} value...`}
                        value={quickValueInput}
                        onChange={(e) => setQuickValueInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddValueToGroup(group);
                        }}
                        autoFocus
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--admin-input-border)',
                          fontSize: '0.85rem'
                        }}
                      />
                      <button
                        onClick={() => handleAddValueToGroup(group)}
                        className="admin-btn admin-btn-primary admin-btn-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setActiveAddGroup(null)}
                        className="admin-btn admin-btn-outline admin-btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Items List */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 14px',
                          background: 'var(--admin-card-bg)',
                          border: '1px solid var(--admin-card-border)',
                          borderRadius: '8px',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                          {item.value}
                        </span>

                        <button
                          onClick={() => handleDeleteOption(item.id, item.value, group)}
                          title="Delete option"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e74a3b',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.7,
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create New Group */}
        {showNewGroupModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px'
            }}
          >
            <div
              className="admin-card"
              style={{
                width: '100%',
                maxWidth: '480px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                Create Specification Group
              </h2>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Define a new reusable group of options for product specifications (e.g., Material, Country, Warranty).
              </p>

              <form onSubmit={handleCreateNewGroup}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Group Name (e.g. "Frame Material", "Country of Origin")
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Group Name..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-input-border)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    First Option Value (e.g. "HM Graphite", "India", "1 Year")
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter First Value..."
                    value={newGroupValue}
                    onChange={(e) => setNewGroupValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-input-border)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewGroupModal(false)}
                    className="admin-btn admin-btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLookupsPage;

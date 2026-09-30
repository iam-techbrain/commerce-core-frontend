import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import ProfileAvatar from '../../components/common/ProfileAvatar';
import {
  Users,
  Home,
  ChevronRight,
  Search,
  UserPlus,
  Shield,
  Edit2,
  Trash2,
  Link as LinkIcon,
  CheckCircle,
  X,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Edit / Add Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: 'male',
    avatar: '',
    role: 'USER',
    password: ''
  });
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Quick Avatar Link Edit Modal
  const [avatarModalUser, setAvatarModalUser] = useState(null);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // TanStack Query: Users list
  const { data: users = [], isLoading: loading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await API.get('/users');
      return res.data?.success ? res.data.data : [];
    }
  });

  const fetchUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  // Quick Gender Update Handler
  const handleGenderChange = async (userId, newGender) => {
    try {
      const newAvatar = newGender === 'female' ? '/avatars/female.avif' : '/avatars/male.avif';
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          const isDefaultVector = !u.avatar || u.avatar.includes('/avatars/');
          return {
            ...u,
            gender: newGender,
            avatar: isDefaultVector ? newAvatar : u.avatar
          };
        })
      );

      const res = await API.put(`/users/${userId}`, { gender: newGender });
      if (res.data.success) {
        showToast(`Gender updated to ${newGender.toUpperCase()} & Avatar switched!`);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update gender on server');
      fetchUsers(); // Rollback
    }
  };

  // Quick Avatar Update Handler
  const handleSaveAvatarUrl = async () => {
    if (!avatarModalUser) return;
    try {
      setSaving(true);
      const cleanUrl = avatarUrlInput.trim();
      const fallbackGenderAvatar = (avatarModalUser.gender || 'male').toLowerCase() === 'female' ? '/avatars/female.avif' : '/avatars/male.avif';
      const targetAvatar = cleanUrl || fallbackGenderAvatar;

      const res = await API.put(`/users/${avatarModalUser.id}`, { avatar: targetAvatar });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === avatarModalUser.id ? { ...u, avatar: targetAvatar } : u))
        );
        showToast('Profile avatar updated successfully!');
        setAvatarModalUser(null);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update avatar link');
    } finally {
      setSaving(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (user) => {
    if (user.role === 'ADMIN') {
      alert('Security Protection: Primary Admin accounts cannot be deleted directly.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${user.username}" (${user.email})?`)) {
      try {
        const res = await API.delete(`/users/${user.id}`);
        if (res.data.success) {
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          showToast(`User ${user.username} deleted.`);
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (u) => {
    setEditingUser(u);
    setFormData({
      username: u.username || '',
      email: u.email || '',
      phone: u.phone || '',
      gender: u.gender || 'male',
      avatar: u.avatar || ((u.gender || 'male').toLowerCase() === 'female' ? '/avatars/female.avif' : '/avatars/male.avif'),
      role: u.role || 'USER',
      password: ''
    });
    setShowModal(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      phone: '',
      gender: 'male',
      avatar: '/avatars/male.avif',
      role: 'USER',
      password: ''
    });
    setShowModal(true);
  };

  // Submit Modal (Create or Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.phone.trim()) {
      showToast('Mobile Number is required!');
      return;
    }
    if (!formData.gender) {
      showToast('Gender is required!');
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        // Update User
        const payload = {
          username: formData.username,
          email: formData.email,
          phone: formData.phone.trim(),
          gender: formData.gender,
          avatar: formData.avatar.trim() || (formData.gender === 'female' ? '/avatars/female.avif' : '/avatars/male.avif'),
          role: formData.role
        };
        if (formData.password) {
          payload.password = formData.password;
        }

        const res = await API.put(`/users/${editingUser.id}`, payload);
        if (res.data.success) {
          showToast(`User ${formData.username} updated!`);
          setShowModal(false);
          fetchUsers();
        }
      } else {
        // Create User via Auth register with mandatory phone & gender
        const autoAvatar = formData.avatar.trim() || (formData.gender === 'female' ? '/avatars/female.avif' : '/avatars/male.avif');
        const res = await API.post('/auth/register', {
          username: formData.username,
          email: formData.email,
          phone: formData.phone.trim(),
          password: formData.password || 'User@123',
          role: formData.role,
          gender: formData.gender,
          avatar: autoAvatar
        });
        if (res.data.success) {
          showToast(`User ${formData.username} created successfully with ${formData.gender} avatar!`);
          setShowModal(false);
          fetchUsers();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesGender =
      genderFilter === 'ALL' || (u.gender || 'male').toLowerCase() === genderFilter.toLowerCase();

    const matchesRole =
      roleFilter === 'ALL' || (u.role || 'USER').toUpperCase() === roleFilter.toUpperCase();

    return matchesSearch && matchesGender && matchesRole;
  });

  const maleCount = users.filter((u) => (u.gender || 'male').toLowerCase() === 'male').length;
  const femaleCount = users.filter((u) => (u.gender || '').toLowerCase() === 'female').length;
  const adminCount = users.filter((u) => (u.role || '').toUpperCase() === 'ADMIN').length;

  return (
    <AdminLayout>
      <div>
        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              background: 'var(--pitch, #11362B)',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              borderLeft: '4px solid var(--gold, #D49B3A)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <CheckCircle size={18} color="#D49B3A" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={28} color="var(--admin-primary, #11362B)" />
              <span>Users & Profiles</span>
            </h1>
            <p>Manage customer accounts, gender preferences, avatars, and profile settings.</p>
          </div>

          <div className="admin-breadcrumb">
            <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} />
              <span>Home</span>
            </NavLink>
            <ChevronRight size={12} style={{ opacity: 0.5 }} />
            <span>Users</span>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', margin: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(17, 54, 43, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#11362B' }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: 700 }}>Total Registered</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--admin-text-dark)' }}>{users.length}</div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', margin: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(27, 94, 32, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>
              <span style={{ fontSize: '1.3rem' }}>👨</span>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: 700 }}>Male Accounts</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2e7d32' }}>{maleCount}</div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', margin: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(142, 36, 170, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8e24aa' }}>
              <span style={{ fontSize: '1.3rem' }}>👩</span>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: 700 }}>Female Accounts</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8e24aa' }}>{femaleCount}</div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', margin: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(212, 155, 58, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D49B3A' }}>
              <Shield size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: 700 }}>Admin Accounts</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b27b1e' }}>{adminCount}</div>
            </div>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="admin-card">
          {/* Card Header & Controls */}
          <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 className="admin-card-title">
                <Users size={20} color="var(--admin-primary, #11362B)" />
                <span>All Users ({filteredUsers.length})</span>
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                View and edit gender, avatars, roles and account details
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Refresh Button */}
              <button
                onClick={fetchUsers}
                className="admin-btn admin-btn-outline"
                title="Refresh user list"
                style={{ padding: '8px 12px' }}
              >
                <RefreshCw size={15} />
              </button>

              {/* Add User Button */}
              <button
                onClick={openCreateModal}
                className="admin-btn admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <UserPlus size={16} />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--admin-border, #e3e6f0)',
              background: '#fcfcfd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border, #d1d5db)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filter Group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Gender Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Gender:</span>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border, #d1d5db)',
                    fontSize: '0.85rem',
                    background: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  <option value="ALL">All Genders</option>
                  <option value="male">👨 Male Only</option>
                  <option value="female">👩 Female Only</option>
                </select>
              </div>

              {/* Role Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border, #d1d5db)',
                    fontSize: '0.85rem',
                    background: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">USER / CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <RefreshCw size={24} className="spin-slow" style={{ margin: '0 auto 10px auto', display: 'block' }} />
              <p>Loading users list from database...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <Users size={36} style={{ opacity: 0.4, marginBottom: '10px' }} />
              <p style={{ fontWeight: 600 }}>No users found matching your search or filters.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    {/* User Profile Image Column (Left Side Dedicated Column) */}
                    <th style={{ width: '90px', textAlign: 'center' }}>
                      Profile Image
                    </th>
                    <th>User Details</th>
                    <th>Role</th>
                    {/* Gender Selection Column */}
                    <th style={{ width: '190px' }}>Gender (Option)</th>
                    {/* Avatar Link Column */}
                    <th>Avatar Link</th>
                    <th>Joined</th>
                    <th style={{ textAlign: 'center', width: '110px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isMale = (u.gender || 'male').toLowerCase() === 'male';
                    const hasCustomAvatar = Boolean(u.avatar);

                    return (
                      <tr key={u.id}>
                        {/* 1. DEDICATED USER PROFILE IMAGE COLUMN */}
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <div
                            onClick={() => {
                              setAvatarModalUser(u);
                              setAvatarUrlInput(u.avatar || '');
                            }}
                            title="Click to change avatar image link"
                            style={{
                              display: 'inline-flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '10px',
                              transition: 'transform 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          >
                            <ProfileAvatar user={u} size={46} showStatus={true} />
                            <span
                              style={{
                                fontSize: '0.68rem',
                                color: 'var(--admin-primary, #11362B)',
                                fontWeight: 700,
                                marginTop: '4px',
                                textDecoration: 'underline'
                              }}
                            >
                              Edit
                            </span>
                          </div>
                        </td>

                        {/* 2. USER DETAILS */}
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--admin-text-dark)', fontSize: '0.95rem' }}>
                            {u.username}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                            {u.email}
                          </div>
                          {u.phone && (
                            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                              📞 {u.phone}
                            </div>
                          )}
                          <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>ID: #{u.id}</span>
                        </td>

                        {/* 3. ROLE */}
                        <td>
                          <span
                            className="admin-badge"
                            style={{
                              background: u.role === 'ADMIN' ? 'rgba(212, 155, 58, 0.2)' : 'rgba(59, 130, 246, 0.12)',
                              color: u.role === 'ADMIN' ? '#976a16' : '#2563eb',
                              border: `1px solid ${u.role === 'ADMIN' ? '#D49B3A' : '#93c5fd'}`,
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '20px'
                            }}
                          >
                            {u.role}
                          </span>
                        </td>

                        {/* 4. GENDER SELECTION OPTION */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'inline-flex', background: '#f3f4f6', borderRadius: '8px', padding: '3px', border: '1px solid #e5e7eb' }}>
                              {/* Male Option Button */}
                              <button
                                type="button"
                                onClick={() => handleGenderChange(u.id, 'male')}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: isMale ? '#11362B' : 'transparent',
                                  color: isMale ? '#ffffff' : '#4b5563',
                                  boxShadow: isMale ? '0 2px 5px rgba(17,54,43,0.3)' : 'none',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Set gender as Male"
                              >
                                <span>👨</span>
                                <span>Male</span>
                              </button>

                              {/* Female Option Button */}
                              <button
                                type="button"
                                onClick={() => handleGenderChange(u.id, 'female')}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: !isMale ? '#8F2B3B' : 'transparent',
                                  color: !isMale ? '#ffffff' : '#4b5563',
                                  boxShadow: !isMale ? '0 2px 5px rgba(143,43,59,0.3)' : 'none',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Set gender as Female"
                              >
                                <span>👩</span>
                                <span>Female</span>
                              </button>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                              Current: <strong style={{ color: isMale ? '#11362B' : '#8F2B3B' }}>{u.gender || 'male'}</strong>
                            </span>
                          </div>
                        </td>

                        {/* 5. AVATAR COLUMN (API AVATAR VALUE) */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontSize: '0.78rem',
                                background: '#f8fafc',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                color: '#1e293b',
                                border: '1px solid #e2e8f0',
                                maxWidth: '160px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'inline-block'
                              }}
                              title={u.avatar || (isMale ? '/avatars/male.avif' : '/avatars/female.avif')}
                            >
                              {u.avatar || (isMale ? '/avatars/male.avif' : '/avatars/female.avif')}
                            </span>
                            <button
                              onClick={() => {
                                setAvatarModalUser(u);
                                setAvatarUrlInput(u.avatar || '');
                              }}
                              className="admin-btn admin-btn-outline"
                              style={{ padding: '4px 6px' }}
                              title="Edit custom avatar link"
                            >
                              <Edit2 size={12} />
                            </button>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px' }}>
                            {u.avatar && !u.avatar.includes('/avatars/') ? '🌐 Custom Image URL' : `⚡ Auto-assigned SVG (${u.gender || 'male'})`}
                          </div>
                        </td>

                        {/* 6. JOINED DATE */}
                        <td style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </td>

                        {/* 7. ACTIONS */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => openEditModal(u)}
                              className="admin-btn admin-btn-outline"
                              style={{ padding: '6px 8px', color: '#2563eb' }}
                              title="Edit user details"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="admin-btn admin-btn-outline"
                              style={{ padding: '6px 8px', color: '#dc2626' }}
                              title="Delete user"
                            >
                              <Trash2 size={14} />
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

        {/* ======================================================== */}
        {/* QUICK AVATAR LINK MODAL */}
        {/* ======================================================== */}
        {avatarModalUser && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '16px'
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '460px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--admin-text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={20} color="var(--admin-primary, #11362B)" />
                  <span>Update Profile Image Link</span>
                </h3>
                <button
                  onClick={() => setAvatarModalUser(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '16px' }}>
                Enter direct image URL for <strong>{avatarModalUser.username}</strong> or leave blank to use the vector gender avatar.
              </p>

              {/* Avatar Live Preview */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <ProfileAvatar
                    user={{
                      ...avatarModalUser,
                      avatar: avatarUrlInput.trim() || null
                    }}
                    size={64}
                  />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginTop: '6px' }}>
                    Live Preview
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  Avatar Image URL (HTTPS / Web Link)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrlInput}
                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setAvatarUrlInput('')}
                    style={{
                      background: '#f3f4f6',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: '#4b5563'
                    }}
                  >
                    Reset to Default Vector
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAvatarModalUser(null)}
                  className="admin-btn admin-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAvatarUrl}
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Avatar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ADD / EDIT USER MODAL */}
        {/* ======================================================== */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '16px'
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '520px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--admin-text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {editingUser ? <Edit2 size={20} color="#11362B" /> : <UserPlus size={20} color="#11362B" />}
                  <span>{editingUser ? `Edit User: ${editingUser.username}` : 'Add New User'}</span>
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                {/* Live Avatar Preview */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', gap: '14px' }}>
                  <ProfileAvatar
                    user={{
                      gender: formData.gender,
                      avatar: formData.avatar || null,
                      username: formData.username
                    }}
                    size={60}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                      Profile Avatar Preview
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Linked to Gender: <strong>{formData.gender}</strong>
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                {/* Gender (Dedicated Option) */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Gender * (Updates vector profile icon automatically)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: formData.gender === 'male' ? '2px solid #11362B' : '1px solid #d1d5db',
                        background: formData.gender === 'male' ? '#11362B' : '#ffffff',
                        color: formData.gender === 'male' ? '#ffffff' : '#374151',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>👨</span>
                      <span>Male</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: formData.gender === 'female' ? '2px solid #8F2B3B' : '1px solid #d1d5db',
                        background: formData.gender === 'female' ? '#8F2B3B' : '#ffffff',
                        color: formData.gender === 'female' ? '#ffffff' : '#374151',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>👩</span>
                      <span>Female</span>
                    </button>
                  </div>
                </div>

                {/* Avatar Link */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Avatar Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or leave empty to use gender vector"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                {/* Role */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Account Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem',
                      background: '#ffffff'
                    }}
                  >
                    <option value="USER">USER (Customer)</option>
                    <option value="ADMIN">ADMIN (System Administrator)</option>
                  </select>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    {editingUser ? 'New Password (Leave blank to keep current)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    placeholder={editingUser ? '••••••••' : 'Enter strong password'}
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="admin-btn admin-btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="admin-btn admin-btn-primary"
                  >
                    {saving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
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

export default AdminUsersPage;

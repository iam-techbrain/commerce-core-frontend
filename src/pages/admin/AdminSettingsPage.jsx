import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import {
  Home,
  ChevronRight,
  Palette,
  User,
  Lock,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Save,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  DEFAULT_THEME,
  PRESET_THEMES,
  getSavedTheme,
  saveAdminTheme,
  resetAdminTheme,
  applyAdminTheme
} from '../../utils/themeManager';

const AdminSettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);

  // Active Tab: 'theme' | 'profile' | 'security' | 'new-admin'
  const [activeTab, setActiveTab] = useState('theme');

  // -------------------- 🎨 THEME CUSTOMIZER STATE --------------------
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  const [themeMsg, setThemeMsg] = useState(null);

  useEffect(() => {
    const saved = getSavedTheme();
    setCurrentTheme(saved);
  }, []);

  const handleColorChange = (key, value) => {
    const updated = { ...currentTheme, [key]: value };
    setCurrentTheme(updated);
    applyAdminTheme(updated); // Live preview instantly
  };

  const handleApplyPreset = (preset) => {
    const newTheme = {
      sidebarColor: preset.sidebarColor,
      sidebarGradient: preset.sidebarGradient,
      topbarColor: preset.topbarColor,
      bodyColor: preset.bodyColor,
      footerColor: preset.footerColor
    };
    setCurrentTheme(newTheme);
    saveAdminTheme(newTheme);
    setThemeMsg({ type: 'success', text: `Applied theme preset: ${preset.name}` });
    setTimeout(() => setThemeMsg(null), 4000);
  };

  const handleSaveTheme = (e) => {
    e.preventDefault();
    saveAdminTheme(currentTheme);
    setThemeMsg({ type: 'success', text: 'Theme colors saved to LocalStorage! They will persist on every page load.' });
    setTimeout(() => setThemeMsg(null), 4000);
  };

  const handleResetTheme = () => {
    const def = resetAdminTheme();
    setCurrentTheme(def);
    setThemeMsg({ type: 'success', text: 'Theme reset to official RuangAdmin / Chhabra Sports default colors.' });
    setTimeout(() => setThemeMsg(null), 4000);
  };

  // -------------------- 👤 PROFILE UPDATE STATE --------------------
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await API.put(`/users/${user.id}`, { username, email });
      if (res.data.success) {
        setUser((prev) => ({ ...prev, username, email }));
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setProfileMsg({ type: 'error', text: res.data.message || 'Profile update failed.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Server error while updating profile.' });
    } finally {
      setProfileLoading(false);
      setTimeout(() => setProfileMsg(null), 5000);
    }
  };

  // -------------------- 🔒 PASSWORD UPDATE STATE --------------------
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      const res = await API.put(`/users/${user.id}`, {
        currentPassword,
        password: newPassword
      });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: res.data.message || 'Password update failed.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Incorrect current password or server error.' });
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setPasswordMsg(null), 5000);
    }
  };

  // -------------------- 🛡️ CREATE NEW ADMIN STATE --------------------
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('ADMIN');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState(null);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminMsg(null);
    try {
      const res = await API.post('/auth/register', {
        username: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        role: newAdminRole
      });
      if (res.data.success) {
        setAdminMsg({ type: 'success', text: `New Administrator '${newAdminName}' created successfully with role ${newAdminRole}!` });
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPassword('');
      } else {
        setAdminMsg({ type: 'error', text: res.data.message || 'Admin creation failed.' });
      }
    } catch (err) {
      setAdminMsg({ type: 'error', text: err.response?.data?.message || 'Registration failed. Email/Username may already exist.' });
    } finally {
      setAdminLoading(false);
      setTimeout(() => setAdminMsg(null), 6000);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1>Settings & Preferences</h1>
            <p>Manage admin profile, password security, new admin creation, and custom theme appearance.</p>
          </div>

          <div className="admin-breadcrumb">
            <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} />
              <span>Home</span>
            </NavLink>
            <ChevronRight size={12} style={{ opacity: 0.5 }} />
            <span>Settings</span>
          </div>
        </div>

        {/* Tab Navigation Navigation Toolbar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--admin-border)',
          paddingBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('theme')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'theme' ? 'var(--admin-primary)' : 'transparent',
              color: activeTab === 'theme' ? '#ffffff' : 'var(--admin-text-dark)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'theme' ? '0 4px 12px rgba(78, 115, 223, 0.25)' : 'none'
            }}
          >
            <Palette size={18} />
            <span>Theme & Colors</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'profile' ? 'var(--admin-primary)' : 'transparent',
              color: activeTab === 'profile' ? '#ffffff' : 'var(--admin-text-dark)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'profile' ? '0 4px 12px rgba(78, 115, 223, 0.25)' : 'none'
            }}
          >
            <User size={18} />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'security' ? 'var(--admin-primary)' : 'transparent',
              color: activeTab === 'security' ? '#ffffff' : 'var(--admin-text-dark)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'security' ? '0 4px 12px rgba(78, 115, 223, 0.25)' : 'none'
            }}
          >
            <Lock size={18} />
            <span>Password Security</span>
          </button>

          <button
            onClick={() => setActiveTab('new-admin')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'new-admin' ? 'var(--admin-primary)' : 'transparent',
              color: activeTab === 'new-admin' ? '#ffffff' : 'var(--admin-text-dark)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'new-admin' ? '0 4px 12px rgba(78, 115, 223, 0.25)' : 'none'
            }}
          >
            <UserPlus size={18} />
            <span>Create New Admin</span>
          </button>
        </div>

        {/* =========================================================================
           TAB 1: 🎨 THEME & APPEARANCE (LocalStorage Persistence)
           ========================================================================= */}
        {activeTab === 'theme' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(78, 115, 223, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--admin-primary)'
                }}>
                  <Palette size={20} />
                </div>
                <div>
                  <h3 className="admin-card-title">Console Theme & Color Customizer</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                    Customize colors for Sidebar, Header, Body, and Footer. These colors are saved in browser LocalStorage.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-outline admin-btn"
                onClick={handleResetTheme}
                title="Reset to default RuangAdmin theme"
              >
                <RotateCcw size={15} />
                <span>Reset to Default</span>
              </button>
            </div>

            <div className="admin-card-body">
              {themeMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: themeMsg.type === 'success' ? 'rgba(28, 200, 138, 0.12)' : 'rgba(231, 74, 59, 0.12)',
                  border: `1px solid ${themeMsg.type === 'success' ? '#1cc88a' : '#e74a3b'}`,
                  color: themeMsg.type === 'success' ? '#1cc88a' : '#e74a3b'
                }}>
                  {themeMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{themeMsg.text}</span>
                </div>
              )}

              {/* 1-Click Quick Presets */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--admin-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '12px' }}>
                  ⚡ Quick 1-Click Color Presets
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {PRESET_THEMES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid var(--admin-border)',
                        background: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = preset.sidebarColor; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.sidebarColor, display: 'inline-block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.topbarColor, border: '1px solid #d1d3e2', display: 'inline-block' }} />
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.bodyColor, border: '1px solid #d1d3e2', display: 'inline-block' }} />
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--admin-text-dark)' }}>
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers Form */}
              <form onSubmit={handleSaveTheme}>
                <div style={{
                  background: '#f8f9fc',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--admin-text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--admin-primary)" />
                    <span>Custom Color Palette Controls (Live Real-time Preview)</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    {/* Sidebar Color */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-text-dark)', display: 'block', marginBottom: '8px' }}>
                        Sidebar Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="color"
                          value={currentTheme.sidebarColor}
                          onChange={(e) => handleColorChange('sidebarColor', e.target.value)}
                          style={{
                            width: '46px',
                            height: '42px',
                            borderRadius: '8px',
                            border: '1px solid var(--admin-border)',
                            cursor: 'pointer',
                            background: '#ffffff',
                            padding: '3px'
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={currentTheme.sidebarColor}
                          onChange={(e) => handleColorChange('sidebarColor', e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                        />
                      </div>
                    </div>

                    {/* Header (Topbar) Color */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-text-dark)', display: 'block', marginBottom: '8px' }}>
                        Header (Topbar) Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="color"
                          value={currentTheme.topbarColor}
                          onChange={(e) => handleColorChange('topbarColor', e.target.value)}
                          style={{
                            width: '46px',
                            height: '42px',
                            borderRadius: '8px',
                            border: '1px solid var(--admin-border)',
                            cursor: 'pointer',
                            background: '#ffffff',
                            padding: '3px'
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={currentTheme.topbarColor}
                          onChange={(e) => handleColorChange('topbarColor', e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                        />
                      </div>
                    </div>

                    {/* Body (Main Area) Color */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-text-dark)', display: 'block', marginBottom: '8px' }}>
                        Body (Page Content) Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="color"
                          value={currentTheme.bodyColor}
                          onChange={(e) => handleColorChange('bodyColor', e.target.value)}
                          style={{
                            width: '46px',
                            height: '42px',
                            borderRadius: '8px',
                            border: '1px solid var(--admin-border)',
                            cursor: 'pointer',
                            background: '#ffffff',
                            padding: '3px'
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={currentTheme.bodyColor}
                          onChange={(e) => handleColorChange('bodyColor', e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                        />
                      </div>
                    </div>

                    {/* Footer Color */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-text-dark)', display: 'block', marginBottom: '8px' }}>
                        Footer Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="color"
                          value={currentTheme.footerColor}
                          onChange={(e) => handleColorChange('footerColor', e.target.value)}
                          style={{
                            width: '46px',
                            height: '42px',
                            borderRadius: '8px',
                            border: '1px solid var(--admin-border)',
                            cursor: 'pointer',
                            background: '#ffffff',
                            padding: '3px'
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={currentTheme.footerColor}
                          onChange={(e) => handleColorChange('footerColor', e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="submit"
                    className="btn-primary admin-btn"
                    style={{ minWidth: '180px' }}
                  >
                    <Save size={18} />
                    <span>Save Theme to Browser</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 2: 👤 PROFILE UPDATE
           ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="admin-card" style={{ maxWidth: '680px' }}>
            <div className="admin-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(78, 115, 223, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--admin-primary)'
                }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 className="admin-card-title">Update Admin Profile</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                    Change your admin username and registered email address
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card-body">
              {profileMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: profileMsg.type === 'success' ? 'rgba(28, 200, 138, 0.12)' : 'rgba(231, 74, 59, 0.12)',
                  border: `1px solid ${profileMsg.type === 'success' ? '#1cc88a' : '#e74a3b'}`,
                  color: profileMsg.type === 'success' ? '#1cc88a' : '#e74a3b'
                }}>
                  {profileMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Username / Full Name *
                  </label>
                  <input
                    className="form-control"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Afzal Alam"
                    style={{ fontSize: '0.9rem', padding: '10px 14px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Email Address *
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    style={{ fontSize: '0.9rem', padding: '10px 14px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Current Role
                  </label>
                  <input
                    className="form-control"
                    disabled
                    value={user?.role || 'SUPER_ADMIN'}
                    style={{ fontSize: '0.9rem', padding: '10px 14px', background: '#eaecf4', color: '#5a5c69', cursor: 'not-allowed' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn-primary admin-btn"
                    disabled={profileLoading}
                    style={{ minWidth: '160px' }}
                  >
                    <Save size={18} />
                    <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 3: 🔒 SECURITY & PASSWORD UPDATE
           ========================================================================= */}
        {activeTab === 'security' && (
          <div className="admin-card" style={{ maxWidth: '680px' }}>
            <div className="admin-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(231, 74, 59, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--admin-danger)'
                }}>
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="admin-card-title">Update Security Password</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                    Ensure your account is protected with a secure password
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card-body">
              {passwordMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: passwordMsg.type === 'success' ? 'rgba(28, 200, 138, 0.12)' : 'rgba(231, 74, 59, 0.12)',
                  border: `1px solid ${passwordMsg.type === 'success' ? '#1cc88a' : '#e74a3b'}`,
                  color: passwordMsg.type === 'success' ? '#1cc88a' : '#e74a3b'
                }}>
                  {passwordMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword}>
                {/* Current Password */}
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Current Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-control"
                      type={showCurrentPw ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      style={{ fontSize: '0.9rem', padding: '10px 42px 10px 14px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--admin-text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    New Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-control"
                      type={showNewPw ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      style={{ fontSize: '0.9rem', padding: '10px 42px 10px 14px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--admin-text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Confirm New Password *
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    style={{ fontSize: '0.9rem', padding: '10px 14px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn-primary admin-btn"
                    disabled={passwordLoading}
                    style={{ minWidth: '160px' }}
                  >
                    <ShieldCheck size={18} />
                    <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 4: 🛡️ CREATE NEW ADMIN (New Admin Banana)
           ========================================================================= */}
        {activeTab === 'new-admin' && (
          <div className="admin-card" style={{ maxWidth: '680px' }}>
            <div className="admin-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(28, 200, 138, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--admin-success)'
                }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="admin-card-title">Register New Administrator</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                    Add sub-admins or store managers with system access permissions
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card-body">
              {adminMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: adminMsg.type === 'success' ? 'rgba(28, 200, 138, 0.12)' : 'rgba(231, 74, 59, 0.12)',
                  border: `1px solid ${adminMsg.type === 'success' ? '#1cc88a' : '#e74a3b'}`,
                  color: adminMsg.type === 'success' ? '#1cc88a' : '#e74a3b'
                }}>
                  {adminMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{adminMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleCreateAdmin}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Admin Full Name / Username *
                  </label>
                  <input
                    className="form-control"
                    required
                    autoComplete="off"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    style={{ fontSize: '0.9rem', padding: '10px 14px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Email Address *
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    required
                    autoComplete="off"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="new.admin@chhabrasports.com"
                    style={{ fontSize: '0.9rem', padding: '10px 14px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Temporary Password *
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={{ fontSize: '0.9rem', padding: '10px 14px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Assigned Role *
                  </label>
                  <select
                    className="form-control"
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    style={{ fontSize: '0.9rem', padding: '10px 14px' }}
                  >
                    <option value="ADMIN">ADMIN (Full Catalog & Order Management)</option>
                    <option value="USER">STAFF / USER (Restricted Support)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn-primary admin-btn"
                    disabled={adminLoading}
                    style={{ minWidth: '180px', background: 'var(--admin-success)', borderColor: 'var(--admin-success)' }}
                  >
                    <UserPlus size={18} />
                    <span>{adminLoading ? 'Creating...' : 'Create Administrator'}</span>
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

export default AdminSettingsPage;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import ProfileAvatar from '../components/common/ProfileAvatar';
import { compressImage } from '../utils/imageCompressor';
import {
  User,
  MapPin,
  Package,
  Download,
  LogOut,
  Plus,
  Heart,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Key,
  Camera,
  Eye,
  EyeOff,
  ShieldCheck,
  Save
} from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser, logout, updateGender, updateAvatar, updateProfile } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist, fetchWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const tabParam = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(tabParam); // 'profile', 'orders', 'addresses', 'wishlist'

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.username || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileGender, setProfileGender] = useState(user?.gender || 'male');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(user?.avatar || '');
  const [profileAvatarFile, setProfileAvatarFile] = useState(null);
  const [profileAvatarPreview, setProfileAvatarPreview] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null); // { type: 'success'|'error', text: '' }

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setProfileName(user.username || '');
      setProfilePhone(user.phone || '');
      setProfileGender(user.gender || 'male');
      setProfileAvatarUrl(user.avatar || '');
      setProfileAvatarPreview(user.avatar || '');
    }
  }, [user]);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && ['profile', 'orders', 'addresses', 'wishlist'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSelectGender = (g) => {
    setProfileGender(g);
    if (!profileAvatarFile && (!profileAvatarUrl || profileAvatarUrl.includes('/avatars/'))) {
      const defaultPath = g === 'female' ? '/avatars/female.avif' : '/avatars/male.avif';
      setProfileAvatarUrl(defaultPath);
      setProfileAvatarPreview(defaultPath);
    }
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setProfileAvatarFile(compressed);
      setProfileAvatarPreview(URL.createObjectURL(compressed));
    }
  };

  const handleResetAvatar = () => {
    setProfileAvatarFile(null);
    const defaultPath = profileGender === 'female' ? '/avatars/female.avif' : '/avatars/male.avif';
    setProfileAvatarUrl(defaultPath);
    setProfileAvatarPreview(defaultPath);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setProfileMsg({ type: 'error', text: 'Name khali nahi ho sakta!' });
      return;
    }
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      let res;
      if (profileAvatarFile) {
        const formData = new FormData();
        formData.append('username', profileName.trim());
        formData.append('phone', profilePhone.trim());
        formData.append('gender', profileGender);
        formData.append('avatar', profileAvatarFile);
        res = await API.put(`/users/${user.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await API.put(`/users/${user.id}`, {
          username: profileName.trim(),
          phone: profilePhone.trim(),
          gender: profileGender,
          avatar: profileAvatarUrl.trim() || (profileGender === 'female' ? '/avatars/female.avif' : '/avatars/male.avif')
        });
      }

      if (res.data.success) {
        const updated = res.data.data;
        if (updated.gender) localStorage.setItem(`user_gender_${user.id}`, updated.gender);
        if (updated.avatar) localStorage.setItem(`user_avatar_${user.id}`, updated.avatar);
        setUser((prev) => ({ ...prev, ...updated }));
        setProfileMsg({ type: 'success', text: 'Profile details successfully update ho gayi! 🎉' });
        setTimeout(() => setProfileMsg(null), 4000);
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Profile update failed!' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Current password enter karein!' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password kam se kam 6 characters ka hona chahiye!' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password aur Confirm password match nahi ho rahe!' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);
    try {
      const res = await API.put(`/users/${user.id}`, {
        currentPassword,
        password: newPassword
      });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password successfully change ho gaya! 🔒' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMsg(null), 4000);
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed!' });
    } finally {
      setSavingPassword(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // TanStack Query: Orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await API.get('/orders/my-orders');
      return res.data?.success ? res.data.data : [];
    },
    enabled: !!user,
  });

  // TanStack Query: Addresses
  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: async () => {
      const res = await API.get('/addresses');
      return res.data?.success ? res.data.data : [];
    },
    enabled: !!user,
  });

  const loading = ordersLoading || addressesLoading;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/addresses', {
        fullName,
        phone,
        addressLine1,
        city,
        state,
        pincode,
        country: 'India',
        isDefault: addresses.length === 0
      });
      if (res.data.success) {
        queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
        setShowAddressForm(false);
        setFullName('');
        setPhone('');
        setAddressLine1('');
        setCity('');
        setState('');
        setPincode('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Address save error!');
    }
  };

  const downloadInvoice = async (orderId, orderNumber) => {
    try {
      const res = await API.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Invoice download failed!');
    }
  };

  if (!user) return null;

  return (
    <div className="wrap" style={{ padding: '50px 32px' }}>
      {/* Page Header */}
      <div className="sec-head" style={{ marginBottom: '32px' }}>
        <div>
          <span className="eyebrow">Customer Account Console</span>
          <h1 className="display" style={{ fontSize: '36px', color: 'var(--pitch)', marginTop: '6px' }}>
            My Account & Orders
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* Profile Sidebar */}
        <div className="profile-card" style={{ height: 'fit-content' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <ProfileAvatar user={user} size={84} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px', color: 'var(--pitch)', textAlign: 'center' }}>
            {user.username}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginBottom: '14px', textAlign: 'center' }}>{user.email}</p>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: '99px',
                fontSize: '0.75rem',
                fontWeight: 800,
                background: 'rgba(212, 155, 58, 0.15)',
                color: 'var(--gold-dark)',
                fontFamily: 'Space Mono, monospace'
              }}
            >
              {user.role || 'CUSTOMER'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className={`pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabChange('profile')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>

            <button
              className={`pill-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleTabChange('orders')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Package size={18} />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              className={`pill-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => handleTabChange('addresses')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <MapPin size={18} />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              className={`pill-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => handleTabChange('wishlist')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Heart size={18} />
              <span>My Wishlist ({wishlistItems.length})</span>
            </button>

            <button
              className="btn btn-outline"
              onClick={logout}
              style={{
                justifyContent: 'center',
                width: '100%',
                marginTop: '16px',
                color: 'var(--oxblood)',
                borderColor: 'var(--oxblood)',
                background: 'transparent'
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Profile Content Area */}
        <div>
          {/* TAB 0: MY PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--pitch)', margin: 0 }}>
                    My Profile & Account Details
                  </h2>
                </div>
                <span className="eyebrow" style={{ background: 'var(--parchment)', padding: '6px 14px', borderRadius: '20px' }}>
                  Role: <strong>{user.role || 'CUSTOMER'}</strong>
                </span>
              </div>

              {/* Card 1: Personal Details & Avatar */}
              <div className="profile-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '22px' }}>
                  <User size={22} color="var(--pitch)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--pitch)' }}>
                    Personal Information & Avatar
                  </h3>
                </div>

                {profileMsg && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: profileMsg.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: profileMsg.type === 'success' ? '#15803d' : '#b91c1c',
                      border: `1px solid ${profileMsg.type === 'success' ? '#86efac' : '#fca5a5'}`
                    }}
                  >
                    {profileMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                {/* Avatar & Photo Customizer Box */}
                <div
                  style={{
                    background: 'var(--parchment)',
                    padding: '22px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    marginBottom: '24px',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr',
                    gap: '24px',
                    alignItems: 'center'
                  }}
                >
                  {/* Live Preview Avatar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <ProfileAvatar
                      user={{
                        ...user,
                        gender: profileGender,
                        avatar: profileAvatarPreview || user.avatar
                      }}
                      size={96}
                    />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                      Live Preview
                    </span>
                  </div>

                  {/* Photo & Gender Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Gender Buttons */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--pitch)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Gender / Avatar Selection:
                      </label>
                      <div style={{ display: 'inline-flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => handleSelectGender('male')}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '8px',
                            border: profileGender === 'male' ? '2px solid var(--pitch)' : '1px solid var(--line)',
                            background: profileGender === 'male' ? 'var(--pitch)' : 'var(--white)',
                            color: profileGender === 'male' ? '#ffffff' : 'var(--ink)',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>👨 Male</span>
                          {profileGender === 'male' && <CheckCircle2 size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectGender('female')}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '8px',
                            border: profileGender === 'female' ? '2px solid #8F2B3B' : '1px solid var(--line)',
                            background: profileGender === 'female' ? '#8F2B3B' : 'var(--white)',
                            color: profileGender === 'female' ? '#ffffff' : 'var(--ink)',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>👩 Female</span>
                          {profileGender === 'female' && <CheckCircle2 size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Photo URL & File Upload */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                          Custom Photo URL (HTTPS Link):
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://images.unsplash.com/..."
                          value={profileAvatarUrl}
                          onChange={(e) => {
                            setProfileAvatarUrl(e.target.value);
                            setProfileAvatarPreview(e.target.value);
                          }}
                          style={{ fontSize: '12px', padding: '8px 12px' }}
                        />
                      </div>

                      <div style={{ alignSelf: 'flex-end' }}>
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            background: 'var(--white)',
                            border: '1px solid var(--line)',
                            color: 'var(--pitch)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                          title="Upload image from your computer (auto-compressed to WebP)"
                        >
                          <Camera size={14} />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    </div>

                    {(profileAvatarUrl || profileAvatarFile) && (
                      <div>
                        <button
                          type="button"
                          onClick={handleResetAvatar}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          ↺ Reset to Default Gender Avatar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Details Form */}
                <form onSubmit={handleSaveProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, color: 'var(--pitch)', fontSize: '0.88rem', marginBottom: '6px', display: 'block' }}>
                        Full Name / Username *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Aapka Naam"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 700, color: 'var(--pitch)', fontSize: '0.88rem', marginBottom: '6px', display: 'block' }}>
                        Mobile / Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, color: 'var(--pitch)', fontSize: '0.88rem', marginBottom: '6px', display: 'block' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={user.email}
                        disabled
                        style={{ background: 'var(--parchment-dim)', color: 'var(--ink-soft)', cursor: 'not-allowed' }}
                      />
                      <small style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '4px', display: 'block' }}>
                        Security reason se email change nahi kiya ja sakta.
                      </small>
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 700, color: 'var(--pitch)', fontSize: '0.88rem', marginBottom: '6px', display: 'block' }}>
                        Account Role & Status
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${user.role || 'CUSTOMER'} (Active)`}
                        disabled
                        style={{ background: 'var(--parchment-dim)', color: 'var(--ink-soft)', cursor: 'not-allowed' }}
                      />
                      <small style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '4px', display: 'block' }}>
                        Joined on {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </small>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold"
                    disabled={savingProfile}
                    style={{ minWidth: '180px', padding: '12px 24px', fontSize: '13px' }}
                  >
                    <Save size={16} />
                    <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </form>
              </div>

              {/* Card 2: Security & Password Management */}
              <div className="profile-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '22px' }}>
                  <Key size={22} color="var(--pitch)" />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--pitch)' }}>
                      Security & Change Password
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                      Apna account secure rakhne ke liye naya password set karein (Min 6 characters).
                    </p>
                  </div>
                </div>

                {passwordMsg && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: passwordMsg.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: passwordMsg.type === 'success' ? '#15803d' : '#b91c1c',
                      border: `1px solid ${passwordMsg.type === 'success' ? '#86efac' : '#fca5a5'}`
                    }}
                  >
                    {passwordMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword}>
                  <div style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Current Password */}
                    <div className="form-group">
                      <label style={{ fontWeight: 700, color: 'var(--pitch)', fontSize: '0.88rem', marginBottom: '6px', display: 'block' }}>
                        Current Password *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Purana password daalein"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          style={{ paddingRight: '40px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--ink-soft)',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="form-group">
                      <label style={{ fontWeight: 700, color: 'var(--pitch)', fontSize: '0.88rem', marginBottom: '6px', display: 'block' }}>
                        New Password *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Naya password (min 6 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          style={{ paddingRight: '40px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--ink-soft)',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                      <label style={{ fontWeight: 700, color: 'var(--pitch)', fontSize: '0.88rem', marginBottom: '6px', display: 'block' }}>
                        Confirm New Password *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Naya password dobara daalein"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          style={{ paddingRight: '40px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--ink-soft)',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <button
                        type="submit"
                        className="btn btn-outline"
                        disabled={savingPassword}
                        style={{
                          borderColor: 'var(--pitch)',
                          color: 'var(--pitch)',
                          padding: '12px 24px',
                          fontSize: '13px',
                          fontWeight: 700
                        }}
                      >
                        <ShieldCheck size={16} />
                        <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 1: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--pitch)' }}>Order History</h2>
                <span className="eyebrow">{orders.length} Total Orders</span>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>Loading Orders...</div>
              ) : orders.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '48px' }}>
                  <Package size={48} color="var(--ink-soft)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--ink-soft)', fontSize: '1rem' }}>Aapne abhi tak koi order place nahi kiya.</p>
                  <button className="btn btn-gold" style={{ marginTop: '16px' }} onClick={() => navigate('/products')}>
                    Browse Catalog
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="profile-card" style={{ marginBottom: '20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--line)',
                        paddingBottom: '16px',
                        marginBottom: '16px'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Space Mono, monospace' }}>
                          Order Reference
                        </span>
                        <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--pitch)', marginTop: '2px', fontFamily: 'Space Mono, monospace' }}>
                          #{order.orderNumber}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            padding: '6px 14px',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            fontFamily: 'Space Mono, monospace',
                            background: order.paymentStatus === 'PAID' ? 'rgba(17, 54, 43, 0.1)' : 'rgba(109, 30, 42, 0.1)',
                            color: order.paymentStatus === 'PAID' ? 'var(--pitch)' : 'var(--oxblood)',
                            border: `1px solid ${order.paymentStatus === 'PAID' ? 'var(--pitch)' : 'var(--oxblood)'}`
                          }}
                        >
                          {order.paymentStatus === 'PAID' ? '✓ PAID' : 'PENDING'}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'var(--parchment)',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            border: '1px solid var(--line)'
                          }}
                        >
                          <img
                            src={
                              item.product?.imageUrl
                                ? item.product.imageUrl.startsWith('http')
                                  ? item.product.imageUrl
                                  : `${item.product.imageUrl}`
                                : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100'
                            }
                            alt={item.product?.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>
                              {item.product?.name || 'Product Item'}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                              Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <strong style={{ fontSize: '1rem', fontFamily: 'Space Mono, monospace', color: 'var(--pitch)' }}>
                            ₹{item.totalPrice?.toLocaleString('en-IN')}
                          </strong>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary Footer */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--line)'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Total Amount: </span>
                        <strong style={{ fontSize: '1.25rem', color: 'var(--pitch)', fontFamily: 'Space Mono, monospace', marginLeft: '6px' }}>
                          ₹{order.finalAmount?.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '11px', color: 'var(--pitch)', borderColor: 'var(--pitch)' }}
                        onClick={() => downloadInvoice(order.id, order.orderNumber)}
                      >
                        <Download size={14} /> PDF Invoice
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--pitch)' }}>Saved Shipping Addresses</h2>
                <button
                  className="btn btn-gold"
                  style={{ padding: '10px 18px', fontSize: '11px' }}
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  <Plus size={14} /> Add New Address
                </button>
              </div>

              {showAddressForm && (
                <div className="profile-card" style={{ marginBottom: '28px', border: '1.5px solid var(--gold)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', color: 'var(--pitch)' }}>
                    Add Shipping Address
                  </h3>
                  <form onSubmit={handleAddAddress}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input className="form-control" placeholder="Enter Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input className="form-control" placeholder="Enter Mobile No" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label>Address Line 1</label>
                      <input className="form-control" placeholder="Flat / House No., Street, Area" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div className="form-group">
                        <label>City</label>
                        <input className="form-control" placeholder="Patna" required value={city} onChange={(e) => setCity(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input className="form-control" placeholder="Bihar" required value={state} onChange={(e) => setState(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Pincode</label>
                        <input className="form-control" placeholder="800020" required value={pincode} onChange={(e) => setPincode(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="btn btn-gold">Save Address</button>
                      <button type="button" className="btn btn-outline" style={{ color: 'var(--ink)' }} onClick={() => setShowAddressForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '48px' }}>
                  <MapPin size={48} color="var(--ink-soft)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--ink-soft)' }}>Koi saved address nahi hai.</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className="profile-card" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--pitch)', marginBottom: '4px' }}>
                          {addr.fullName} <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 400 }}>({addr.phone})</span>
                        </h4>
                        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
                          {addr.addressLine1}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>
                      {addr.isDefault && (
                        <span
                          style={{
                            background: 'rgba(17, 54, 43, 0.1)',
                            color: 'var(--pitch)',
                            border: '1px solid var(--pitch)',
                            padding: '4px 10px',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            fontFamily: 'Space Mono, monospace'
                          }}
                        >
                          ✓ DEFAULT
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--pitch)' }}>My Saved Wishlist</h2>
                <span className="eyebrow">{wishlistItems.length} Products Saved</span>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '48px' }}>
                  <Heart size={48} color="var(--ink-soft)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--ink-soft)', fontSize: '1rem' }}>Aapki wishlist abhi khali hai.</p>
                  <button className="btn btn-gold" style={{ marginTop: '16px' }} onClick={() => navigate('/products')}>
                    Explore Products
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {wishlistItems.map((item) => {
                    const prod = item.product || item;
                    const imageSrc = prod.imageUrl
                      ? prod.imageUrl.startsWith('http')
                        ? prod.imageUrl
                        : `${prod.imageUrl}`
                      : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500';

                    return (
                      <div key={item.id || prod.id} className="prod-card" style={{ background: 'var(--white)' }}>
                        <div className="prod-media" style={{ height: '200px' }}>
                          <img src={imageSrc} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            className="prod-wish active"
                            onClick={() => toggleWishlist(prod)}
                            title="Remove from wishlist"
                          >
                            <Trash2 size={16} color="var(--oxblood)" />
                          </button>
                        </div>
                        <div className="prod-info" style={{ padding: '16px' }}>
                          <div className="prod-brand">{prod.brand?.name || prod.brandName || 'Chhabra Sports'}</div>
                          <h4 className="prod-name" style={{ minHeight: 'auto', marginBottom: '8px' }}>{prod.name}</h4>
                          <div className="prod-price" style={{ marginBottom: '14px' }}>
                            <span className="price-now">₹{prod.price?.toLocaleString('en-IN')}</span>
                          </div>
                          <button
                            className="btn btn-gold"
                            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '11px' }}
                            onClick={() => addToCart(prod.id, 1)}
                          >
                            <ShoppingCart size={15} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const AdminLoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as Admin, redirect immediately to Admin Dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Aapka current account Customer role ka hai. Admin account se login karein.');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        const loggedInUser = res.data?.user || res.user;
        if (loggedInUser?.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          setError('Aapka account Admin role ka nahi hai. Authorized Admin account se login karein.');
        }
      } else {
        setError(res.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin authentication failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #1B4D3E 0%, #0A241C 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--white)',
          borderRadius: '12px',
          padding: '40px 32px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          border: '1px solid rgba(212, 155, 58, 0.3)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--pitch)',
              color: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(17, 54, 43, 0.25)'
            }}
          >
            <Shield size={28} />
          </div>

          <span
            className="eyebrow"
            style={{
              display: 'inline-block',
              background: 'rgba(212, 155, 58, 0.15)',
              color: 'var(--gold-dark)',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '11px',
              marginBottom: '8px'
            }}
          >
            👑 Restricted Access
          </span>

          <h1
            className="display"
            style={{
              fontSize: '26px',
              color: 'var(--pitch)',
              margin: '4px 0 6px',
              fontWeight: 800
            }}
          >
            Store Admin Console
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13px' }}>
            Authorized portal for store management & live analytics
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--oxblood)',
              border: '1px solid var(--oxblood)',
              padding: '12px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} /> Admin Email
            </label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} /> Master Password
            </label>
            <input
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            style={{
              width: '100%',
              padding: '14px',
              justifyContent: 'center',
              marginTop: '12px',
              fontSize: '12px'
            }}
            disabled={loading}
          >
            {loading ? 'Authenticating Admin...' : 'Enter Admin Console'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--pitch)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={14} /> Back to Customer Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, Lock, Mail, User } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useContext(AuthContext);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLoginTab) {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        }
      } else {
        const res = await register(username, email, password);
        if (res.success) {
          alert('Registration successful! Please login.');
          setIsLoginTab(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication error!');
    }
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '420px',
          background: 'var(--bg-dark)',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '32px',
          zIndex: 300,
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            {isLoginTab ? 'Login to Account' : 'Create New Account'}
          </h2>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLoginTab && (
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'white', marginTop: '4px' }}
                placeholder="john_doe"
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'white', marginTop: '4px' }}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'white', marginTop: '4px' }}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            {isLoginTab ? 'Login Now' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLoginTab ? "Don't have an account? " : "Already have an account? "}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setIsLoginTab(!isLoginTab)}
          >
            {isLoginTab ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthModal;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, User } from 'lucide-react';

const LoginPage = () => {
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect based on role in useEffect
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN' || user.email === 'afzal@schooldigitalised.com') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginTab) {
        const res = await login(email, password);
        if (res.success) {
          const loggedInUser = res.data?.user || res.user;
          if (loggedInUser?.role === 'ADMIN' || loggedInUser?.email === 'afzal@schooldigitalised.com') {
            navigate('/admin/dashboard');
          } else {
            navigate('/profile');
          }
        } else {
          setError(res.message || 'Login failed!');
        }
      } else {
        const res = await register(username, email, password, role);
        if (res.success) {
          alert(`Registration successful as ${role}! Please login.`);
          setIsLoginTab(true);
        } else {
          setError(res.message || 'Registration failed!');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication error!');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setIsLoginTab(true);
  };

  return (
    <div className="wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '65vh', padding: '50px 20px' }}>
      <div className="auth-card" style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: '12px', padding: '36px', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <ShieldCheck size={42} color="var(--pitch)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--pitch)', fontFamily: 'Outfit, sans-serif' }}>
            {isLoginTab ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginTop: '4px' }}>
            {isLoginTab ? 'Login to access your orders & profile' : 'Sign up to start shopping on Chhabra Sports'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--oxblood)', border: '1px solid var(--oxblood)', padding: '12px 16px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginTab && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Account Type (Role)</label>
                <select
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ background: 'var(--white)', color: 'var(--ink)' }}
                >
                  <option value="CUSTOMER">🛍️ Customer / Buyer</option>
                  <option value="ADMIN">👑 Admin / Store Owner</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="afzal@schooldigitalised.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '14px', marginTop: '12px', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Please wait...' : isLoginTab ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        {isLoginTab && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
            <span className="eyebrow" style={{ display: 'block', textAlign: 'center', marginBottom: '10px' }}>
              Quick Demo Access
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: '8px', fontSize: '10.5px', justifyContent: 'center', color: 'var(--pitch)', borderColor: 'var(--line)', background: 'var(--parchment)' }}
                onClick={() => fillCredentials('afzal@schooldigitalised.com', 'password123')}
              >
                👤 Afzal (Admin)
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: '8px', fontSize: '10.5px', justifyContent: 'center', color: 'var(--pitch)', borderColor: 'var(--line)', background: 'var(--parchment)' }}
                onClick={() => fillCredentials('rahul@gmail.com', 'password123')}
              >
                🛍️ Rahul (Customer)
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
          {isLoginTab ? "Don't have an account? " : "Already have an account? "}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--pitch)', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => { setIsLoginTab(!isLoginTab); setError(''); }}
          >
            {isLoginTab ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

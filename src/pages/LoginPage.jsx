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
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
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
        // Registration Mandatory Validations
        if (!phone.trim()) {
          setError('Mobile Number is mandatory (zaroori) for registration!');
          setLoading(false);
          return;
        }
        if (!gender) {
          setError('Please select your gender (Male / Female)!');
          setLoading(false);
          return;
        }

        const res = await register(username, email, password, 'CUSTOMER', gender, phone.trim());
        if (res.success) {
          alert('Registration successful! Please sign in.');
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
                  placeholder="Enter Your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  required
                  className="form-control"
                  placeholder="Enter Your Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Simple Clean Gender Selection */}
              <div className="form-group">
                <label>Gender *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: gender === 'male' ? '2px solid var(--pitch)' : '1px solid var(--line)',
                      background: gender === 'male' ? 'var(--pitch)' : 'var(--white)',
                      color: gender === 'male' ? '#ffffff' : 'var(--ink)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>👨 Male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: gender === 'female' ? '2px solid #8F2B3B' : '1px solid var(--line)',
                      background: gender === 'female' ? '#8F2B3B' : 'var(--white)',
                      color: gender === 'female' ? '#ffffff' : 'var(--ink)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>👩 Female</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="Enter Your Email"
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
                onClick={() => fillCredentials('admin@gmail.com', '123456')}
              >
                👤 Admin User (Admin)
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: '8px', fontSize: '10.5px', justifyContent: 'center', color: 'var(--pitch)', borderColor: 'var(--line)', background: 'var(--parchment)' }}
                onClick={() => fillCredentials('ajay@gmail.com', '123456')}
              >
                🛍️ Ajay Yadav (Customer)
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: '8px', fontSize: '10.5px', justifyContent: 'center', color: 'var(--pitch)', borderColor: 'var(--line)', background: 'var(--parchment)' }}
                onClick={() => fillCredentials('katrina@gmail.com', '123456')}
              >
                🛍️ Katrina Kaif (Customer)
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: '8px', fontSize: '10.5px', justifyContent: 'center', color: 'var(--pitch)', borderColor: 'var(--line)', background: 'var(--parchment)' }}
                onClick={() => fillCredentials('rohan@gmail.com', '123456')}
              >
                🛍️ Rohan Verma (Customer)
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: '8px', fontSize: '10.5px', justifyContent: 'center', color: 'var(--pitch)', borderColor: 'var(--line)', background: 'var(--parchment)' }}
                onClick={() => fillCredentials('ananya@gmail.com', '123456')}
              >
                🛍️ Ananya Gupta (Customer)
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

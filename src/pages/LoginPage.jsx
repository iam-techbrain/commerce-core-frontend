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
        {/* Demo Fast Login Buttons */}
        {isLoginTab && (
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="eyebrow" style={{ fontSize: '11px', letterSpacing: '1px', color: 'var(--ink-soft)' }}>
                ⚡ Quick Demo Access
              </span>
              <span style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'monospace' }}>
                Click to Auto-Fill
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Admin User', role: 'ADMIN', email: 'admin@gmail.com', pass: '123456', icon: '🛡️', isAdmin: true },
                { name: 'Ajay Yadav', role: 'CUSTOMER', email: 'ajay@gmail.com', pass: '123456', icon: '🏸' },
                { name: 'Katrina Kaif', role: 'CUSTOMER', email: 'katrina@gmail.com', pass: '123456', icon: '🎾' },
                { name: 'Rohan Verma', role: 'CUSTOMER', email: 'rohan@gmail.com', pass: '123456', icon: '🏏' },
                { name: 'Ananya Gupta', role: 'CUSTOMER', email: 'ananya@gmail.com', pass: '123456', icon: '🏃‍♀️' }
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillCredentials(acc.email, acc.pass)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: acc.isAdmin ? '#131815' : '#1c221e',
                    border: acc.isAdmin ? '1px solid rgba(212, 155, 58, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#f4f5f3',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = acc.isAdmin ? '#19201b' : '#252d27';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = acc.isAdmin ? '#131815' : '#1c221e';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>{acc.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                        {acc.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9aa59e', fontFamily: 'monospace' }}>
                        {acc.email}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.6px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: acc.isAdmin ? 'rgba(212, 155, 58, 0.2)' : 'rgba(255, 255, 255, 0.07)',
                      color: acc.isAdmin ? 'var(--gold)' : '#c0cbc4',
                      border: acc.isAdmin ? '1px solid rgba(212, 155, 58, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {acc.role}
                  </span>
                </button>
              ))}
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

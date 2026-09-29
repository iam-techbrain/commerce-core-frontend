import React, { useEffect, useState } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash preloader for ~1.5 seconds on first load
    const timer = setTimeout(() => {
      setFadeOut(true);
      const hideTimer = setTimeout(() => {
        setLoading(false);
      }, 500); // 500ms fade transition
      return () => clearTimeout(hideTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0A241C', // Pitch dark background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
        pointerEvents: fadeOut ? 'none' : 'all'
      }}
    >
      {/* Centered Chhabra Sports Logo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          animation: 'pulseGlow 2s infinite ease-in-out'
        }}
      >
        <img
          src="https://chhabrasports.com/wp-content/uploads/2025/09/csa-acrylic-letter-cutting-scaled-e1756718460651.jpg"
          alt="Chhabra Sports Logo"
          style={{
            height: '60px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(212, 155, 58, 0.25)',
            border: '1px solid rgba(212, 155, 58, 0.4)'
          }}
        />

        {/* Brand Tagline / Status */}
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            letterSpacing: '2px',
            color: '#D49B3A',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          Chhabra Sports
        </span>

        {/* Spinning Gold Ring Loader */}
        <div
          style={{
            width: '38px',
            height: '38px',
            border: '3px solid rgba(212, 155, 58, 0.2)',
            borderTop: '3px solid #D49B3A',
            borderRight: '3px solid #D49B3A',
            borderRadius: '50%',
            animation: 'spinRing 0.8s linear infinite',
            marginTop: '4px'
          }}
        ></div>
      </div>

      <style>{`
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.92; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
};

export default Preloader;

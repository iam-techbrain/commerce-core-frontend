import React from 'react';
import { User, LogIn } from 'lucide-react';

/**
 * Professional Profile Avatar Component
 * Supports Male, Female, and Guest (Not Logged In) states
 */
export const MaleAvatar = ({ size = 38 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ borderRadius: '50%', display: 'block' }}
  >
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="#11362B" stroke="#D49B3A" strokeWidth="3" />
    
    {/* Male Hair */}
    <path
      d="M32 38C32 26 40 18 50 18C60 18 68 26 68 38C68 40 67 44 65 44C62 38 58 35 50 35C42 35 37 38 35 44C33 44 32 40 32 38Z"
      fill="#1A202C"
    />
    
    {/* Face */}
    <ellipse cx="50" cy="46" rx="17" ry="20" fill="#FBD38D" />
    
    {/* Hair details */}
    <path
      d="M33 34C37 24 45 20 56 22C64 24 67 30 67 36C65 32 58 29 50 29C42 29 36 31 33 34Z"
      fill="#2D3748"
    />
    
    {/* Ears */}
    <ellipse cx="32" cy="46" rx="3.5" ry="5.5" fill="#FBD38D" />
    <ellipse cx="68" cy="46" rx="3.5" ry="5.5" fill="#FBD38D" />

    {/* Eyes */}
    <ellipse cx="44" cy="44" rx="2" ry="2" fill="#2D3748" />
    <ellipse cx="56" cy="44" rx="2" ry="2" fill="#2D3748" />

    {/* Eyebrows */}
    <path d="M41 40C43 39 46 39 47 40" stroke="#1A202C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M53 40C54 39 57 39 59 40" stroke="#1A202C" strokeWidth="1.5" strokeLinecap="round" />

    {/* Smile */}
    <path d="M46 54C48 56 52 56 54 54" stroke="#C05621" strokeWidth="1.5" strokeLinecap="round" />

    {/* Neck */}
    <rect x="45" y="62" width="10" height="9" fill="#ED8936" opacity="0.6" />

    {/* Shoulders / Suit & Collar */}
    <path
      d="M20 90C22 75 32 68 44 68H56C68 68 78 75 80 90C72 96 61 100 50 100C39 100 28 96 20 90Z"
      fill="#0A241C"
    />
    {/* White Shirt Collar */}
    <polygon points="50,78 43,68 57,68" fill="#FFFFFF" />
    {/* Gold Tie */}
    <polygon points="50,73 47,88 50,92 53,88" fill="#D49B3A" />
  </svg>
);

export const FemaleAvatar = ({ size = 38 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ borderRadius: '50%', display: 'block' }}
  >
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="#8F2B3B" stroke="#D49B3A" strokeWidth="3" />

    {/* Female Hair Back */}
    <path
      d="M28 42C26 56 26 72 32 82C36 78 38 70 38 64V46C38 32 44 20 50 20C56 20 62 32 62 46V64C62 70 64 78 68 82C74 72 74 56 72 42C70 28 62 18 50 18C38 18 30 28 28 42Z"
      fill="#1A202C"
    />

    {/* Face */}
    <ellipse cx="50" cy="48" rx="16" ry="19" fill="#FEEBC8" />

    {/* Female Hair Front with Soft Bangs */}
    <path
      d="M32 40C34 26 42 20 50 20C58 20 66 26 68 40C64 34 56 31 50 31C44 31 36 34 32 40Z"
      fill="#2D3748"
    />
    <path d="M34 38C38 46 41 54 41 58" stroke="#1A202C" strokeWidth="3" strokeLinecap="round" />
    <path d="M66 38C62 46 59 54 59 58" stroke="#1A202C" strokeWidth="3" strokeLinecap="round" />

    {/* Ears & Earrings */}
    <ellipse cx="33" cy="49" rx="2.5" ry="4" fill="#FEEBC8" />
    <ellipse cx="67" cy="49" rx="2.5" ry="4" fill="#FEEBC8" />
    <circle cx="33" cy="53" r="2" fill="#D49B3A" />
    <circle cx="67" cy="53" r="2" fill="#D49B3A" />

    {/* Eyes & Lashes */}
    <ellipse cx="44" cy="46" rx="2" ry="2" fill="#2D3748" />
    <ellipse cx="56" cy="46" rx="2" ry="2" fill="#2D3748" />
    <path d="M42 44C44 43 46 43 47 44" stroke="#1A202C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M53 44C54 43 56 43 58 44" stroke="#1A202C" strokeWidth="1.5" strokeLinecap="round" />

    {/* Lips */}
    <path d="M47 56C49 57.5 51 57.5 53 56" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" />

    {/* Neck */}
    <rect x="46" y="64" width="8" height="8" fill="#FBD38D" />

    {/* Blouse & Necklace */}
    <path
      d="M22 90C25 76 34 70 45 70H55C66 70 75 76 78 90C70 96 60 100 50 100C40 100 30 96 22 90Z"
      fill="#6D1E2A"
    />
    <path d="M45 71C48 76 52 76 55 71" stroke="#D49B3A" strokeWidth="2" fill="none" />
  </svg>
);

export const GuestAvatar = ({ size = 38 }) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      border: '2px dashed var(--line)',
      background: 'var(--parchment-dim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-soft)',
      position: 'relative',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    title="Not Logged In — Click to Sign In"
  >
    <User size={size * 0.52} strokeWidth={1.8} />
    {/* Small red/grey dot indicating guest status */}
    <span
      style={{
        position: 'absolute',
        bottom: '-1px',
        right: '-1px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: 'var(--ink-soft)',
        border: '2px solid #ffffff'
      }}
    />
  </div>
);

const ProfileAvatar = ({ user, size = 38, showStatus = true }) => {
  const [imgError, setImgError] = React.useState(false);

  if (!user) {
    return <GuestAvatar size={size} />;
  }

  const gender = (user.gender || 'male').toLowerCase();
  const hasCustomImg = user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:') || user.avatar.startsWith('/')) && !imgError;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {hasCustomImg ? (
        <img
          src={user.avatar}
          alt={user.username || 'User Avatar'}
          onError={() => setImgError(true)}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #D49B3A',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
      ) : gender === 'female' ? (
        <FemaleAvatar size={size} />
      ) : (
        <MaleAvatar size={size} />
      )}
      
      {/* Online Active Badge (Green Indicator) */}
      {showStatus && (
        <span
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: `${Math.max(9, size * 0.26)}px`,
            height: `${Math.max(9, size * 0.26)}px`,
            borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #ffffff',
            boxShadow: '0 0 4px rgba(34, 197, 94, 0.6)'
          }}
          title="Active Account"
        />
      )}
    </div>
  );
};

export default ProfileAvatar;

import React from 'react';

const AdminStatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="profile-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        background: `rgba(${color}, 0.15)`,
        color: `rgb(${color})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {Icon && <Icon size={28} />}
      </div>
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</span>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>{value}</h3>
      </div>
    </div>
  );
};

export default AdminStatCard;

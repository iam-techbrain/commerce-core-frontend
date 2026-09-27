import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminStatCard = ({ title, value, icon: Icon, type = 'primary', change = '+12% this month' }) => {
  return (
    <div className={`admin-stat-card ${type}`}>
      <div>
        <div className="admin-stat-title">{title}</div>
        <div className="admin-stat-value">{value}</div>
        {change && (
          <div className="admin-stat-change" style={{ color: type === 'danger' ? '#e74a3b' : '#1cc88a' }}>
            {type === 'danger' ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="admin-stat-icon-badge">
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default AdminStatCard;

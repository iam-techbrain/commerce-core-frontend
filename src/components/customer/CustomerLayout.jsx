import React from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

const CustomerLayout = ({ children }) => {
  return (
    <div className="court-pattern" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <CustomerFooter />
    </div>
  );
};

export default CustomerLayout;

import React from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import FloatingSocialBar from './FloatingSocialBar';

const CustomerLayout = ({ children }) => {
  return (
    <div className="court-pattern" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <FloatingSocialBar />
      <CustomerFooter />
    </div>
  );
};

export default CustomerLayout;

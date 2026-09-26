import React from 'react';
import CustomerLayout from '../customer/CustomerLayout';

const Layout = ({ children }) => {
  return <CustomerLayout>{children}</CustomerLayout>;
};

export default Layout;

import React from 'react';
import '../styles/components.css'; // Import layout specific styles

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export default Layout;
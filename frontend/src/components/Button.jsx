import React from 'react';
import '../styles/components.css'; // Import component specific styles

const Button = ({ onClick, children, disabled, className }) => {
  const buttonClass = `button ${className || ''}`;
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
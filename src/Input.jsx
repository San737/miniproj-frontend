import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ 
  fluid = false, 
  className = '', 
  value = '', 
  onChange,
  label,
  ...props 
}) => {
  // Convert value to string if it's a number
  const stringValue = typeof value === 'number' ? String(value) : value;
  
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type="text"
        className={`
          w-full 
          px-3 
          py-2 
          bg-white 
          border 
          border-gray-300 
          rounded-md 
          ${fluid ? 'w-full' : ''}
          ${className}
        `}
        value={stringValue}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

Input.propTypes = {
  fluid: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string
};

export default Input;
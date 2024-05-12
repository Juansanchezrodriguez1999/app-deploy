import React from 'react';

const Input = ({ name, label, required, disabled, error, type, defaultValue, placeholder, ...props }) => {
  return (
    <div id={name} className="space-y-2">
      <label className="mb-2 block text-sm font-bold text-gray-900 dark:text-white">
        {label} {required && <span className="font-bold text-lifewatch_orange">*</span>}
      </label>
      <input
        type={type || 'text'}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        {...props.register(name, { required })}
        disabled={disabled}
        style={{ cursor: disabled ? 'not-allowed' : 'auto' }}
      />
      {error && <p className="text-sm text-lifewatch_orange">{error}</p>}
    </div>
  );
};

export default Input;

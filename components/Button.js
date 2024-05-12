import React from 'react';

import clsx from 'clsx';

const buttonVariantClasses = {
  base: 'inline-flex items-center rounded px-3 py-1.5 transition-colors hover:shadow-sm',
  outlined: 'hover:shadow-sm border bg-white hover:border-gray-300 hover:bg-gray-50',
};

const Button = ({ icon, color, variant, children, ...rest }) => {
  const baseColor = color || 'text-black',
    baseVariant = variant || 'outlined';

  return (
    <button
      className={clsx(buttonVariantClasses['base'], `text-${baseColor}`, buttonVariantClasses[baseVariant])}
      {...rest}
    >
      {icon && React.cloneElement(icon, { className: `mr-1 fill-${baseColor}` })}
      {children}
    </button>
  );
};

export default Button;

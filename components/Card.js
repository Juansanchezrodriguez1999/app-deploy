import React from 'react';

import clsx from 'clsx';

const CardHeader = ({ children }) => children;

const CardBody = ({ children }) => children;

const CardFooter = ({ children }) => children;

const Card = (props) => {
  return (
    <span
      className={clsx(
        'flex flex-col space-y-4 border border-t-2 border-b-gray-200 bg-white p-6',
        props.disabled ? `border-t-gray-500 text-gray-500` : `transition-shadow ease-in-out hover:shadow-sm`,
        props.className,
      )}
    >
      {props.children}
    </span>
  );
};

Card.Header = CardHeader;

Card.Body = CardBody;

Card.Footer = CardFooter;

export default Card;

import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '',
  onClick = null,
  padding = 'normal',
  hover = false
}) => {
  const classes = [
    'card',
    `card-padding-${padding}`,
    hover && 'card-hover',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;

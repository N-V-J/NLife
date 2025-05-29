import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  to, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-accent text-white',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;

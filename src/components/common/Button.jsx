const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '', disabled = false }) => {
  const baseStyles = 'font-medium px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600',
    outline: 'bg-transparent hover:bg-primary-50 text-primary-600 border border-primary-600 dark:hover:bg-primary-900 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
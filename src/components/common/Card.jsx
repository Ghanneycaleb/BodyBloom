const Card = ({ children, className = '', hover = true }) => {
  const hoverEffect = hover ? 'hover:shadow-md' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-shadow duration-200 ${hoverEffect} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
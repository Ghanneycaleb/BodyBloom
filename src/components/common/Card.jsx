// const Card = ({ children, className = "" }) => {
//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}
//     >
//       {children}
//     </div>
//   );
// };

// export default Card;
const Card = ({ children, className = '', hover = true }) => {
  const hoverEffect = hover ? 'dark:hover:shadow-lg' : '';
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md ${hoverEffect} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

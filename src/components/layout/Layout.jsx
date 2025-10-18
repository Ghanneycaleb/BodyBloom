// import Navbar from "./Navbar";

// const Layout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
//       <Navbar />
//       <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {children}
//       </main>
//       <footer className="bg-primary-700 dark:bg-primary-800 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto transition-colors duration-300">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-200 text-sm">
//           <p>
//             © {new Date().getFullYear()} CG-BodyBloom. Track your progress. Feel
//             your growth.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;

import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} BodyBloom. Track your progress. Feel your growth.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

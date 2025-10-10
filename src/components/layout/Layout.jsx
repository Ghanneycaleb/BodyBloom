import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-primary-700 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-200 text-sm">
          <p>
            © {new Date().getFullYear()} BodyBloom. Track your progress. Feel
            your growth.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

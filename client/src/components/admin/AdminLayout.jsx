import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingBag, FaUsers, FaTags, FaBars, FaTimes, FaArrowLeft } from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: <FaHome /> },
    { name: 'Products', path: '/admin/products', icon: <FaBox /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaShoppingBag /> },
    { name: 'Categories', path: '/admin/categories', icon: <FaTags /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-navy-700 text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-navy-600">
          <Link to="/admin" className="text-xl font-bold flex items-center gap-2">
            <span className="text-orange-500">Urban</span>Kart Admin
          </Link>
          <button onClick={toggleSidebar} className="md:hidden text-gray-300 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-orange-500 text-white font-medium' 
                    : 'text-gray-300 hover:bg-navy-600 hover:text-white'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-navy-600">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-navy-600 hover:text-white rounded-lg transition-colors"
          >
            <FaArrowLeft />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between md:hidden">
          <button 
            onClick={toggleSidebar} 
            className="text-gray-600 hover:text-navy-700 focus:outline-none"
          >
            <FaBars size={24} />
          </button>
          <span className="text-lg font-bold text-navy-800">Admin Panel</span>
          <div className="w-6"></div> {/* Spacer for flex balance */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

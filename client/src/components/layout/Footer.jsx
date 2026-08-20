import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy-800 text-white mt-auto">
      {/* Back to top strip */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-navy-600 hover:bg-navy-700 py-3 text-sm font-medium transition-colors focus:outline-none"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-100">Get to Know Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:underline">About UrbanKart</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
              <li><Link to="/press" className="hover:underline">Press Releases</Link></li>
              <li><Link to="/science" className="hover:underline">UrbanKart Science</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-100">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/account" className="hover:underline">Your Account</Link></li>
              <li><Link to="/orders" className="hover:underline">Your Orders</Link></li>
              <li><Link to="/shipping" className="hover:underline">Shipping Rates & Policies</Link></li>
              <li><Link to="/returns" className="hover:underline">Returns & Replacements</Link></li>
              <li><Link to="/help" className="hover:underline">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-100">Connect with Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-navy-900 py-6 text-center border-t border-navy-700">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-gray-400 mb-2">
          <Link to="/conditions" className="hover:underline">Conditions of Use</Link>
          <Link to="/privacy" className="hover:underline">Privacy Notice</Link>
          <Link to="/interest-based-ads" className="hover:underline">Interest-Based Ads</Link>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()}, UrbanKart.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
};

export default Footer;

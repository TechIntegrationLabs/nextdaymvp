import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img
              src="https://res.cloudinary.com/dvcvxhzmt/image/upload/v1738610817/Heliotrope-removebg-preview_1_ygkqph.png"
              alt="Next Day MVP"
              className="h-8"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href={isHome ? "#pricing" : "/#pricing"} className="text-slate-200 hover:text-custom-blue transition-colors">
              Pricing
            </a>
            <a href={isHome ? "#projects" : "/#projects"} className="text-slate-200 hover:text-custom-blue transition-colors">
              Projects
            </a>
            <a href={isHome ? "#contact" : "/#contact"} className="text-slate-200 hover:text-custom-blue transition-colors">
              Contact
            </a>
            <Link
              to="/blog"
              className="text-slate-200 hover:text-custom-blue transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/ai-tools"
              className="text-slate-200 hover:text-custom-blue transition-colors"
            >
              AI Tools
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
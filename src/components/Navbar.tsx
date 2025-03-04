import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: isHome ? "#pricing" : "/#pricing", text: "Pricing" },
    { href: isHome ? "#services" : "/#services", text: "Services" },
    { href: isHome ? "#process" : "/#process", text: "Process" },
    { href: isHome ? "#contact" : "/#contact", text: "Contact" },
  ];

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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.text}
                href={link.href} 
                className="text-slate-200 hover:text-custom-blue transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-200 hover:text-custom-blue transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-slate-200 hover:text-custom-blue transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
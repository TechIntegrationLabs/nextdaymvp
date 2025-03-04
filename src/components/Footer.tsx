import { Mail, Phone, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Next Day MVP</h3>
            <p className="text-gray-400 mb-4">
              AI-powered app & website development studio delivering high-quality solutions in half the time and cost.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-custom-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-custom-blue transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-custom-blue transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-custom-blue transition-colors">Home</Link>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-custom-blue transition-colors">Services</a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-custom-blue transition-colors">Projects</a>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-custom-blue transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/ai-tools" className="text-gray-400 hover:text-custom-blue transition-colors">AI Tools</Link>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-custom-blue transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-custom-blue transition-colors">
                <a href="#services">AI Integration</a>
              </li>
              <li className="text-gray-400 hover:text-custom-blue transition-colors">
                <a href="#services">Voice-Enabled Apps</a>
              </li>
              <li className="text-gray-400 hover:text-custom-blue transition-colors">
                <a href="#services">Website Development</a>
              </li>
              <li className="text-gray-400 hover:text-custom-blue transition-colors">
                <a href="#services">App Development</a>
              </li>
              <li className="text-gray-400 hover:text-custom-blue transition-colors">
                <a href="#services">Rapid Prototyping</a>
              </li>
              <li className="text-gray-400 hover:text-custom-blue transition-colors">
                <a href="#services">App Modernization</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a href="mailto:techintegrationlabs@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-custom-blue transition-colors">
                <Mail size={16} />
                <span>techintegrationlabs@gmail.com</span>
              </a>
              <a href="tel:+13852583507" className="flex items-center gap-2 text-gray-400 hover:text-custom-blue transition-colors">
                <Phone size={16} />
                <span>(385) 258-3507</span>
              </a>
              <p className="text-gray-400 pt-4">
                Salt Lake City, Utah
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {currentYear} Next Day MVP. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-custom-blue text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-custom-blue text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-custom-blue text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

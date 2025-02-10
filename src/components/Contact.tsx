import { Mail, MessageSquare, Phone } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function Contact() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="min-h-screen py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={`text-3xl md:text-5xl font-bold text-white mb-16 transition-all duration-1000 section-title ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          Get in Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className={`transition-all duration-500 ease-out ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            <h3 className="text-2xl font-semibold mb-6 text-white">
              Let's Build Something Amazing
            </h3>
            <p className="text-slate-200 mb-8">
              Ready to transform your idea into reality? Schedule a free consultation
              with our team to discuss your project.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:techintegrationlabs@gmail.com"
                className="flex items-center gap-3 text-slate-200 hover:text-custom-blue transition-colors"
              >
                <Mail className="w-5 h-5" />
                techintegrationlabs@gmail.com
              </a>
              <a
                href="tel:+13853186435"
                className="flex items-center gap-3 text-slate-200 hover:text-custom-blue transition-colors"
              >
                <Phone className="w-5 h-5" />
                (385) 318-6435
              </a>
              <div className="flex items-center gap-3 text-slate-200">
                <MessageSquare className="w-5 h-5" />
                Available 24/7 for chat
              </div>
            </div>
          </div>

          <form
            className={`space-y-6 transition-all duration-500 ease-out ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-200 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-slate-200 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 text-lg font-medium text-white bg-custom-blue hover:opacity-90 transition-opacity rounded-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
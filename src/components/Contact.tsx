import { Mail, MessageSquare, Phone } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useState, FormEvent, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useMessage } from '../lib/MessageContext';
import { submitContactForm } from '../lib/sheets';

export function Contact() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { message } = useMessage();

  useEffect(() => {
    const messageTextarea = document.getElementById('message') as HTMLTextAreaElement;
    if (messageTextarea && message) {
      messageTextarea.value = message;
      messageTextarea.focus();
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const success = await submitContactForm({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        message: formData.get('message') as string,
        timestamp: new Date().toISOString()
      });

      if (!success) {
        throw new Error('Failed to submit form');
      }

      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="contact" className="min-h-screen py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={cn(
          "text-3xl md:text-5xl font-bold text-white mb-8 text-center transition-all duration-1000",
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        )}>
          Get in Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className={cn(
            "transition-all duration-500 ease-out",
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          )}>
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
            onSubmit={handleSubmit}
            className={cn(
              "space-y-6 transition-all duration-500 ease-out",
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            )}
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
                name="name"
                id="name"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
                disabled={isSubmitting}
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
                name="email"
                id="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
                disabled={isSubmitting}
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
                name="message"
                rows={4}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full px-8 py-3 text-lg font-medium text-white bg-custom-blue rounded-lg transition-all",
                isSubmitting 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:opacity-90 hover:shadow-lg hover:shadow-custom-blue/20"
              )}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
              <p className="text-green-400 text-sm text-center animate-fade-in">
                Message sent successfully! We'll get back to you soon.
              </p>
            )}
            
            {submitStatus === 'error' && (
              <p className="text-red-400 text-sm text-center animate-fade-in">
                There was an error sending your message. Please try again later.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
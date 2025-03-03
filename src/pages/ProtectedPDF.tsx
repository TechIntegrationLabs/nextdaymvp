import { useState } from 'react';

export function ProtectedPDF() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPasscode = '9812';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === correctPasscode) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect passcode');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="passcode" className="block text-sm font-medium text-slate-200 mb-2">
                Enter Passcode
              </label>
              <input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-8 py-3 text-lg font-medium text-white bg-custom-blue rounded-lg hover:bg-blue-600 transition-colors"
            >
              View PDF
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <iframe
        src="/protected.pdf"
        className="w-full h-[calc(100vh-160px)]"
        title="Protected PDF"
      />
    </div>
  );
}

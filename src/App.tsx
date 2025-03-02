import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { AITools } from './pages/AITools';
import { Navbar } from './components/Navbar';
import { ProtectedPDF } from './pages/ProtectedPDF';
import { MessageProvider } from './lib/MessageContext';
import { ScrollIntro } from './components/ScrollIntro';
import TestAnimation from './pages/TestAnimation';
import SplineDemo from './pages/SplineDemo';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    return localStorage.getItem('hasSeenIntro') === 'true';
  });

  // Function to handle intro completion
  const handleIntroComplete = () => {
    // Store in localStorage that user has seen the intro
    localStorage.setItem('hasSeenIntro', 'true');
    setHasSeenIntro(true);
    setShowIntro(false);
    
    // Reset scroll position after intro completes
    window.scrollTo(0, 0);
  };

  // Function to reset intro (for development testing)
  const resetIntro = () => {
    localStorage.removeItem('hasSeenIntro');
    setHasSeenIntro(false);
    setShowIntro(true);
    // Reload the page to reset scroll state
    window.location.reload();
  };

  // Skip intro if user has already seen it, or not on homepage
  useEffect(() => {
    const isHomepage = window.location.pathname === '/';
    if (!isHomepage || hasSeenIntro) {
      setShowIntro(false);
    }
  }, [hasSeenIntro]);

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <MessageProvider>
      {/* Scroll Intro - only shown if showIntro is true */}
      {showIntro && <ScrollIntro onComplete={handleIntroComplete} />}
      
      <div className={`bg-gray-900 transition-colors ${showIntro ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/pdf" element={<ProtectedPDF />} />
          <Route path="/test-animation" element={<TestAnimation />} />
          <Route path="/spline-demo" element={<SplineDemo />} />
        </Routes>

        {/* Dev controls - only shown in development */}
        {isDev && !showIntro && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={resetIntro}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Reset Intro
            </button>
          </div>
        )}
      </div>
    </MessageProvider>
  );
}

export default App;
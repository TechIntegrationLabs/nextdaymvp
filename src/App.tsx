import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { AITools } from './pages/AITools';
import { Navbar } from './components/Navbar';
import { ProtectedPDF } from './pages/ProtectedPDF';
import { MessageProvider } from './lib/MessageContext';
import { ScrollIntro } from './components/ScrollIntro';

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

  // Skip intro if user has already seen it, or not on homepage
  useEffect(() => {
    const isHomepage = window.location.pathname === '/';
    if (!isHomepage || hasSeenIntro) {
      setShowIntro(false);
    }
  }, [hasSeenIntro]);

  return (
    <MessageProvider>
      {/* Scroll Intro - only shown if showIntro is true */}
      {showIntro && <ScrollIntro onComplete={handleIntroComplete} />}
      
      <div className={`bg-gray-900 transition-colors ${showIntro ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/pdf" element={<ProtectedPDF />} />
        </Routes>
      </div>
    </MessageProvider>
  );
}

export default App;
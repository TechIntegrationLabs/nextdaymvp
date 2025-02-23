import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { AITools } from './pages/AITools';
import { Navbar } from './components/Navbar';
import { ProtectedPDF } from './pages/ProtectedPDF';

function App() {
  return (
    <div className="bg-gray-900 transition-colors">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/ai-tools" element={<AITools />} />
        <Route path="/pdf" element={<ProtectedPDF />} />
      </Routes>
    </div>
  );
}

export default App;
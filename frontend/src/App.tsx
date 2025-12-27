import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MergedWelcome from './pages/MergedWelcome';
import CodeEntry from './pages/CodeEntry';
import MermaidEditor from './pages/MermaidEditor';
import Analysis from './pages/Analysis';
import WriteWithAI from './pages/WriteWithAI';
import Instructions from './pages/Instructions';
import { ThemeProvider } from './components/ThemeProvider';

const App: React.FC = () => {
  // Add global keyboard shortcuts for zooming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl++ or Ctrl+= for zoom in (handle both regular = and Shift+=)
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=' || (e.shiftKey && e.key === '='))) {
        e.preventDefault();
        console.log('Zoom in shortcut detected');
        // Dispatch a custom event that components can listen to
        window.dispatchEvent(new CustomEvent('zoomIn'));
      }
      // Ctrl+- for zoom out
      else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        console.log('Zoom out shortcut detected');
        // Dispatch a custom event that components can listen to
        window.dispatchEvent(new CustomEvent('zoomOut'));
      }
      // Ctrl+0 for reset zoom
      else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        console.log('Reset zoom shortcut detected');
        // Dispatch a custom event that components can listen to
        window.dispatchEvent(new CustomEvent('resetZoom'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MergedWelcome />} />
          <Route path="/welcome" element={<MergedWelcome />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/code-entry" element={<CodeEntry />} />
          <Route path="/mermaid-editor" element={<MermaidEditor />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/write-with-ai" element={<WriteWithAI />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
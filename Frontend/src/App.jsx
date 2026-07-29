import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Prompts from './components/Prompts';
import Battel from './pages/battel';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Main Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/battel" element={<Battel />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/prompts" element={<Prompts />} />
        
        {/* Catch-all fallback redirects to /home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Aichat from './AiChat/Aichat';
import HeroSection from './AiChat/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/aichat" element={<Aichat />} />
      </Routes>
    </Router>
  );
};

export default App;

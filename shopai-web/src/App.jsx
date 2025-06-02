import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GeneratePage from './pages/GeneratePage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GeneratePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MoodPlaylistGenerator from './MoodPlaylistGenerator';
import CallbackPage from './CallbackPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MoodPlaylistGenerator />} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
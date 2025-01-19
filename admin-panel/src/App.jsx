import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Sayfalar
import LoginPage from './pages/LoginPage';
import MediaPage from './pages/MediaPage';
import PlaylistPage from './pages/PlaylistsPage';
import ScreenPage from './pages/ScreensPage';
import AssignmentPage from './pages/AssignmentPage';
import PreviewPage from './pages/PreviewPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/playlists" element={<PlaylistPage />} />
        <Route path="/screens" element={<ScreenPage />} />
        <Route path="/assign" element={<AssignmentPage />} />
        <Route path="/preview/:screenId" element={<PreviewPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Sayfalar
import LoginPage from './pages/LoginPage';
import MediaPage from './pages/MediaPage';
import PlaylistPage from './pages/PlaylistsPage';
import ScreenPage from './pages/ScreensPage';
import AssignmentPage from './pages/AssignmentPage';
import PreviewPage from './pages/PreviewPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header /> 
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <MediaPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/preview" element={
            <ProtectedRoute>
              <Layout>
                <PreviewPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/assignment" element={
            <ProtectedRoute>
              <Layout>
                <AssignmentPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/playlists" element={<PlaylistPage />} />
          <Route path="/screens" element={<ScreenPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

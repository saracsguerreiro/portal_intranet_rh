import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import News, { NewsDetail } from './pages/News';
import Events from './pages/Events';
import Documents from './pages/Documents';
import SocialWall from './pages/SocialWall';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/portal_intranet_rh">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="noticias" element={<News />} />
            <Route path="noticias/:id" element={<NewsDetail />} />
            <Route path="eventos" element={<Events />} />
            <Route path="documentos" element={<Documents />} />
            <Route path="mural" element={<SocialWall />} />
            <Route path="perfil" element={<Profile />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute requireManager>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

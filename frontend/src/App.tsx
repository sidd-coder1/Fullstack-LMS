import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Labs from './pages/Labs';
import LabDetail from './pages/LabDetail';
import PCs from './pages/PCs';
import Equipment from './pages/Equipment';
import Software from './pages/Software';
import Maintenance from './pages/Maintenance';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/pcs"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PCs />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/equipment"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Equipment />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/software"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Software />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Maintenance />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Inventory />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/labs"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Labs />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/labs/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <LabDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

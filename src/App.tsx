import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute';
import Upload from './components/upload/Upload';
import Results from './components/results/Results';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AllAgreements from './components/agreements/AllAgreements';
import AgreementDetails from './components/agreements/AgreementDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/agreements" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agreements" 
            element={
              <ProtectedRoute>
                <AllAgreements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agreements/:id" 
            element={
              <ProtectedRoute>
                <AgreementDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
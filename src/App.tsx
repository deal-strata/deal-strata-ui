import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import {
  AllAgreements,
  AgreementDetails,
  EditAgreement,
} from './components/agreements';
import {
  WaterfallDetails,
} from './components/waterfall';
import {

  CalculationDetails,
  CreateCalculation
} from './components/calculations'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router basename="/deal-strata-ui">
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
            path="/agreements/:id/edit"
            element={
              <ProtectedRoute>
                <EditAgreement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agreements/:id/waterfalls/:waterfallId"
            element={
              <ProtectedRoute>
                <WaterfallDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agreements/:id/calculations/:calculationId"
            element={
              <ProtectedRoute>
                <CalculationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agreements/:id/calculations/new"
            element={
              <ProtectedRoute>
                <CreateCalculation />
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
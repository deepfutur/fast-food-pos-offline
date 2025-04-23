
import React from 'react';
import { POSProvider } from '../context/POSContext';
import LoginScreen from '../components/Auth/LoginScreen';
import POS from './POS';
import AdminDashboard from './Admin/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import { usePOS } from '../context/POSContext';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'admin' | 'cashier';
}> = ({ children, requiredRole }) => {
  const { state } = usePOS();
  const { currentUser } = state;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole === 'admin' && currentUser.role !== 'admin') {
    return <Navigate to="/pos" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  const { state } = usePOS();
  const { currentUser } = state;
  
  if (!currentUser) {
    return <LoginScreen />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pos" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route 
        path="/pos" 
        element={
          <ProtectedRoute>
            <POS />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/pos" replace />} />
    </Routes>
  );
};

const Index: React.FC = () => {
  return (
    <POSProvider>
      <AppRouter />
    </POSProvider>
  );
};

export default Index;

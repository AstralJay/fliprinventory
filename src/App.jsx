import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import StaffDashboard from './pages/StaffDashboard.jsx';
import AdminStaffManagement from './pages/AdminStaffManagement.jsx';

function PrivateRoute({ children, requiredRole }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
      .from('profiles') // ✅ correct table
      .select('role')
      .eq('id', user.id)
      .single();
      if (error || !data) {
        setUserRole(null);
      } else {
        setUserRole(data.role);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (!userRole) return <Navigate to="/login" />;
  
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on role
    if (userRole === 'admin') return <Navigate to="/dashboard" />;
    if (userRole === 'staff') return <Navigate to="/staff-dashboard" />;
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute requiredRole="admin">
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/staff-dashboard" element={
          <PrivateRoute requiredRole="staff">
            <StaffDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/staff-management" element={
          <PrivateRoute requiredRole="admin">
            <AdminStaffManagement />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import "./Login.css";
import logo from "../assets/logo.png";

export default function Login() {
  const [activeTab, setActiveTab] = useState('admin');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [staffId, setStaffId] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      if (profileError || !profile || profile.role !== 'admin') {
        setError('Access denied: Only admins can log in.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      navigate('/dashboard');
    } catch (error) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('staff_id', staffId)
        .single();

      if (staffError || !staffData) {
        setError('Invalid Staff ID.');
        setLoading(false);
        return;
      }

      if (staffPassword !== staffData.password) {
        setError('Invalid password.');
        setLoading(false);
        return;
      }

      localStorage.setItem('staff_session', JSON.stringify({
        id: staffData.id,
        staff_id: staffData.staff_id,
        first_name: staffData.first_name,
        last_name: staffData.last_name,
        role: 'staff'
      }));

      navigate('/staff-dashboard');
    } catch (error) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-header">
          <img src={logo} alt="Logo" />
          <h2 className="login-title">Inventory Portal</h2>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 className="login-subtitle">Sign in to manage inventory</h3>
        </div>
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab admin${activeTab === 'admin' ? ' active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Login
          </button>
          <button
            type="button"
            className={`login-tab staff${activeTab === 'staff' ? ' active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            Staff Login
          </button>
        </div>
        {activeTab === 'admin' ? (
          <form className="login-form" onSubmit={handleAdminLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && <div className="login-error">{error}</div>}
          </form>
        ) : (
          <form className="login-form" onSubmit={handleStaffLogin}>
            <label>Staff ID</label>
            <input
              type="text"
              placeholder="Enter your Staff ID"
              value={staffId}
              onChange={e => setStaffId(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={staffPassword}
              onChange={e => setStaffPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && <div className="login-error">{error}</div>}
          </form>
        )}
        <div className="login-hint">
          {activeTab === 'admin'
            ? 'Use your admin email and password to access management features.'
            : 'Use your Staff ID and password to view inventory.'}
        </div>
      </div>
    </div>
  );
}

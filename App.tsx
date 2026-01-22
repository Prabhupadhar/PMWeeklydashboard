
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardListPage from './pages/DashboardListPage';
import DashboardEditorPage from './pages/DashboardEditorPage';
import { User, DashboardData } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dashboards, setDashboards] = useState<DashboardData[]>([]);

  // Load dashboards from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('pm_user');
    const savedDashboards = localStorage.getItem('pm_dashboards');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedDashboards) setDashboards(JSON.parse(savedDashboards));
  }, []);

  // Persist dashboards
  useEffect(() => {
    if (dashboards.length > 0) {
      localStorage.setItem('pm_dashboards', JSON.stringify(dashboards));
    }
  }, [dashboards]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('pm_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pm_user');
  };

  const saveDashboard = (dashboard: DashboardData) => {
    setDashboards(prev => {
      const exists = prev.find(d => d.id === dashboard.id);
      if (exists) {
        return prev.map(d => d.id === dashboard.id ? dashboard : d);
      }
      return [...prev, dashboard];
    });
  };

  const deleteDashboard = (id: string) => {
    setDashboards(prev => prev.filter(d => d.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? <DashboardListPage user={user} dashboards={dashboards} onLogout={handleLogout} onDelete={deleteDashboard} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/editor/:id?" 
          element={user ? <DashboardEditorPage dashboards={dashboards} onSave={saveDashboard} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;

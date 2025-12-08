import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Users from './pages/Users';

function AppContent() {
  const { user, logout, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1>🏀 Quản Lý Bóng Rổ</h1>
          </div>
          
          {user && (
            <div className="navbar-links">
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                🏠 Trang chủ
              </NavLink>
              <NavLink to="/teams" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                🏆 Đội bóng
              </NavLink>
              <NavLink to="/players" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                👥 Cầu thủ
              </NavLink>
              <NavLink to="/matches" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                📅 Lịch thi đấu
              </NavLink>
              {isAdmin() && (
                <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  👤 Users
                </NavLink>
              )}
            </div>
          )}

          <div className="navbar-user">
            {user ? (
              <div className="user-dropdown">
                <button 
                  className="user-button" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">
                    {user.role === 'admin' ? '👑' : '👤'}
                  </span>
                  <span className="user-name">{user.username}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showUserMenu && (
                  <div className="user-menu">
                    <NavLink to="/profile" className="menu-item" onClick={() => setShowUserMenu(false)}>
                      ⚙️ Hồ sơ
                    </NavLink>
                    <button className="menu-item logout" onClick={() => { logout(); setShowUserMenu(false); }}>
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <NavLink to="/login" className="btn-login">
                  Đăng nhập
                </NavLink>
                <NavLink to="/register" className="btn-register">
                  Đăng ký
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
          
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
          <Route path="/players" element={<PrivateRoute><Players /></PrivateRoute>} />
          <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

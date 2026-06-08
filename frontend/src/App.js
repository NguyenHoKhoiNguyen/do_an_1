import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Statistics from './pages/Statistics';
import News from './pages/News';
import Standings from './pages/Standings';
import Export from './pages/Export';
import Chat from './pages/Chat';
import Formation from './pages/Formation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Users from './pages/Users';

function AppContent() {
  const { user, logout, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { to: '/', icon: '🏠', label: 'Trang chủ', end: true },
    { to: '/teams', icon: '🏆', label: 'Đội bóng' },
    { to: '/players', icon: '👥', label: 'Cầu thủ' },
    { to: '/matches', icon: '📅', label: 'Lịch thi đấu' },
    { to: '/statistics', icon: '📊', label: 'Thống kê' },
    { to: '/standings', icon: '⭐', label: 'Xếp hạng' },
    { to: '/news', icon: '📰', label: 'Tin tức' },
    { to: '/export', icon: '📥', label: 'Xuất dữ liệu' },
    { to: '/chat', icon: '🤖', label: 'AI Trợ Lý' },
  ];

  if (isAdmin()) {
    navItems.push({ to: '/users', icon: '👤', label: 'Users' });
  }

  const routes = (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
      <Route path="/players" element={<PrivateRoute><Players /></PrivateRoute>} />
      <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
      <Route path="/statistics" element={<PrivateRoute><Statistics /></PrivateRoute>} />
      <Route path="/standings" element={<PrivateRoute><Standings /></PrivateRoute>} />
      <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
      <Route path="/export" element={<PrivateRoute><Export /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/formation/:teamId" element={<PrivateRoute><Formation /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
    </Routes>
  );

  if (!user) {
    return (
      <div className="App public-app">
        <nav className="auth-navbar">
          <NavLink to="/" className="auth-brand">🏀 Quản Lý Bóng Rổ</NavLink>
          <div className="auth-buttons">
            <NavLink to="/login" className="btn-login">Đăng nhập</NavLink>
            <NavLink to="/register" className="btn-register">Đăng ký</NavLink>
          </div>
        </nav>
        <main className="public-content">
          {routes}
        </main>
      </div>
    );
  }

  return (
    <div className={`App app-shell ${showMobileMenu ? 'sidebar-open' : ''}`}>
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Mở menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">🏀</div>
          <div>
            <h1>Quản Lý Bóng Rổ</h1>
            <p>Basketball Admin</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="user-avatar">
              {user.role === 'admin' ? '👑' : '👤'}
            </span>
            <span className="user-name">{user.username}</span>
            <span className="dropdown-arrow">▾</span>
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <NavLink to="/profile" className="menu-item" onClick={() => setShowUserMenu(false)}>
                ⚙️ Hồ sơ
              </NavLink>
              <button className="menu-item logout" onClick={() => { logout(); setShowUserMenu(false); }}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="sidebar-backdrop" onClick={() => setShowMobileMenu(false)}></div>

      <main className="app-main">
        <div className="container">
          {routes}
        </div>
      </main>
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

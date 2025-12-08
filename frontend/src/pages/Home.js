import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamsAPI, playersAPI, matchesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalPlayers: 0,
    totalMatches: 0,
    upcomingMatches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [teamsRes, playersRes, matchesRes, upcomingRes] = await Promise.all([
        teamsAPI.getAll(),
        playersAPI.getAll(),
        matchesAPI.getAll(),
        matchesAPI.getUpcoming(),
      ]);

      setStats({
        totalTeams: teamsRes.data.length,
        totalPlayers: playersRes.data.length,
        totalMatches: matchesRes.data.length,
        upcomingMatches: upcomingRes.data.length,
      });

      setUpcomingMatches(upcomingRes.data.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">🏀 Chào mừng đến với Hệ thống Quản lý Bóng rổ</h1>
            <p className="hero-subtitle">
              Nền tảng quản lý chuyên nghiệp cho các đội bóng, cầu thủ và lịch thi đấu
            </p>
            <div className="hero-user-info">
              <span className="welcome-text">
                Xin chào, <strong>{user?.fullName || user?.username}</strong>!
              </span>
              {isAdmin() && (
                <span className="admin-badge">
                  👑 Quản trị viên
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="stats-section">
        <div className="stats-grid">
          <Link to="/teams" className="stat-card stat-teams">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{stats.totalTeams}</h3>
              <p>Đội bóng</p>
            </div>
          </Link>
          
          <Link to="/players" className="stat-card stat-players">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalPlayers}</h3>
              <p>Cầu thủ</p>
            </div>
          </Link>
          
          <Link to="/matches" className="stat-card stat-matches">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{stats.totalMatches}</h3>
              <p>Trận đấu</p>
            </div>
          </Link>
          
          <div className="stat-card stat-upcoming">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <h3>{stats.upcomingMatches}</h3>
              <p>Sắp diễn ra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="matches-section">
        <div className="section-header">
          <h2>📅 Lịch thi đấu sắp tới</h2>
          <Link to="/matches" className="view-all-link">
            Xem tất cả →
          </Link>
        </div>

        {upcomingMatches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>Không có trận đấu nào sắp diễn ra</p>
          </div>
        ) : (
          <div className="matches-grid">
            {upcomingMatches.map((match) => (
              <div key={match._id} className="match-card">
                <div className="match-date">
                  {new Date(match.matchDate).toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
                <div className="match-teams">
                  <div className="team home-team">
                    <span className="team-name">{match.homeTeam.name}</span>
                  </div>
                  <div className="match-vs">VS</div>
                  <div className="team away-team">
                    <span className="team-name">{match.awayTeam.name}</span>
                  </div>
                </div>
                <div className="match-location">
                  📍 {match.location}
                </div>
                <div className="match-status">
                  <span className={`status-badge ${match.status.toLowerCase()}`}>
                    {match.status === 'Scheduled' ? 'Đã lên lịch' : 
                     match.status === 'Live' ? 'Đang diễn ra' : match.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <div className="section-header">
          <h2>⚡ Thao tác nhanh</h2>
        </div>
        <div className="actions-grid">
          <Link to="/teams" className="action-card">
            <div className="action-icon">🏆</div>
            <h3>Quản lý Đội bóng</h3>
            <p>Xem và quản lý thông tin các đội bóng</p>
          </Link>
          
          <Link to="/players" className="action-card">
            <div className="action-icon">👥</div>
            <h3>Quản lý Cầu thủ</h3>
            <p>Xem và quản lý hồ sơ cầu thủ</p>
          </Link>
          
          <Link to="/matches" className="action-card">
            <div className="action-icon">📅</div>
            <h3>Lịch thi đấu</h3>
            <p>Xem lịch và quản lý trận đấu</p>
          </Link>
          
          {isAdmin() && (
            <Link to="/users" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Quản lý Users</h3>
              <p>Quản lý người dùng hệ thống</p>
            </Link>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <section className="info-section">
        <div className="info-card">
          <h3>📚 Về dự án</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Sinh viên:</strong>
              <span>Nguyễn Hồ Khôi Nguyên</span>
            </div>
            <div className="info-item">
              <strong>MSSV:</strong>
              <span>4551190039</span>
            </div>
            <div className="info-item">
              <strong>Lớp:</strong>
              <span>Kỹ thuật phần mềm K45</span>
            </div>
            <div className="info-item">
              <strong>Giảng viên:</strong>
              <span>Đoàn Thị Thu Cúc</span>
            </div>
            <div className="info-item">
              <strong>Công nghệ:</strong>
              <span>MERN Stack (MongoDB, Express.js, React.js, Node.js)</span>
            </div>
            <div className="info-item">
              <strong>Giấy phép:</strong>
              <span>MIT License (Open Source)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

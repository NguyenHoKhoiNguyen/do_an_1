import React, { useState, useEffect } from 'react';
import { matchesAPI, teamsAPI, playersAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Statistics() {
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('week');
  const [matchStats, setMatchStats] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const [matchStatsRes, teamsRes, playersRes] = await Promise.all([
        matchesAPI.getStats({ period: timePeriod }),
        teamsAPI.getAll(),
        playersAPI.getAll(),
      ]);
      setMatchStats(matchStatsRes.data);
      setTeams(teamsRes.data);
      setPlayers(playersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePeriod]);

  const getTimePeriodText = () => {
    switch (timePeriod) {
      case 'day': return 'Hôm nay';
      case 'week': return 'Tuần này';
      case 'month': return 'Tháng này';
      default: return 'Tuần này';
    }
  };

  // Prepare data for charts
  const matchStatusData = matchStats ? [
    { name: 'Đã lên lịch', value: matchStats.scheduled, color: '#3498db' },
    { name: 'Đang diễn ra', value: matchStats.live, color: '#27ae60' },
    { name: 'Đã kết thúc', value: matchStats.finished, color: '#95a5a6' },
    { name: 'Đã hủy', value: matchStats.cancelled, color: '#e74c3c' },
  ] : [];

  // Top teams by wins
  const topTeamsData = teams
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 5)
    .map(team => ({
      name: team.name.length > 15 ? team.name.substring(0, 15) + '...' : team.name,
      wins: team.wins,
      losses: team.losses,
    }));

  // Win rate data for all teams
  const teamWinRateData = teams.map(team => {
    const totalGames = team.wins + team.losses;
    const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(1) : 0;
    return {
      name: team.name.length > 12 ? team.name.substring(0, 12) + '...' : team.name,
      winRate: parseFloat(winRate),
    };
  }).sort((a, b) => b.winRate - a.winRate).slice(0, 8);

  // Players distribution by position
  const positionData = [
    { name: 'Point Guard', value: players.filter(p => p.position === 'Point Guard').length, color: '#667eea' },
    { name: 'Shooting Guard', value: players.filter(p => p.position === 'Shooting Guard').length, color: '#764ba2' },
    { name: 'Small Forward', value: players.filter(p => p.position === 'Small Forward').length, color: '#f093fb' },
    { name: 'Power Forward', value: players.filter(p => p.position === 'Power Forward').length, color: '#4facfe' },
    { name: 'Center', value: players.filter(p => p.position === 'Center').length, color: '#43e97b' },
  ];

  if (loading) {
    return <div className="loading">Đang tải dữ liệu thống kê...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ marginBottom: '5px' }}>📊 Thống kê & Báo cáo</h2>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: 0 }}>
              Tổng quan về trận đấu, đội bóng và cầu thủ
            </p>
          </div>
          <div>
            <label style={{ marginRight: '10px', fontSize: '0.9rem', color: '#7f8c8d' }}>Khoảng thời gian:</label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              style={{ 
                padding: '10px 15px', 
                borderRadius: '8px', 
                border: '2px solid #e0e0e0',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                background: 'white',
              }}
            >
              <option value="day">📅 Hôm nay</option>
              <option value="week">📆 Tuần này</option>
              <option value="month">🗓️ Tháng này</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          textAlign: 'center',
          padding: '30px 20px',
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
            {matchStats?.totalMatches || 0}
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.95 }}>Tổng số trận ({getTimePeriodText()})</div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white',
          textAlign: 'center',
          padding: '30px 20px',
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
            {teams.length}
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.95 }}>Tổng số đội</div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          color: 'white',
          textAlign: 'center',
          padding: '30px 20px',
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
            {players.length}
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.95 }}>Tổng số cầu thủ</div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
          color: 'white',
          textAlign: 'center',
          padding: '30px 20px',
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
            {matchStats?.live || 0}
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.95 }}>Trận đang diễn ra</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Match Status Pie Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>🎯 Phân bổ Trận đấu ({getTimePeriodText()})</h3>
          {matchStats && matchStats.totalMatches > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={matchStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {matchStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
              <p>Không có dữ liệu trận đấu trong {getTimePeriodText().toLowerCase()}</p>
            </div>
          )}
        </div>

        {/* Top Teams Bar Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>🏆 Top 5 Đội Bóng Hàng Đầu</h3>
          {topTeamsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTeamsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" fill="#27ae60" name="Thắng" />
                <Bar dataKey="losses" fill="#e74c3c" name="Thua" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
              <p>Chưa có dữ liệu đội bóng</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Team Win Rate Line Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>📈 Tỷ lệ Thắng của Đội</h3>
          {teamWinRateData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={teamWinRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="winRate" stroke="#667eea" strokeWidth={3} name="Tỷ lệ thắng (%)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
              <p>Chưa có dữ liệu thống kê</p>
            </div>
          )}
        </div>

        {/* Players Position Distribution Pie Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>👥 Phân bổ Cầu thủ theo Vị trí</h3>
          {players.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {positionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
              <p>Chưa có dữ liệu cầu thủ</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>📋 Chi tiết Thống kê Đội bóng</h3>
        {teams.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Đội</th>
                  <th>Thành phố</th>
                  <th>HLV</th>
                  <th>Thắng</th>
                  <th>Thua</th>
                  <th>Tổng trận</th>
                  <th>Tỷ lệ thắng</th>
                </tr>
              </thead>
              <tbody>
                {teams
                  .sort((a, b) => {
                    const winRateA = (a.wins / (a.wins + a.losses)) || 0;
                    const winRateB = (b.wins / (b.wins + b.losses)) || 0;
                    return winRateB - winRateA;
                  })
                  .map((team, index) => {
                    const totalGames = team.wins + team.losses;
                    const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(1) : '0';
                    return (
                      <tr key={team._id}>
                        <td>
                          <strong>
                            {index < 3 && <span style={{ marginRight: '5px' }}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>}
                            {team.name}
                          </strong>
                        </td>
                        <td>{team.city}</td>
                        <td>{team.coach}</td>
                        <td style={{ color: '#27ae60', fontWeight: 'bold' }}>{team.wins}</td>
                        <td style={{ color: '#e74c3c', fontWeight: 'bold' }}>{team.losses}</td>
                        <td>{totalGames}</td>
                        <td>
                          <span style={{
                            padding: '5px 10px',
                            borderRadius: '5px',
                            background: parseFloat(winRate) >= 50 ? '#d4edda' : '#f8d7da',
                            color: parseFloat(winRate) >= 50 ? '#155724' : '#721c24',
                            fontWeight: 'bold',
                          }}>
                            {winRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>Chưa có dữ liệu đội bóng</p>
        )}
      </div>
    </div>
  );
}

export default Statistics;

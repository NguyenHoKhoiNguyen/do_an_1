import React, { useEffect, useMemo, useState } from 'react';
import { standingsAPI } from '../services/api';
import './Standings.css';

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await standingsAPI.getStandings();
      setStandings(response.data.standings || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Lỗi khi tải bảng xếp hạng: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const totalTeams = standings.length;
    const totalGames = standings.reduce((sum, team) => sum + team.totalGames, 0);
    const averageWinRate = totalTeams
      ? standings.reduce((sum, team) => sum + Number(team.winRate || 0), 0) / totalTeams
      : 0;

    return {
      totalTeams,
      totalGames,
      averageWinRate: averageWinRate.toFixed(1),
      leader: standings[0],
    };
  }, [standings]);

  const getRankLabel = (rank) => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `#${rank}`;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏀';
  };

  const getWinRateTone = (winRate) => {
    if (winRate >= 60) return 'excellent';
    if (winRate >= 45) return 'good';
    return 'low';
  };

  return (
    <div className="standings-container">
      <section className="standings-hero">
        <div className="standings-hero-copy">
          <span className="standings-eyebrow">League Dashboard</span>
          <h1>Bảng Xếp Hạng Động</h1>
          <p>Theo dõi thứ hạng, tỷ lệ thắng và phong độ tổng quan của các đội bóng trong hệ thống.</p>
        </div>

        <button className="btn-refresh" onClick={fetchStandings} disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="standings-state">Đang tải dữ liệu bảng xếp hạng...</div>
      ) : standings.length === 0 ? (
        <div className="standings-state">Chưa có dữ liệu xếp hạng</div>
      ) : (
        <>
          <section className="standings-summary-grid">
            <div className="standing-summary-card leader">
              <span className="summary-label">Dẫn đầu</span>
              <strong>{summary.leader?.name || '-'}</strong>
              <span>{summary.leader?.winRate || 0}% tỷ lệ thắng</span>
            </div>
            <div className="standing-summary-card">
              <span className="summary-label">Số đội</span>
              <strong>{summary.totalTeams}</strong>
              <span>đội đang tham gia</span>
            </div>
            <div className="standing-summary-card">
              <span className="summary-label">Tổng trận</span>
              <strong>{summary.totalGames}</strong>
              <span>lượt trận đã ghi nhận</span>
            </div>
            <div className="standing-summary-card">
              <span className="summary-label">Tỷ lệ TB</span>
              <strong>{summary.averageWinRate}%</strong>
              <span>trên toàn giải đấu</span>
            </div>
          </section>

          <section className="standings-board">
            <div className="standings-board-header">
              <div>
                <h2>Bảng thành tích đội bóng</h2>
                <p>
                  {lastUpdated
                    ? `Cập nhật lúc ${lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Dữ liệu mới nhất từ hệ thống'}
                </p>
              </div>
            </div>

            <div className="standings-table-container">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th className="rank-col">Hạng</th>
                    <th className="team-col">Đội bóng</th>
                    <th className="coach-col">HLV</th>
                    <th className="record-col">Thắng</th>
                    <th className="record-col">Thua</th>
                    <th className="total-col">Tổng</th>
                    <th className="winrate-col">Tỷ lệ thắng</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team) => (
                    <tr key={team._id} className={`rank-${team.rank}`}>
                      <td className="rank-cell">
                        <span className={`rank-badge rank-badge-${team.rank <= 3 ? team.rank : 'default'}`}>
                          <span className="rank-icon">{getRankIcon(team.rank)}</span>
                          <span>{getRankLabel(team.rank)}</span>
                        </span>
                      </td>
                      <td className="team-cell">
                        <strong>{team.name}</strong>
                        <span>{team.city}</span>
                      </td>
                      <td className="coach-cell">{team.coach}</td>
                      <td className="record wins">{team.wins}</td>
                      <td className="record losses">{team.losses}</td>
                      <td className="record total">{team.totalGames}</td>
                      <td className="winrate">
                        <div className={`winrate-bar ${getWinRateTone(team.winRate)}`}>
                          <div
                            className="winrate-fill"
                            style={{ width: `${Math.max(8, Math.min(100, team.winRate))}%` }}
                          ></div>
                          <span className="winrate-text">{team.winRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

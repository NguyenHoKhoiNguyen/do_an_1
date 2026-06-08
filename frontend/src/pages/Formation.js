import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FieldView from '../components/FieldView';
import { playersAPI, teamsAPI } from '../services/api';
import '../styles/Formation.css';

export default function Formation() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team details
        const teamRes = await teamsAPI.getById(teamId);
        setTeam(teamRes.data);

        // Fetch players for this team
        const playersRes = await playersAPI.getByTeam(teamId);
        const teamPlayers = playersRes.data;
        setPlayers(Array.isArray(teamPlayers) ? teamPlayers : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Có lỗi khi tải dữ liệu');
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="formation-container">
        <div className="loading">Đang tải đội hình...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="formation-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/teams')} className="back-btn">
          ← Quay lại
        </button>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="formation-container">
        <div className="error">Không tìm thấy đội bóng</div>
        <button onClick={() => navigate('/teams')} className="back-btn">
          ← Quay lại
        </button>
      </div>
    );
  }

  // Sort players by position for better display
  const positionOrder = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];
  const sortedPlayers = [...players].sort((a, b) => {
    const aIndex = positionOrder.indexOf(a.position || '');
    const bIndex = positionOrder.indexOf(b.position || '');
    return aIndex - bIndex;
  });

  return (
    <div className="formation-container">
      <div className="formation-header">
        <button onClick={() => navigate('/teams')} className="back-btn">
          ← Quay lại
        </button>
        <h1>🏀 Đội Hình - {team.name}</h1>
        <div className="team-info">
          <span>HLV: {team.coach}</span>
          <span>Thành phố: {team.city}</span>
        </div>
      </div>

      <div className="formation-content">
        <div className="field-section">
          <h2>Sân Bóng</h2>
          <FieldView players={sortedPlayers} team={team} />
        </div>

        <div className="players-list">
          <h2>Danh Sách Cầu Thủ ({sortedPlayers.length})</h2>
          {sortedPlayers.length > 0 ? (
            <div className="players-grid">
              {sortedPlayers.map((player) => (
                <div key={player._id} className="player-card">
                  <div className="player-number">{player.jerseyNumber}</div>
                  <div className="player-info">
                    <h4>{player.name}</h4>
                    <div className="position-badge">{player.position}</div>
                    <div className="player-stats">
                      <span>📊 {player.stats?.points || 0} pts</span>
                      <span>🎯 {player.stats?.assists || 0} ast</span>
                      <span>🔄 {player.stats?.rebounds || 0} reb</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-players">
              <p>Đội này chưa có cầu thủ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { playersAPI, teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Players() {
  const { isAdmin } = useAuth();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    jerseyNumber: '',
    position: 'Point Guard',
    team: '',
    height: '',
    weight: '',
    dateOfBirth: '',
    nationality: 'Vietnam',
  });

  const positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playersRes, teamsRes] = await Promise.all([
        playersAPI.getAll(),
        teamsAPI.getAll(),
      ]);
      setPlayers(playersRes.data);
      setTeams(teamsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlayer) {
        await playersAPI.update(editingPlayer._id, formData);
      } else {
        await playersAPI.create(formData);
      }
      setShowModal(false);
      setEditingPlayer(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving player:', error);
      alert('Có lỗi xảy ra khi lưu cầu thủ');
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      jerseyNumber: player.jerseyNumber,
      position: player.position,
      team: player.team._id,
      height: player.height,
      weight: player.weight,
      dateOfBirth: player.dateOfBirth.split('T')[0],
      nationality: player.nationality,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')) {
      try {
        await playersAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('Có lỗi xảy ra khi xóa cầu thủ');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      jerseyNumber: '',
      position: 'Point Guard',
      team: '',
      height: '',
      weight: '',
      dateOfBirth: '',
      nationality: 'Vietnam',
    });
  };

  const openAddModal = () => {
    setEditingPlayer(null);
    resetForm();
    setShowModal(true);
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    return team ? team.name : 'N/A';
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản lý Cầu thủ</h2>
          {isAdmin() && (
            <button className="btn btn-primary" onClick={openAddModal}>
              + Thêm cầu thủ
            </button>
          )}
        </div>
      </div>

      {players.length === 0 ? (
        <div className="card">
          <p>Chưa có cầu thủ nào. Hãy thêm cầu thủ đầu tiên!</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Số áo</th>
                <th>Tên</th>
                <th>Vị trí</th>
                <th>Đội</th>
                <th>Chiều cao (cm)</th>
                <th>Cân nặng (kg)</th>
                <th>Quốc tịch</th>
                {isAdmin() && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player._id}>
                  <td><strong>#{player.jerseyNumber}</strong></td>
                  <td>{player.name}</td>
                  <td>{player.position}</td>
                  <td>{player.team?.name || 'N/A'}</td>
                  <td>{player.height}</td>
                  <td>{player.weight}</td>
                  <td>{player.nationality}</td>
                  {isAdmin() && (
                    <td>
                      <button className="btn btn-primary" onClick={() => handleEdit(player)} style={{ marginRight: '5px' }}>
                        Sửa
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(player._id)}>
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPlayer ? 'Sửa cầu thủ' : 'Thêm cầu thủ mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên cầu thủ *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số áo *</label>
                <input
                  type="number"
                  name="jerseyNumber"
                  value={formData.jerseyNumber}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="99"
                />
              </div>
              <div className="form-group">
                <label>Vị trí *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Đội bóng *</label>
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn đội --</option>
                  {teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Chiều cao (cm) *</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                  min="150"
                  max="250"
                />
              </div>
              <div className="form-group">
                <label>Cân nặng (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  min="50"
                  max="150"
                />
              </div>
              <div className="form-group">
                <label>Ngày sinh *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quốc tịch</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <button type="submit" className="btn btn-success">
                  {editingPlayer ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Players;

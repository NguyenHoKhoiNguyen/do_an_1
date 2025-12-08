import React, { useState, useEffect } from 'react';
import { matchesAPI, teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Matches() {
  const { isAdmin } = useAuth();
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    homeScore: 0,
    awayScore: 0,
    matchDate: '',
    location: '',
    status: 'Scheduled',
    quarter: 1,
    notes: '',
  });

  const statuses = ['Scheduled', 'Live', 'Finished', 'Cancelled'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesRes, teamsRes] = await Promise.all([
        matchesAPI.getAll(),
        teamsAPI.getAll(),
      ]);
      setMatches(matchesRes.data);
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
    
    if (formData.homeTeam === formData.awayTeam) {
      alert('Đội nhà và đội khách không thể giống nhau!');
      return;
    }

    try {
      if (editingMatch) {
        await matchesAPI.update(editingMatch._id, formData);
      } else {
        await matchesAPI.create(formData);
      }
      setShowModal(false);
      setEditingMatch(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving match:', error);
      alert('Có lỗi xảy ra khi lưu trận đấu');
    }
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      homeTeam: match.homeTeam._id,
      awayTeam: match.awayTeam._id,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      matchDate: match.matchDate.split('T')[0],
      location: match.location,
      status: match.status,
      quarter: match.quarter,
      notes: match.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trận đấu này?')) {
      try {
        await matchesAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting match:', error);
        alert('Có lỗi xảy ra khi xóa trận đấu');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      homeTeam: '',
      awayTeam: '',
      homeScore: 0,
      awayScore: 0,
      matchDate: '',
      location: '',
      status: 'Scheduled',
      quarter: 1,
      notes: '',
    });
  };

  const openAddModal = () => {
    setEditingMatch(null);
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return '#3498db';
      case 'Live':
        return '#27ae60';
      case 'Finished':
        return '#95a5a6';
      case 'Cancelled':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'Đã lên lịch';
      case 'Live':
        return 'Đang diễn ra';
      case 'Finished':
        return 'Đã kết thúc';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Lịch thi đấu</h2>
          {isAdmin() && (
            <button className="btn btn-primary" onClick={openAddModal}>
              + Thêm trận đấu
            </button>
          )}
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="card">
          <p>Chưa có trận đấu nào. Hãy thêm trận đấu đầu tiên!</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Đội nhà</th>
                <th>Tỷ số</th>
                <th>Đội khách</th>
                <th>Địa điểm</th>
                <th>Trạng thái</th>
                {isAdmin() && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id}>
                  <td>{new Date(match.matchDate).toLocaleDateString('vi-VN')}</td>
                  <td><strong>{match.homeTeam?.name || 'N/A'}</strong></td>
                  <td style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {match.homeScore} - {match.awayScore}
                  </td>
                  <td><strong>{match.awayTeam?.name || 'N/A'}</strong></td>
                  <td>{match.location}</td>
                  <td>
                    <span style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      background: getStatusColor(match.status),
                      color: 'white',
                      fontSize: '0.85rem'
                    }}>
                      {getStatusText(match.status)}
                    </span>
                  </td>
                  {isAdmin() && (
                    <td>
                      <button className="btn btn-primary" onClick={() => handleEdit(match)} style={{ marginRight: '5px' }}>
                        Sửa
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(match._id)}>
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
              <h2>{editingMatch ? 'Sửa trận đấu' : 'Thêm trận đấu mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Đội nhà *</label>
                <select
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn đội nhà --</option>
                  {teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Đội khách *</label>
                <select
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn đội khách --</option>
                  {teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Điểm đội nhà</label>
                  <input
                    type="number"
                    name="homeScore"
                    value={formData.homeScore}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Điểm đội khách</label>
                  <input
                    type="number"
                    name="awayScore"
                    value={formData.awayScore}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Ngày thi đấu *</label>
                <input
                  type="date"
                  name="matchDate"
                  value={formData.matchDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa điểm *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{getStatusText(status)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Hiệp đấu</label>
                <input
                  type="number"
                  name="quarter"
                  value={formData.quarter}
                  onChange={handleInputChange}
                  min="1"
                  max="4"
                />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div>
                <button type="submit" className="btn btn-success">
                  {editingMatch ? 'Cập nhật' : 'Thêm mới'}
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

export default Matches;

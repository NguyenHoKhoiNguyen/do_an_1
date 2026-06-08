import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Teams() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    coach: '',
    founded: '',
    city: '',
    description: '',
  });

  // Search states
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchCoach, setSearchCoach] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsAPI.getAll();
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchName) params.name = searchName;
      if (searchCity) params.city = searchCity;
      if (searchCoach) params.coach = searchCoach;

      const response = await teamsAPI.search(params);
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching teams:', error);
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchCity('');
    setSearchCoach('');
    fetchTeams();
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
      if (editingTeam) {
        await teamsAPI.update(editingTeam._id, formData);
      } else {
        await teamsAPI.create(formData);
      }
      setShowModal(false);
      setEditingTeam(null);
      setFormData({ name: '', coach: '', founded: '', city: '', description: '' });
      fetchTeams();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Có lỗi xảy ra khi lưu đội bóng');
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      coach: team.coach,
      founded: team.founded,
      city: team.city,
      description: team.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đội bóng này?')) {
      try {
        await teamsAPI.delete(id);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Có lỗi xảy ra khi xóa đội bóng');
      }
    }
  };

  const openAddModal = () => {
    setEditingTeam(null);
    setFormData({ name: '', coach: '', founded: '', city: '', description: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản lý Đội bóng</h2>
          {isAdmin() && (
            <button className="btn btn-primary" onClick={openAddModal}>
              + Thêm đội bóng
            </button>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>🔍 Tìm kiếm</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tên đội</label>
            <input
              type="text"
              placeholder="Tìm theo tên đội..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Thành phố</label>
            <input
              type="text"
              placeholder="Tìm theo thành phố..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Huấn luyện viên</label>
            <input
              type="text"
              placeholder="Tìm theo HLV..."
              value={searchCoach}
              onChange={(e) => setSearchCoach(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <button className="btn btn-primary" onClick={handleSearch}>
              Tìm kiếm
            </button>
            <button className="btn btn-secondary" onClick={handleClearSearch}>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="card">
          <p>Chưa có đội bóng nào. Hãy thêm đội bóng đầu tiên!</p>
        </div>
      ) : (
        <div className="grid">
          {teams.map((team) => (
            <div key={team._id} className="card">
              <h3>{team.name}</h3>
              <p><strong>Huấn luyện viên:</strong> {team.coach}</p>
              <p><strong>Thành phố:</strong> {team.city}</p>
              <p><strong>Thành lập:</strong> {team.founded}</p>
              <p><strong>Thắng/Thua:</strong> {team.wins} - {team.losses}</p>
              {team.description && <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#7f8c8d' }}>{team.description}</p>}
              <div style={{ marginTop: '15px' }}>
                <button className="btn btn-primary" onClick={() => navigate(`/formation/${team._id}`)}>
                  🏀 Xem đội hình
                </button>
              </div>
              {isAdmin() && (
                <div style={{ marginTop: '10px' }}>
                  <button className="btn btn-primary" onClick={() => handleEdit(team)}>
                    Sửa
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(team._id)}>
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTeam ? 'Sửa đội bóng' : 'Thêm đội bóng mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên đội bóng *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Huấn luyện viên *</label>
                <input
                  type="text"
                  name="coach"
                  value={formData.coach}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Thành phố *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Năm thành lập *</label>
                <input
                  type="number"
                  name="founded"
                  value={formData.founded}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max="2025"
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div>
                <button type="submit" className="btn btn-success">
                  {editingTeam ? 'Cập nhật' : 'Thêm mới'}
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

export default Teams;

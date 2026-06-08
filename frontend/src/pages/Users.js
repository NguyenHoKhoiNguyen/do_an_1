import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Users() {
  const { isAdmin, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (userId, username) => {
    if (userId === (currentUser?._id || currentUser?.id)) {
      alert('Bạn không thể xóa chính mình!');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa user "${username}"?`)) {
      try {
        await api.delete(`/auth/users/${userId}`);
        alert('Xóa user thành công!');
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa user');
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>👥 Quản lý người dùng</h2>
        <p style={{ color: '#7f8c8d', marginTop: '10px' }}>
          Tổng số người dùng: <strong>{users.length}</strong>
        </p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <strong>{user.username}</strong>
                  {user._id === (currentUser?._id || currentUser?.id) && (
                    <span style={{ 
                      marginLeft: '8px', 
                      padding: '2px 6px', 
                      background: '#3498db', 
                      color: 'white', 
                      borderRadius: '3px', 
                      fontSize: '0.75rem' 
                    }}>
                      Bạn
                    </span>
                  )}
                </td>
                <td>{user.email}</td>
                <td>{user.fullName || '-'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  {user._id !== (currentUser?._id || currentUser?.id) ? (
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(user._id, user.username)}
                    >
                      Xóa
                    </button>
                  ) : (
                    <span style={{ color: '#95a5a6', fontSize: '0.9rem' }}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;

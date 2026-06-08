import React, { useState } from 'react';
import { exportAPI } from '../services/api';
import './Export.css';

export default function Export() {
  const [loading, setLoading] = useState({});
  const [message, setMessage] = useState('');

  const handleExport = async (type, filename) => {
    try {
      setLoading({ ...loading, [type]: true });
      setMessage('');

      let response;
      switch(type) {
        case 'standings':
          response = await exportAPI.exportStandingsPDF();
          break;
        case 'teams':
          response = await exportAPI.exportTeamsPDF();
          break;
        case 'players':
          response = await exportAPI.exportPlayersPDF();
          break;
        case 'matches':
          response = await exportAPI.exportMatchesPDF();
          break;
        default:
          return;
      }

      // Tạo blob URL và tải xuống
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setMessage(`✅ Tải ${filename} thành công!`);
    } catch (err) {
      setMessage(`❌ Lỗi: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  const exportItems = [
    {
      type: 'standings',
      title: '⭐ Bảng Xếp Hạng',
      description: 'Báo cáo xếp hạng đầy đủ với thông tin tỷ lệ thắng',
      filename: 'standings.pdf',
      icon: '📊'
    },
    {
      type: 'teams',
      title: '🏀 Danh Sách Đội',
      description: 'Báo cáo chi tiết về các đội và danh sách cầu thủ',
      filename: 'teams-report.pdf',
      icon: '🏢'
    },
    {
      type: 'players',
      title: '👥 Danh Sách Cầu Thủ',
      description: 'Báo cáo thống kê toàn bộ cầu thủ và điểm số',
      filename: 'players-report.pdf',
      icon: '⚽'
    },
    {
      type: 'matches',
      title: '📅 Lịch Thi Đấu',
      description: 'Báo cáo lịch sử tất cả các trận đấu',
      filename: 'matches-report.pdf',
      icon: '🎮'
    }
  ];

  return (
    <div className="export-container">
      <div className="export-header">
        <h1>📥 Xuất Báo Cáo PDF</h1>
        <p className="subtitle">Tải xuống các báo cáo dưới dạng PDF</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="export-grid">
        {exportItems.map((item) => (
          <div key={item.type} className="export-card">
            <div className="card-icon">{item.icon}</div>
            <h3 className="card-title">{item.title}</h3>
            <p className="card-description">{item.description}</p>
            <button
              className="btn-export"
              onClick={() => handleExport(item.type, item.filename)}
              disabled={loading[item.type]}
            >
              {loading[item.type] ? '⏳ Đang tải...' : '📥 Tải Xuống'}
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="export-info">
        <h2>ℹ️ Thông Tin</h2>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">📄</div>
            <div className="info-content">
              <h4>Định Dạng PDF</h4>
              <p>Tất cả báo cáo được xuất dưới dạng PDF chuyên nghiệp có thể in được</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">⏰</div>
            <div className="info-content">
              <h4>Dữ Liệu Thực Thời</h4>
              <p>Báo cáo luôn chứa dữ liệu mới nhất từ hệ thống</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">🔒</div>
            <div className="info-content">
              <h4>Bảo Mật</h4>
              <p>Chỉ người dùng đã đăng nhập mới có thể tải báo cáo</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📱</div>
            <div className="info-content">
              <h4>Responsive</h4>
              <p>Báo cáo hoạt động tốt trên tất cả các thiết bị</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="export-tips">
        <h2>💡 Mẹo Sử Dụng</h2>
        <ul>
          <li>Nhấn nút "Tải Xuống" để lưu báo cáo vào máy tính</li>
          <li>Báo cáo được tạo với ngày giờ hiện tại</li>
          <li>Sử dụng trình duyệt Chrome hoặc Edge để có kết quả tốt nhất</li>
          <li>Bạn có thể in trực tiếp báo cáo sau khi tải xuống</li>
        </ul>
      </div>
    </div>
  );
}

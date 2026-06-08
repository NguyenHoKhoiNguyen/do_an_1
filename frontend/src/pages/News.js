import React, { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import './News.css';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch basketball news
  const fetchNews = async (pageNum = 1, query = '') => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (query) {
        response = await newsAPI.searchNews(query, pageNum);
      } else {
        response = await newsAPI.getNews(pageNum);
      }

      setNews(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError('Lỗi khi tải tin tức: ' + (err.response?.data?.error || err.message));
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews(1, searchQuery);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    fetchNews();
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>📰 Tin Tức Bóng Rổ</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
          <br />
          <small>💡 Đảm bảo bạn đã cấu hình NEWS_API_KEY trong file .env</small>
        </div>
      )}

      {/* Search bar */}
      <div className="news-search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm tin tức (vd: NBA, Kobe Bryant...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-search">
            Tìm
          </button>
          {searchQuery && (
            <button 
              type="button" 
              className="btn btn-clear"
              onClick={handleClearSearch}
            >
              ✕ Xóa
            </button>
          )}
        </form>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="loading">⏳ Đang tải tin tức...</div>
      ) : news.length === 0 ? (
        <div className="no-data">
          📭 Không có tin tức nào
          {searchQuery && ` cho "${searchQuery}"`}
        </div>
      ) : (
        <div className="news-grid">
          {news.map((item, index) => (
            <div key={index} className="news-card">
              {item.urlToImage && (
                <img 
                  src={item.urlToImage} 
                  alt={item.title} 
                  className="news-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23667eea" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3E🏀%3C/text%3E%3C/svg%3E';
                  }}
                />
              )}
              
              <div className="news-body">
                <h3>{item.title}</h3>
                <p className="news-source">
                  📰 {item.source?.name || 'Unknown Source'}
                </p>
                <p className="news-date">
                  📅 {new Date(item.publishedAt).toLocaleDateString('vi-VN')}
                </p>
                <p className="news-content">{item.description}</p>
              </div>

              <div className="news-footer">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-read-more"
                >
                  Đọc tiếp →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => (
            <button
              key={index + 1}
              className={`page-btn ${page === index + 1 ? 'active' : ''}`}
              onClick={() => fetchNews(index + 1, searchQuery)}
              disabled={loading}
            >
              {index + 1}
            </button>
          ))}
          {totalPages > 5 && <span className="pagination-info">... {totalPages} trang</span>}
        </div>
      )}
    </div>
  );
}

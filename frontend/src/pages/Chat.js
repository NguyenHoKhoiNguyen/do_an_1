import React, { useState, useEffect, useRef } from 'react';
import { aiAPI } from '../services/api';
import '../styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history on mount
    loadChatHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await aiAPI.getHistory();
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to UI
    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.sendMessage(input);

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ Xin lỗi, tôi gặp lỗi. Vui lòng thử lại!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm('Bạn có chắc muốn xóa lịch sử trò chuyện?')) {
      try {
        await aiAPI.clearHistory();
        setMessages([]);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🤖 Trợ Lý Bóng Rổ AI</h1>
        <button onClick={clearChat} className="clear-btn" title="Xóa lịch sử">
          🗑️ Xóa
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">🏀</div>
            <h2>Chào mừng đến với Trợ Lý Bóng Rổ AI!</h2>
            <p>Hỏi tôi bất cứ điều gì về:</p>
            <ul>
              <li>💪 Thống kê cầu thủ & đội bóng</li>
              <li>📊 Kết quả trận đấu</li>
              <li>🏆 Bảng xếp hạng</li>
              <li>🎯 Phân tích & gợi ý</li>
            </ul>
            <p className="example">Ví dụ: "Cầu thủ nào ghi bàn nhiều nhất?" hoặc "Đội A thắng bao nhiêu trận?"</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading || !input.trim()} className="send-btn">
          {loading ? '⏳' : '📤'}
        </button>
      </form>

      <div className="chat-info">
        <small>💡 Trợ lý AI được cung cấp bởi Groq</small>
      </div>
    </div>
  );
};

export default Chat;

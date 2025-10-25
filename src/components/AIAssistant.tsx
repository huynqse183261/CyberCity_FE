import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import LinuxLabNavigation from './LinuxLabNavigation';
import UserDropdown from './UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import type { User as UserType } from '../models/LinuxLabTypes';
import '../styles/LinuxLabPage.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Transform AuthContext user to component user format
  const user: UserType = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  // Khởi tạo Google Generative AI
  const apiKey = "AIzaSyAyV4aVzWNhKzlSfWWb8XSw0GZB5gDxqdU";
  const genAI = new GoogleGenerativeAI(apiKey);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!apiKey) {
      alert('API Key chưa được cấu hình. Vui lòng liên hệ admin.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Sử dụng Google Generative AI SDK
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent(currentInput);
      const response = await result.response;
      const aiResponse = response.text() || 'Không nhận được phản hồi từ AI';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Lỗi: ${error instanceof Error ? error.message : 'Không thể kết nối với Gemini API. Vui lòng thử lại sau.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả tin nhắn?')) {
      setMessages([]);
    }
  };

  return (
    <div className="linux-lab-page ai-chat-page">
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      {/* AI Chat Header */}
      <div className="ai-chat-header">
        <div className="ai-chat-header-content">
          <div className="ai-chat-title">
            <div className="ai-chat-icon">🤖</div>
            <div>
              <h1>AI Assistant</h1>
              <p>Trợ lý AI thông minh hỗ trợ học tập 24/7</p>
            </div>
          </div>
          <div className="ai-chat-controls">
            <button
              onClick={clearChat}
              className="ai-control-btn"
              title="Xóa tin nhắn"
            >
              <Trash2 size={18} />
              Xóa chat
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="ai-control-btn"
              title="Cài đặt"
            >
              <Settings size={18} />
              Cài đặt
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="ai-settings-panel">
          <div className="container">
            <div className="settings-content">
              <h3>🔧 Cài đặt AI Assistant</h3>
              <div className="setting-item">
                <label>Trạng thái API Key</label>
                <input
                  type="text"
                  value={apiKey ? '✅ Đã cấu hình' : '❌ Chưa cấu hình'}
                  readOnly
                  className="setting-input"
                />
                <p className="setting-help">
                  API Key được cấu hình trong file .env. 
                  Lấy API Key tại: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="ai-chat-container">
        <div className="container">
          <div className="ai-chat-wrapper">
            {/* Messages Area */}
            <div className="ai-messages-area">
              {messages.length === 0 && (
                <div className="ai-welcome-message">
                  <div className="welcome-icon">🤖</div>
                  <h2>Chào mừng đến với AI Assistant</h2>
                  <p>Tôi là trợ lý AI thông minh, sẵn sàng hỗ trợ bạn học tập và giải đáp thắc mắc 24/7</p>
                  <div className="welcome-features">
                    <div className="feature-item">✓ Giải thích lệnh Linux</div>
                    <div className="feature-item">✓ Hướng dẫn Penetration Testing</div>
                    <div className="feature-item">✓ Debug và Troubleshooting</div>
                    <div className="feature-item">✓ Gợi ý giải pháp bảo mật</div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`message-bubble ${message.role}`}>
                  <div className="message-avatar">
                    {message.role === 'assistant' ? (
                      <Bot size={20} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message-bubble assistant loading">
                  <div className="message-avatar">
                    <Bot size={20} />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="ai-input-area">
              <div className="input-wrapper">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="message-input"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="send-button"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="input-help">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* AI Chat Page Styles */
        .ai-chat-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .ai-chat-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
        }

        .ai-chat-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ai-chat-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: white;
        }

        .ai-chat-icon {
          font-size: 3rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
        }

        .ai-chat-title h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }

        .ai-chat-title p {
          margin: 0.5rem 0 0 0;
          opacity: 0.8;
          font-size: 1rem;
        }

        .ai-chat-controls {
          display: flex;
          gap: 1rem;
        }

        .ai-control-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .ai-control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* Settings Panel */
        .ai-settings-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
        }

        .settings-content {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .settings-content h3 {
          color: white;
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
        }

        .setting-item {
          margin-bottom: 1.5rem;
        }

        .setting-item label {
          display: block;
          color: white;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .setting-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: white;
          font-size: 1rem;
        }

        .setting-help {
          margin: 0.5rem 0 0 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .setting-help a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: underline;
        }

        /* Chat Container */
        .ai-chat-container {
          flex: 1;
          padding: 2rem 0;
        }

        .ai-chat-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 70vh;
        }

        /* Messages Area */
        .ai-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ai-welcome-message {
          text-align: center;
          color: white;
          padding: 2rem;
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .ai-welcome-message h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 0 1rem 0;
        }

        .ai-welcome-message p {
          margin: 0 0 2rem 0;
          opacity: 0.8;
          line-height: 1.6;
        }

        .welcome-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .feature-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Message Bubbles */
        .message-bubble {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .message-bubble.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .message-bubble.assistant .message-avatar {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .message-bubble.user .message-avatar {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
        }

        .message-content {
          max-width: 70%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          backdrop-filter: blur(10px);
        }

        .message-bubble.user .message-content {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .message-text {
          color: white;
          line-height: 1.6;
          white-space: pre-wrap;
          margin: 0;
        }

        .message-time {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 0.5rem;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          gap: 0.25rem;
          padding: 0.5rem 0;
        }

        .typing-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: typing 1.4s ease-in-out infinite both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }

        /* Input Area */
        .ai-input-area {
          padding: 1.5rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
        }

        .input-wrapper {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .message-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          resize: none;
          max-height: 8rem;
          outline: none;
          font-family: inherit;
          font-size: 1rem;
        }

        .message-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .message-input:focus {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .send-button {
          padding: 0.75rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 0.75rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a6fd8, #6a4190);
          transform: translateY(-2px);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .input-help {
          text-align: center;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .ai-chat-header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .ai-chat-controls {
            justify-content: center;
          }
          
          .ai-chat-wrapper {
            margin: 0 1rem;
            height: 60vh;
          }
          
          .message-content {
            max-width: 85%;
          }
          
          .welcome-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
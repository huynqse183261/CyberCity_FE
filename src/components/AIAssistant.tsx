import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Lấy API key từ environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
      // Khởi tạo Google Generative AI
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Sử dụng model gemini-2.5-flash như yêu cầu
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Gửi prompt và nhận phản hồi
      const result = await model.generateContent(currentInput);
      const response = result.response;
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
    <div className="ai-assistant">
      <style>{`
        .ai-assistant {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .ai-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ai-logo {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .ai-title {
          color: white;
        }

        .ai-title h1 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0;
        }

        .ai-title p {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .ai-header-right {
          display: flex;
          gap: 0.5rem;
        }

        .ai-btn {
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .ai-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .ai-settings {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
        }

        .ai-settings label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.5rem;
        }

        .ai-settings input {
          width: 100%;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          outline: none;
        }

        .ai-settings input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .ai-settings input:focus {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .ai-settings p {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0.5rem 0 0 0;
        }

        .ai-settings a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: underline;
        }

        .ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ai-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }

        .ai-welcome-logo {
          width: 5rem;
          height: 5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 1rem;
        }

        .ai-welcome h2 {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          margin: 0 0 0.5rem 0;
        }

        .ai-welcome p {
          color: rgba(255, 255, 255, 0.7);
          max-width: 24rem;
          margin: 0;
        }

        .ai-message {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .ai-message.user {
          justify-content: flex-end;
        }

        .ai-message-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .ai-message-avatar.assistant {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .ai-message-avatar.user {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
        }

        .ai-message-content {
          max-width: 48rem;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
        }

        .ai-message-content.user {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .ai-message-content.assistant {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .ai-message-content p {
          margin: 0;
          white-space: pre-wrap;
          line-height: 1.5;
        }

        .ai-loading {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .ai-loading-dots {
          display: flex;
          gap: 0.5rem;
        }

        .ai-loading-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .ai-loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .ai-loading-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }

        .ai-input-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
        }

        .ai-input-wrapper {
          max-width: 64rem;
          margin: 0 auto;
          display: flex;
          gap: 0.75rem;
        }

        .ai-textarea {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          resize: none;
          max-height: 8rem;
          outline: none;
        }

        .ai-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .ai-textarea:focus {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .ai-send-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .ai-send-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a6fd8, #6a4190);
          transform: translateY(-1px);
        }

        .ai-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .ai-input-help {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .ai-header {
            padding: 1rem;
          }
          
          .ai-messages {
            padding: 1rem;
          }
          
          .ai-input-container {
            padding: 1rem;
          }
          
          .ai-input-wrapper {
            flex-direction: column;
          }
          
          .ai-send-btn {
            align-self: flex-end;
          }
        }
      `}</style>

      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-logo">
            <Bot size={20} />
          </div>
          <div className="ai-title">
            <h1>AI Assistant</h1>
            <p>Powered by Gemini AI</p>
          </div>
      </div>
        <div className="ai-header-right">
          <button
            onClick={clearChat}
            className="ai-btn"
            title="Xóa tin nhắn"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="ai-btn"
            title="Cài đặt"
          >
            <Settings size={18} />
          </button>
          </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="ai-settings">
          <label>Gemini API Key Status</label>
        <input
          type="text"
            value={apiKey ? '••••••••••••••••••••••••••••••••••••••••' : 'Chưa cấu hình'}
            readOnly
            placeholder="API Key chưa được cấu hình"
          />
          <p>
            API Key được cấu hình trong file .env. 
            Liên hệ admin để cấu hình API Key từ: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <div className="ai-welcome-logo">
              <Bot size={48} />
            </div>
            <h2>Chào mừng đến với AI Assistant</h2>
            <p>
              Tôi là trợ lý AI thông minh, sẵn sàng trả lời câu hỏi và hỗ trợ bạn 24/7
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`ai-message ${message.role}`}
          >
            {message.role === 'assistant' && (
              <div className="ai-message-avatar assistant">
                <Bot size={16} />
              </div>
            )}
            <div className={`ai-message-content ${message.role}`}>
              <p>{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="ai-message-avatar user">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="ai-loading">
            <div className="ai-message-avatar assistant">
              <Bot size={16} />
            </div>
            <div className="ai-message-content assistant">
              <div className="ai-loading-dots">
                <div className="ai-loading-dot"></div>
                <div className="ai-loading-dot"></div>
                <div className="ai-loading-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ai-input-container">
        <div className="ai-input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi của bạn..."
            className="ai-textarea"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="ai-send-btn"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="ai-input-help">
          Nhấn Enter để gửi, Shift + Enter để xuống dòng
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
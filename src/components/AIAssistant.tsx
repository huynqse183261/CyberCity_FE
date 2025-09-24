import React, { useState, useRef, useEffect } from 'react';
import type { Message, AIAssistantProps } from '../models/LinuxLabTypes';

const AIAssistant: React.FC<AIAssistantProps> = ({ isExpanded, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Xin chào! Tôi có thể giúp bạn:\n• Học lệnh Linux\n• Kỹ thuật pentesting\n• Troubleshooting\n• Best practices bảo mật'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const message = inputValue.trim();
    if (message) {
      // Add user message
      const newMessages = [...messages, { type: 'user' as const, content: message }];
      setMessages(newMessages);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          type: 'bot',
          content: `Cảm ơn bạn đã hỏi về "${message}". Đây là câu trả lời mô phỏng. Trong phiên bản thực tế, tôi sẽ phân tích câu hỏi và đưa ra hướng dẫn chi tiết.`
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={`ai-assistant ${isExpanded ? 'expanded' : ''}`}>
      <div className="ai-header" onClick={onToggle}>
        🤖 AI Assistant
        <span>{isExpanded ? '▼' : '▲'}</span>
      </div>
      <div className="ai-chat" ref={chatRef}>
        {messages.map((message, index) => (
          <div key={index} className={`ai-message ${message.type}`}>
            <strong>{message.type === 'user' ? 'Bạn:' : 'AI:'}</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="ai-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Hỏi tôi về Linux hoặc pentesting"
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default AIAssistant;
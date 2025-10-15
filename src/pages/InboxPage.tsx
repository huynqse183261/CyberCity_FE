import React, { useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import type { MessageUser, CreateConversationRequest } from '../models/MessageTypes';
import '../styles/Inbox.css';

const InboxPage: React.FC = () => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    selectedConversation,
    loading,
    searchQuery,
    newMessageText,
    showNewConversationModal,
    unreadCount,
    selectConversation,
    createConversation,
    sendMessage,
    deleteMessage,
    searchUsers,
    searchMessages,
    updateNewMessageText,
    toggleNewConversationModal,
    clearSearch
  } = useMessages();

  // New conversation modal state
  const [newConvTitle, setNewConvTitle] = useState('');
  const [newConvIsGroup, setNewConvIsGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<MessageUser[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<MessageUser[]>([]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    try {
      await sendMessage();
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  // Handle search users for new conversation
  const handleUserSearch = async (query: string) => {
    setUserSearchQuery(query);
    if (query.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }

    try {
      const users = await searchUsers(query);
      // Filter out current user
      const filteredUsers = users.filter(u => u.uid !== user?.id);
      setUserSearchResults(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Handle create new conversation
  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;

    const data: CreateConversationRequest = {
      title: newConvIsGroup ? newConvTitle : undefined,
      is_group: newConvIsGroup,
      member_uids: selectedUsers.map(u => u.uid)
    };

    try {
      await createConversation(data);
      // Reset form
      setNewConvTitle('');
      setNewConvIsGroup(false);
      setSelectedUsers([]);
      setUserSearchQuery('');
      setUserSearchResults([]);
    } catch (error) {
      console.error('Failed to create conversation');
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  // Get conversation display name
  const getConversationName = (conv: any) => {
    if (conv.title) return conv.title;
    if (conv.is_group) return 'Nhóm chat';
    
    // For private chat, show other user's name
    const otherMember = conv.members?.find((m: any) => m.user?.uid !== user?.id);
    return otherMember?.user?.full_name || 'Cuộc hội thoại';
  };

  return (
    <div className="inbox-page">
      {/* Sidebar - Conversations List */}
      <div className="inbox-sidebar">
        <div className="inbox-header">
          <h2 className="inbox-title">
            <span className="inbox-icon">💬</span>
            Hộp thư
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </h2>
          
          <button 
            className="new-conversation-btn"
            onClick={toggleNewConversationModal}
            title="Tạo cuộc hội thoại mới"
          >
            ✏️
          </button>
        </div>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm cuộc hội thoại..."
            value={searchQuery}
            onChange={(e) => searchMessages(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>

        {/* Conversations List */}
        <div className="conversations-list">
          {loading ? (
            <div className="loading-spinner">Đang tải...</div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có cuộc hội thoại nào</p>
              <button onClick={toggleNewConversationModal} className="create-first-btn">
                Tạo cuộc hội thoại đầu tiên
              </button>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.uid}
                className={`conversation-item ${selectedConversation?.uid === conv.uid ? 'active' : ''}`}
                onClick={() => selectConversation(conv)}
              >
                <div className="conversation-avatar">
                  {conv.is_group ? '👥' : '👤'}
                </div>
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h4 className="conversation-name">
                      {getConversationName(conv)}
                    </h4>
                    <span className="conversation-time">
                      {conv.last_message && formatTime(conv.last_message.sent_at)}
                    </span>
                  </div>
                  <p className="conversation-preview">
                    {conv.last_message?.message || 'Chưa có tin nhắn'}
                  </p>
                  {conv.unread_count && conv.unread_count > 0 && (
                    <span className="conversation-unread">{conv.unread_count}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="inbox-main">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-info">
                <h3 className="chat-title">
                  {getConversationName(selectedConversation)}
                </h3>
                <span className="chat-subtitle">
                  {selectedConversation.is_group 
                    ? `${selectedConversation.members?.length || 0} thành viên`
                    : 'Cuộc hội thoại riêng tư'
                  }
                </span>
              </div>
              <div className="chat-actions">
                <button className="chat-action-btn" title="Thông tin">ℹ️</button>
                <button className="chat-action-btn" title="Tìm kiếm">🔍</button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {loading ? (
                <div className="loading-spinner">Đang tải tin nhắn...</div>
              ) : messages.length === 0 ? (
                <div className="empty-messages">
                  <p>Chưa có tin nhắn nào</p>
                  <p>Hãy bắt đầu cuộc hội thoại!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.uid}
                    className={`message ${message.sender_uid === user?.id ? 'own-message' : 'other-message'}`}
                  >
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">
                          {message.sender?.full_name || 'Unknown'}
                        </span>
                        <span className="message-time">
                          {formatTime(message.sent_at)}
                        </span>
                      </div>
                      <div className="message-text">
                        {message.message}
                      </div>
                    </div>
                    {message.sender_uid === user?.id && (
                      <button
                        className="delete-message-btn"
                        onClick={() => deleteMessage(message.uid)}
                        title="Xóa tin nhắn"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <div className="message-input-wrapper">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={newMessageText}
                  onChange={(e) => updateNewMessageText(e.target.value)}
                  className="message-input"
                />
                <button type="submit" className="send-btn" disabled={!newMessageText.trim()}>
                  📤
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <div className="welcome-message">
              <h3>Chào mừng đến Hộp thư!</h3>
              <p>Chọn một cuộc hội thoại để bắt đầu chat</p>
              <button onClick={toggleNewConversationModal} className="start-chat-btn">
                Bắt đầu cuộc hội thoại mới
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversationModal && (
        <div className="modal-overlay" onClick={toggleNewConversationModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo cuộc hội thoại mới</h3>
              <button className="modal-close-btn" onClick={toggleNewConversationModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateConversation} className="new-conversation-form">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newConvIsGroup}
                    onChange={(e) => setNewConvIsGroup(e.target.checked)}
                  />
                  Nhóm chat
                </label>
              </div>

              {newConvIsGroup && (
                <div className="form-group">
                  <label>Tên nhóm:</label>
                  <input
                    type="text"
                    value={newConvTitle}
                    onChange={(e) => setNewConvTitle(e.target.value)}
                    placeholder="Nhập tên nhóm..."
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Tìm người dùng:</label>
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => handleUserSearch(e.target.value)}
                  placeholder="Tìm theo tên hoặc email..."
                  className="form-input"
                />
                
                {userSearchResults.length > 0 && (
                  <div className="user-search-results">
                    {userSearchResults.map((user) => (
                      <div
                        key={user.uid}
                        className="user-search-item"
                        onClick={() => {
                          if (!selectedUsers.find(u => u.uid === user.uid)) {
                            setSelectedUsers([...selectedUsers, user]);
                          }
                        }}
                      >
                        <span>{user.full_name}</span>
                        <span className="user-email">({user.email})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedUsers.length > 0 && (
                <div className="selected-users">
                  <label>Đã chọn:</label>
                  <div className="selected-users-list">
                    {selectedUsers.map((user) => (
                      <span key={user.uid} className="selected-user-tag">
                        {user.full_name}
                        <button
                          type="button"
                          onClick={() => setSelectedUsers(selectedUsers.filter(u => u.uid !== user.uid))}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={toggleNewConversationModal} className="cancel-btn">
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="create-btn"
                  disabled={selectedUsers.length === 0}
                >
                  Tạo cuộc hội thoại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxPage;
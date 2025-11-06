/**
 * EXAMPLE COMPONENTS - ADMIN MESSAGES
 * Copy và sử dụng theo nhu cầu
 */

import React, { useState } from 'react';
import { Card, List, Avatar, Button, Input, message as antdMessage } from 'antd';
import { useAdminMessages } from '../hooks/useAdminMessages';
import type { ConversationDto, MessageDto } from '../services/adminMessageService';

// ================================================
// EXAMPLE 1: Minimal Conversation List
// ================================================
export const MinimalConversationList = () => {
  const { conversations, loading, selectConversation } = useAdminMessages();

  return (
    <div>
      <h2>Conversations</h2>
      {loading && <div>Loading...</div>}
      <ul>
        {conversations.map(conv => (
          <li key={conv.uid}>
            <button onClick={() => selectConversation(conv)}>
              {conv.title} ({conv.totalMessages} messages)
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ================================================
// EXAMPLE 2: Conversation List with Ant Design
// ================================================
export const ConversationListCard = () => {
  const { conversations, loading, selectConversation } = useAdminMessages();

  return (
    <Card title="Conversations" loading={loading}>
      <List
        dataSource={conversations}
        renderItem={(conv: ConversationDto) => (
          <List.Item
            actions={[
              <Button 
                type="link" 
                onClick={() => selectConversation(conv)}
              >
                View
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar>{conv.title?.[0]}</Avatar>}
              title={conv.title}
              description={`${conv.totalMessages} messages • ${conv.members.length} members`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

// ================================================
// EXAMPLE 3: Message List
// ================================================
export const MessageList = ({ conversationId }: { conversationId: string }) => {
  const { messages, loading, loadMessages } = useAdminMessages();

  React.useEffect(() => {
    loadMessages(conversationId);
  }, [conversationId, loadMessages]);

  return (
    <div>
      <h3>Messages</h3>
      {loading && <div>Loading...</div>}
      {messages.map((msg: MessageDto) => (
        <div key={msg.uid} style={{ 
          padding: 10, 
          marginBottom: 10, 
          background: '#f5f5f5' 
        }}>
          <strong>{msg.sender.fullName}:</strong>
          <p>{msg.message}</p>
          <small>{new Date(msg.sentAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

// ================================================
// EXAMPLE 4: Send Message Form
// ================================================
export const SendMessageForm = ({ conversationId }: { conversationId: string }) => {
  const { sendMessage } = useAdminMessages();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) {
      antdMessage.warning('Please enter a message');
      return;
    }

    setSending(true);
    const success = await sendMessage(conversationId, text);
    setSending(false);

    if (success) {
      setText('');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Input
        value={text}
        onChange={e => setText(e.target.value)}
        onPressEnter={handleSend}
        placeholder="Type your message..."
        disabled={sending}
      />
      <Button 
        type="primary" 
        onClick={handleSend} 
        loading={sending}
      >
        Send
      </Button>
    </div>
  );
};

// ================================================
// EXAMPLE 5: Stats Dashboard
// ================================================
export const StatsDashboard = () => {
  const { stats } = useAdminMessages();

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <Card>
        <h4>Total Conversations</h4>
        <h2>{stats.totalConversations}</h2>
      </Card>
      <Card>
        <h4>Total Messages</h4>
        <h2>{stats.totalMessages}</h2>
      </Card>
      <Card>
        <h4>Today</h4>
        <h2>{stats.todayMessages}</h2>
      </Card>
      <Card>
        <h4>This Week</h4>
        <h2>{stats.thisWeekMessages}</h2>
      </Card>
    </div>
  );
};

// ================================================
// EXAMPLE 6: Search with Pagination
// ================================================
export const ConversationsWithSearch = () => {
  const {
    conversations,
    loading,
    currentPage,
    totalPages,
    handleSearch,
    handlePageChange
  } = useAdminMessages();

  return (
    <Card>
      <Input.Search
        placeholder="Search conversations..."
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      
      <List
        loading={loading}
        dataSource={conversations}
        renderItem={(conv: ConversationDto) => (
          <List.Item>
            <List.Item.Meta
              title={conv.title}
              description={`${conv.totalMessages} messages`}
            />
          </List.Item>
        )}
      />

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button 
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span style={{ margin: '0 16px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  );
};

// ================================================
// EXAMPLE 7: Delete Message Button
// ================================================
export const DeleteMessageButton = ({ messageId }: { messageId: string }) => {
  const { deleteMessage } = useAdminMessages();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    setDeleting(true);
    await deleteMessage(messageId);
    setDeleting(false);
  };

  return (
    <Button 
      danger 
      onClick={handleDelete} 
      loading={deleting}
    >
      Delete
    </Button>
  );
};

// ================================================
// EXAMPLE 8: Full Page Component
// ================================================
export const AdminMessagesFullPage = () => {
  const {
    stats,
    conversations,
    messages,
    selectedConversation,
    loading,
    selectConversation,
    sendMessage,
    deleteMessage,
    handleSearch,
    refreshAll
  } = useAdminMessages();

  const [messageText, setMessageText] = useState('');

  const handleSendMessage = async () => {
    if (!selectedConversation || !messageText.trim()) return;
    
    const success = await sendMessage(selectedConversation.uid, messageText);
    if (success) {
      setMessageText('');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Stats */}
      <div style={{ marginBottom: 24 }}>
        <StatsDashboard />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        {/* Left: Conversations */}
        <Card 
          title="Conversations" 
          extra={<Button onClick={refreshAll}>Refresh</Button>}
        >
          <Input.Search
            placeholder="Search..."
            onSearch={handleSearch}
            style={{ marginBottom: 16 }}
          />
          <List
            loading={loading}
            dataSource={conversations}
            renderItem={(conv: ConversationDto) => (
              <List.Item
                onClick={() => selectConversation(conv)}
                style={{ 
                  cursor: 'pointer',
                  background: selectedConversation?.uid === conv.uid ? '#e6f7ff' : 'white'
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar>{conv.title?.[0]}</Avatar>}
                  title={conv.title}
                  description={`${conv.totalMessages} messages`}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Right: Messages */}
        <Card title={selectedConversation?.title || 'Select a conversation'}>
          {selectedConversation ? (
            <>
              {/* Messages List */}
              <div style={{ height: 400, overflowY: 'auto', marginBottom: 16 }}>
                {messages.map((msg: MessageDto) => (
                  <div 
                    key={msg.uid} 
                    style={{ 
                      padding: 12, 
                      marginBottom: 8, 
                      background: '#f5f5f5',
                      borderRadius: 8 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{msg.sender.fullName}</strong>
                      <Button 
                        size="small" 
                        danger 
                        onClick={() => deleteMessage(msg.uid)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p>{msg.message}</p>
                    <small style={{ color: '#999' }}>
                      {new Date(msg.sentAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>

              {/* Send Message Form */}
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onPressEnter={handleSendMessage}
                  placeholder="Type your message..."
                />
                <Button type="primary" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              Select a conversation to view messages
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ================================================
// EXAMPLE 9: Using Service Directly (without hook)
// ================================================
export const DirectServiceExample = () => {
  const [conversations, setConversations] = React.useState<ConversationDto[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Import service
        const adminMessageService = (await import('../services/adminMessageService')).default;
        
        // Call API directly
        const response = await adminMessageService.getConversations({
          pageNumber: 1,
          pageSize: 20
        });
        
        setConversations(response.items);
      } catch (error) {
        // console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      {loading ? 'Loading...' : `${conversations.length} conversations loaded`}
    </div>
  );
};

// ================================================
// EXAMPLE 10: Custom Hook Usage
// ================================================
export const CustomHookExample = () => {
  const hook = useAdminMessages();

  // Log everything for debugging
  // console.log('Hook state:', hook);

  return (
    <div>
      <h3>Available data:</h3>
      <pre>{JSON.stringify({
        loading: hook.loading,
        statsLoaded: !!hook.stats,
        conversationsCount: hook.conversations.length,
        messagesCount: hook.messages.length,
        selectedConversation: hook.selectedConversation?.title
      }, null, 2)}</pre>
    </div>
  );
};

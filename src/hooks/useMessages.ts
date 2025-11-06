import { useState, useEffect, useCallback } from 'react';
import messageService from '../services/messageService';
import type {
  Conversation,
  Message,
  InboxState,
  CreateConversationRequest,
  SendMessageRequest,
  MessageUser
} from '../models/MessageTypes';

export const useMessages = () => {
  const [state, setState] = useState<InboxState>({
    selectedConversation: undefined,
    conversations: [],
    messages: [],
    loading: false,
    searchQuery: '',
    newMessageText: '',
    showNewConversationModal: false,
  });

  const [unreadCount, setUnreadCount] = useState(0);

  // ===========================
  // CONVERSATIONS
  // ===========================

  const loadConversations = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await messageService.getConversations(1, 50);
      setState(prev => ({
        ...prev,
        conversations: response.conversations,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    setState(prev => ({ ...prev, selectedConversation: conversation, loading: true }));
    
    try {
      // Load messages for selected conversation
      const response = await messageService.getMessages(conversation.uid, 1, 50);
      
      // Mark conversation as read
      await messageService.markConversationAsRead(conversation.uid);
      
      setState(prev => ({
        ...prev,
        messages: response.messages.reverse(), // Reverse to show newest at bottom
        loading: false
      }));

      // Update unread count
      loadUnreadCount();
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const createConversation = useCallback(async (data: CreateConversationRequest) => {
    try {
      const newConversation = await messageService.createConversation(data);
      setState(prev => ({
        ...prev,
        conversations: [newConversation, ...prev.conversations],
        showNewConversationModal: false
      }));
      
      // Auto-select the new conversation
      selectConversation(newConversation);
      
      return newConversation;
    } catch (error) {
      throw error;
    }
  }, [selectConversation]);

  // ===========================
  // MESSAGES
  // ===========================

  const sendMessage = useCallback(async () => {
    if (!state.selectedConversation || !state.newMessageText.trim()) return;

    const messageData: SendMessageRequest = {
      conversation_uid: state.selectedConversation.uid,
      message: state.newMessageText.trim()
    };

    try {
      const newMessage = await messageService.sendMessage(messageData);
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        newMessageText: ''
      }));

      // Update conversation list with new last message
      setState(prev => ({
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.uid === state.selectedConversation?.uid
            ? { ...conv, last_message: newMessage }
            : conv
        )
      }));

    } catch (error) {
      throw error;
    }
  }, [state.selectedConversation, state.newMessageText]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.uid !== messageId)
      }));
    } catch (error) {
      throw error;
    }
  }, []);

  // ===========================
  // SEARCH & FILTER
  // ===========================

  const searchUsers = useCallback(async (query: string): Promise<MessageUser[]> => {
    try {
      return await messageService.searchUsers(query, state.selectedConversation?.uid);
    } catch (error) {
      return [];
    }
  }, [state.selectedConversation]);

  const searchMessages = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadConversations();
      return;
    }

    setState(prev => ({ ...prev, loading: true, searchQuery: query }));
    
    try {
      const response = await messageService.searchMessages({
        query: query.trim(),
        page: 1,
        limit: 50
      });

      // Group messages by conversation for display
      const messagesByConv = response.messages.reduce((acc, message) => {
        const convId = message.conversation_uid;
        if (!acc[convId]) {
          acc[convId] = [];
        }
        acc[convId].push(message);
        return acc;
      }, {} as Record<string, Message[]>);

      // Update conversations to show search results
      setState(prev => ({
        ...prev,
        loading: false
      }));

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [loadConversations]);

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await messageService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      // Silently fail
    }
  }, []);

  const updateNewMessageText = useCallback((text: string) => {
    setState(prev => ({ ...prev, newMessageText: text }));
  }, []);

  const toggleNewConversationModal = useCallback(() => {
    setState(prev => ({ ...prev, showNewConversationModal: !prev.showNewConversationModal }));
  }, []);

  const clearSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchQuery: '' }));
    loadConversations();
  }, [loadConversations]);

  // ===========================
  // EFFECTS
  // ===========================

  useEffect(() => {
    loadConversations();
    loadUnreadCount();
  }, [loadConversations, loadUnreadCount]);

  // Auto-refresh unread count every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  return {
    // State
    ...state,
    unreadCount,
    
    // Actions
    loadConversations,
    selectConversation,
    createConversation,
    sendMessage,
    deleteMessage,
    searchUsers,
    searchMessages,
    updateNewMessageText,
    toggleNewConversationModal,
    clearSearch,
    loadUnreadCount
  };
};
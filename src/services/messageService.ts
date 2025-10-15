import axiosInstance from '../api/axiosInstance';
import type {
  Conversation,
  Message,
  GetConversationsResponse,
  GetMessagesResponse,
  CreateConversationRequest,
  SendMessageRequest,
  SearchMessagesRequest,
  MessageUser
} from '../models/MessageTypes';

class MessageService {
  private baseURL = '/api/messages';

  // ===========================
  // CONVERSATIONS
  // ===========================

  /**
   * Get all conversations for current user
   */
  async getConversations(page = 1, limit = 20): Promise<GetConversationsResponse> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/conversations`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversation by ID with members
   */
  async getConversationById(conversationId: string): Promise<Conversation> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  /**
   * Create new conversation
   */
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    try {
      const response = await axiosInstance.post(`${this.baseURL}/conversations`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Add member to conversation
   */
  async addMemberToConversation(conversationId: string, userIds: string[]): Promise<void> {
    try {
      await axiosInstance.post(`${this.baseURL}/conversations/${conversationId}/members`, {
        user_uids: userIds
      });
    } catch (error) {
      console.error('Error adding members:', error);
      throw error;
    }
  }

  /**
   * Remove member from conversation
   */
  async removeMemberFromConversation(conversationId: string, userId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseURL}/conversations/${conversationId}/members/${userId}`);
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }

  /**
   * Leave conversation
   */
  async leaveConversation(conversationId: string): Promise<void> {
    try {
      await axiosInstance.post(`${this.baseURL}/conversations/${conversationId}/leave`);
    } catch (error) {
      console.error('Error leaving conversation:', error);
      throw error;
    }
  }

  // ===========================
  // MESSAGES
  // ===========================

  /**
   * Get messages in a conversation
   */
  async getMessages(conversationId: string, page = 1, limit = 50): Promise<GetMessagesResponse> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/conversations/${conversationId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * Send message to conversation
   */
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    try {
      const response = await axiosInstance.post(`${this.baseURL}/messages`, data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await axiosInstance.put(`${this.baseURL}/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  /**
   * Mark all messages in conversation as read
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      await axiosInstance.put(`${this.baseURL}/conversations/${conversationId}/read`);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseURL}/messages/${messageId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // ===========================
  // SEARCH & FILTER
  // ===========================

  /**
   * Search messages across conversations
   */
  async searchMessages(params: SearchMessagesRequest): Promise<GetMessagesResponse> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/search`, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  /**
   * Search users for creating new conversation
   */
  async searchUsers(query: string, exclude_conversation_id?: string): Promise<MessageUser[]> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/users/search`, {
        params: { 
          query, 
          exclude_conversation_id 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // ===========================
  // NOTIFICATIONS
  // ===========================

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/unread-count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Get recent conversations with unread counts
   */
  async getRecentConversations(limit = 5): Promise<Conversation[]> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/conversations/recent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent conversations:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const messageService = new MessageService();
export default messageService;
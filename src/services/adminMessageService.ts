import axiosInstance from '../api/axiosInstance';

// ===========================
// TYPES - Dựa theo API docs
// ===========================

// Query parameters
export interface GetConversationsQuery {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetMessagesQuery {
  pageNumber?: number;
  pageSize?: number;
}

// DTOs
export interface SimpleUserDto {
  uid: string;
  username: string;
  fullName: string;
  role: string; // student, teacher, admin
  image: string | null;
}

export interface ConversationDto {
  uid: string;
  title: string;
  isGroup: boolean;
  totalMessages: number;
  createdAt: string;
  lastMessageAt: string | null;
  members: SimpleUserDto[];
}

export interface MessageDto {
  uid: string;
  conversationUid: string;
  senderUid: string;
  message: string;
  sentAt: string;
  sender: SimpleUserDto;
}

// Response types
export interface ConversationsListResponse {
  items: ConversationDto[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface MessagesListResponse {
  items: MessageDto[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  isSuccess: boolean;
  message: string;
  data: MessageDto;
}

export interface DeleteMessageResponse {
  isSuccess: boolean;
  message: string;
}

export interface MessageStatsResponse {
  totalConversations: number;
  totalMessages: number;
  todayMessages: number;
  thisWeekMessages: number;
}

// ===========================
// SERVICE CLASS
// ===========================

class AdminMessageService {
  private readonly baseUrl = '/api/admin';

  /**
   * 1. Lấy danh sách cuộc hội thoại
   * GET /api/admin/conversations
   */
  async getConversations(query: GetConversationsQuery = {}): Promise<ConversationsListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (query.pageNumber) params.append('pageNumber', query.pageNumber.toString());
      if (query.pageSize) params.append('pageSize', query.pageSize.toString());
      if (query.searchQuery) params.append('searchQuery', query.searchQuery);

      const url = params.toString() 
        ? `${this.baseUrl}/conversations?${params}` 
        : `${this.baseUrl}/conversations`;

      const response = await axiosInstance.get<ConversationsListResponse>(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * 2. Lấy tin nhắn trong cuộc hội thoại
   * GET /api/admin/conversations/{conversationId}/messages
   */
  async getMessages(conversationId: string, query: GetMessagesQuery = {}): Promise<MessagesListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (query.pageNumber) params.append('pageNumber', query.pageNumber.toString());
      if (query.pageSize) params.append('pageSize', query.pageSize.toString());

      const url = params.toString()
        ? `${this.baseUrl}/conversations/${conversationId}/messages?${params}`
        : `${this.baseUrl}/conversations/${conversationId}/messages`;

      const response = await axiosInstance.get<MessagesListResponse>(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * 3. Gửi tin nhắn phản hồi (Admin gửi)
   * POST /api/admin/conversations/{conversationId}/messages
   */
  async sendMessage(conversationId: string, message: string): Promise<SendMessageResponse> {
    try {
      const request: SendMessageRequest = { message };
      
      const response = await axiosInstance.post<SendMessageResponse>(
        `${this.baseUrl}/conversations/${conversationId}/messages`,
        request
      );
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * 4. Xóa tin nhắn
   * DELETE /api/admin/messages/{messageId}
   */
  async deleteMessage(messageId: string): Promise<DeleteMessageResponse> {
    try {
      const response = await axiosInstance.delete<DeleteMessageResponse>(
        `${this.baseUrl}/messages/${messageId}`
      );
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * 5. Lấy thống kê tổng quan
   * GET /api/admin/messages/stats
   */
  async getStats(): Promise<MessageStatsResponse> {
    try {
      const response = await axiosInstance.get<MessageStatsResponse>(
        `${this.baseUrl}/messages/stats`
      );
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

// Export singleton instance
const adminMessageService = new AdminMessageService();
export default adminMessageService;

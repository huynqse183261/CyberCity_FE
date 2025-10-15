// ===========================
// MESSAGING SYSTEM TYPES
// Based on PostgreSQL Schema
// ===========================

// User info for messaging
export interface MessageUser {
  uid: string;
  email: string;
  username: string;
  full_name: string;
  image?: string;
  role: 'student' | 'teacher' | 'admin';
}

// Conversation types
export interface Conversation {
  uid: string;
  org_uid?: string;
  title?: string;
  is_group: boolean;
  created_at: string;
  last_message?: Message;
  unread_count?: number;
  members?: ConversationMember[];
}

// Conversation member
export interface ConversationMember {
  uid: string;
  conversation_uid: string;
  user_uid: string;
  joined_at: string;
  user?: MessageUser;
}

// Message in conversation
export interface Message {
  uid: string;
  conversation_uid: string;
  sender_uid: string;
  message: string;
  sent_at: string;
  sender?: MessageUser;
  is_read?: boolean;
}

// ===========================
// API REQUEST/RESPONSE TYPES
// ===========================

// Get conversations list
export interface GetConversationsResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
}

// Get messages in conversation
export interface GetMessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}

// Create new conversation request
export interface CreateConversationRequest {
  title?: string;
  is_group: boolean;
  member_uids: string[];
  org_uid?: string;
}

// Send message request
export interface SendMessageRequest {
  conversation_uid: string;
  message: string;
}

// Search conversations/messages
export interface SearchMessagesRequest {
  query: string;
  conversation_uid?: string;
  sender_uid?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

// ===========================
// UI STATE TYPES
// ===========================

// Inbox page state
export interface InboxState {
  selectedConversation?: Conversation;
  conversations: Conversation[];
  messages: Message[];
  loading: boolean;
  searchQuery: string;
  newMessageText: string;
  showNewConversationModal: boolean;
}

// Message filter for UI
export interface MessageFilter {
  searchText: string;
  conversation_type: 'all' | 'private' | 'group';
  date_range?: [string, string];
  sender?: string;
}

// Notification for new messages
export interface MessageNotification {
  conversation_uid: string;
  message: Message;
  unread_count: number;
}

// ===========================
// ADMIN MESSAGING TYPES
// For AdminPage messaging management
// ===========================

import type { Conversation, Message, MessageUser } from './MessageTypes';

// Admin-specific message analytics
export interface AdminMessageStats {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  messagesLastWeek: number;
  topActiveUsers: MessageUser[];
  conversationsByType: {
    student_teacher: number;
    student_student: number;
    teacher_teacher: number;
    group_class: number;
  };
}

// Enhanced conversation with admin info
export interface AdminConversation extends Conversation {
  participants: MessageUser[];
  messageCount: number;
  lastActivity: string;
  isClassroom: boolean;
  courseInfo?: {
    course_uid: string;
    course_name: string;
    module_name?: string;
  };
  moderationFlags: {
    hasReportedMessages: boolean;
    isUnderReview: boolean;
    isMuted: boolean;
  };
}

// Enhanced message with admin features
export interface AdminMessage extends Message {
  isReported: boolean;
  reportCount: number;
  isModerated: boolean;
  moderatedBy?: string;
  moderatedAt?: string;
  moderationReason?: string;
}

// Admin message filter options
export interface AdminMessageFilter {
  conversationType: 'all' | 'student_teacher' | 'student_student' | 'teacher_teacher' | 'classroom';
  timeRange: 'today' | 'week' | 'month' | 'all';
  userRole: 'all' | 'student' | 'teacher';
  status: 'all' | 'active' | 'reported' | 'moderated';
  courseId?: string;
  searchQuery: string;
}

// Classroom conversation management
export interface ClassroomConversation {
  uid: string;
  course_uid: string;
  course_name: string;
  teacher_uid: string;
  teacher_name: string;
  student_uids: string[];
  students: MessageUser[];
  created_at: string;
  is_active: boolean;
  description?: string;
}

// Create classroom conversation request
export interface CreateClassroomRequest {
  course_uid: string;
  teacher_uid: string;
  student_uids: string[];
  title: string;
  description?: string;
}

// User conversation history for admin view
export interface UserConversationHistory {
  user: MessageUser;
  conversations: AdminConversation[];
  totalMessages: number;
  joinedConversations: number;
  lastActivity: string;
  warningCount: number;
  isBanned: boolean;
}

// Message moderation action
export interface ModerationAction {
  action: 'warn' | 'delete' | 'mute_user' | 'ban_user' | 'close_conversation';
  reason: string;
  duration?: number; // For mute/ban duration in hours
  notifyUser: boolean;
}

// Admin message report
export interface MessageReport {
  uid: string;
  message_uid: string;
  reported_by: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  action_taken?: string;
}

// ===========================
// API REQUEST/RESPONSE TYPES
// ===========================

// Get all conversations for admin
export interface AdminGetConversationsResponse {
  conversations: AdminConversation[];
  total: number;
  page: number;
  limit: number;
  stats: AdminMessageStats;
}

// Get classroom conversations
export interface GetClassroomsResponse {
  classrooms: ClassroomConversation[];
  total: number;
  page: number;
  limit: number;
}

// Get user conversation history
export interface GetUserHistoryResponse {
  history: UserConversationHistory[];
  total: number;
  page: number;
  limit: number;
}

// Get message reports
export interface GetReportsResponse {
  reports: MessageReport[];
  total: number;
  page: number;
  limit: number;
}

// Admin search request
export interface AdminSearchRequest {
  query: string;
  filters: AdminMessageFilter;
  page?: number;
  limit?: number;
}

// Bulk moderation request
export interface BulkModerationRequest {
  message_uids: string[];
  action: ModerationAction;
}

// ===========================
// UI STATE TYPES
// ===========================

// Admin messaging page state
export interface AdminMessagingState {
  selectedConversation?: AdminConversation;
  conversations: AdminConversation[];
  classrooms: ClassroomConversation[];
  messages: AdminMessage[];
  reports: MessageReport[];
  stats: AdminMessageStats | null;
  filters: AdminMessageFilter;
  loading: boolean;
  selectedTab: 'all' | 'classrooms' | 'reports' | 'analytics';
  showCreateClassroomModal: boolean;
  showModerationModal: boolean;
  selectedMessages: string[];
}


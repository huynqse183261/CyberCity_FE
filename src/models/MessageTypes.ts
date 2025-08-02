// Interface cho tin nhắn
export interface Message {
  key: string;
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
  attachments?: MessageAttachment[];
  tags?: string[];
}

// Interface cho file đính kèm
export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

// Interface cho thống kê tin nhắn
export interface MessageStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  urgent: number;
}

// Interface cho filter tin nhắn
export interface MessageFilter {
  searchText: string;
  status: string;
  priority: string;
  dateRange?: [string, string];
}

// Interface cho form trả lời tin nhắn
export interface MessageReplyData {
  content: string;
  attachments?: File[];
}

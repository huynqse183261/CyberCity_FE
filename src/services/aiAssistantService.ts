import { BaseApiService, API_ENDPOINTS } from './BaseApiService';
import axiosInstance from '../api/axiosInstance';
import type { ApiResponse } from '../models';

// AI Chat interfaces
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    context?: 'linux-command' | 'security' | 'troubleshooting' | 'general';
    sessionId?: string;
    commandContext?: string;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  context: {
    currentOS?: string;
    currentDirectory?: string;
    environmentId?: string;
    sessionId?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIChatRequest {
  message: string;
  context?: {
    sessionId?: string;
    currentCommand?: string;
    errorOutput?: string;
    environmentInfo?: {
      os: string;
      version: string;
      installedTools: string[];
    };
    previousCommands?: string[];
  };
  conversationId?: string;
}

export interface AIChatResponse {
  message: string;
  suggestions?: string[];
  commands?: Array<{
    command: string;
    description: string;
    category: 'basic' | 'intermediate' | 'advanced';
    risk: 'safe' | 'caution' | 'danger';
  }>;
  relatedTopics?: string[];
  conversationId: string;
}

// AI Help interfaces  
export interface AIHelpRequest {
  topic: 'linux-commands' | 'networking' | 'security' | 'troubleshooting' | 'file-system';
  level: 'beginner' | 'intermediate' | 'advanced';
  specificQuery?: string;
  context?: {
    currentError?: string;
    currentTask?: string;
    environmentType?: string;
  };
}

export interface AIHelpResponse {
  explanation: string;
  examples: Array<{
    command: string;
    description: string;
    output?: string;
  }>;
  tips: string[];
  warnings?: string[];
  nextSteps?: string[];
  relatedCommands?: string[];
}

// AI Code Analysis interfaces
export interface CodeAnalysisRequest {
  code: string;
  language: 'bash' | 'python' | 'javascript' | 'c' | 'cpp' | 'other';
  context?: {
    purpose?: string;
    environment?: string;
  };
}

export interface CodeAnalysisResponse {
  analysis: {
    syntax: 'valid' | 'invalid';
    security: 'safe' | 'suspicious' | 'dangerous';
    complexity: 'simple' | 'moderate' | 'complex';
    performance: 'good' | 'moderate' | 'poor';
  };
  suggestions: string[];
  vulnerabilities?: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    fix: string;
  }>;
  improvements: string[];
}

class AIAssistantService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.AI_CHAT);
  }

  // Chat với AI
  async sendMessage(request: AIChatRequest): Promise<ApiResponse<AIChatResponse>> {
    const response = await axiosInstance.post<ApiResponse<AIChatResponse>>(
      API_ENDPOINTS.AI_CHAT,
      request
    );
    return response.data;
  }

  // Lấy lịch sử chat
  async getChatHistory(conversationId: string): Promise<ApiResponse<ChatMessage[]>> {
    const response = await axiosInstance.get<ApiResponse<ChatMessage[]>>(
      `${API_ENDPOINTS.AI_CHAT}/${conversationId}/history`
    );
    return response.data;
  }

  // Tạo conversation mới
  async createConversation(title?: string): Promise<ApiResponse<ChatSession>> {
    const response = await axiosInstance.post<ApiResponse<ChatSession>>(
      `${API_ENDPOINTS.AI_CHAT}/conversation`,
      { title: title || `Conversation ${new Date().toLocaleString()}` }
    );
    return response.data;
  }

  // Lấy danh sách conversations
  async getConversations(): Promise<ApiResponse<ChatSession[]>> {
    const response = await axiosInstance.get<ApiResponse<ChatSession[]>>(
      `${API_ENDPOINTS.AI_CHAT}/conversations`
    );
    return response.data;
  }

  // Xóa conversation
  async deleteConversation(conversationId: string): Promise<ApiResponse<null>> {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `${API_ENDPOINTS.AI_CHAT}/conversation/${conversationId}`
    );
    return response.data;
  }

  // Lấy help từ AI
  async getHelp(request: AIHelpRequest): Promise<ApiResponse<AIHelpResponse>> {
    const response = await axiosInstance.post<ApiResponse<AIHelpResponse>>(
      API_ENDPOINTS.AI_HELP,
      request
    );
    return response.data;
  }

  // Lấy suggestions cho command
  async getCommandSuggestions(partialCommand: string, context?: {
    currentDirectory?: string;
    availableFiles?: string[];
    environmentType?: string;
  }): Promise<ApiResponse<{
    suggestions: Array<{
      command: string;
      description: string;
      category: string;
      confidence: number;
    }>;
  }>> {
    const response = await axiosInstance.post<ApiResponse<{
      suggestions: Array<{
        command: string;
        description: string;
        category: string;
        confidence: number;
      }>;
    }>>(API_ENDPOINTS.AI_SUGGESTIONS, {
      partialCommand,
      context
    });
    return response.data;
  }

  // Phân tích code
  async analyzeCode(request: CodeAnalysisRequest): Promise<ApiResponse<CodeAnalysisResponse>> {
    const response = await axiosInstance.post<ApiResponse<CodeAnalysisResponse>>(
      `${API_ENDPOINTS.AI_HELP}/analyze-code`,
      request
    );
    return response.data;
  }

  // Explain command - giải thích lệnh Linux
  async explainCommand(command: string, context?: {
    os?: string;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
  }): Promise<ApiResponse<{
    explanation: string;
    syntax: string;
    options: Array<{
      option: string;
      description: string;
      example?: string;
    }>;
    examples: Array<{
      command: string;
      description: string;
      output?: string;
    }>;
    warnings?: string[];
    seeAlso?: string[];
  }>> {
    const response = await axiosInstance.post<ApiResponse<{
      explanation: string;
      syntax: string;
      options: Array<{
        option: string;
        description: string;
        example?: string;
      }>;
      examples: Array<{
        command: string;
        description: string;
        output?: string;
      }>;
      warnings?: string[];
      seeAlso?: string[];
    }>>(
      `${API_ENDPOINTS.AI_HELP}/explain-command`,
      { command, context }
    );
    return response.data;
  }

  // Debug error - giúp debug lỗi
  async debugError(errorInfo: {
    command: string;
    errorOutput: string;
    exitCode: number;
    environment?: {
      os: string;
      version: string;
      shell: string;
    };
    context?: {
      currentDirectory: string;
      previousCommands: string[];
      filePermissions?: string;
    };
  }): Promise<ApiResponse<{
    diagnosis: string;
    possibleCauses: string[];
    solutions: Array<{
      solution: string;
      commands?: string[];
      explanation: string;
      difficulty: 'easy' | 'medium' | 'hard';
    }>;
    prevention: string[];
  }>> {
    const response = await axiosInstance.post<ApiResponse<{
      diagnosis: string;
      possibleCauses: string[];
      solutions: Array<{
        solution: string;
        commands?: string[];
        explanation: string;
        difficulty: 'easy' | 'medium' | 'hard';
      }>;
      prevention: string[];
    }>>(
      `${API_ENDPOINTS.AI_HELP}/debug-error`,
      errorInfo
    );
    return response.data;
  }

  // Generate script - tạo script tự động
  async generateScript(request: {
    task: string;
    language: 'bash' | 'python' | 'powershell';
    environment: {
      os: string;
      availableTools: string[];
    };
    requirements?: string[];
    constraints?: string[];
  }): Promise<ApiResponse<{
    script: string;
    explanation: string;
    usage: string;
    requirements: string[];
    warnings?: string[];
  }>> {
    const response = await axiosInstance.post<ApiResponse<{
      script: string;
      explanation: string;
      usage: string;
      requirements: string[];
      warnings?: string[];
    }>>(
      `${API_ENDPOINTS.AI_HELP}/generate-script`,
      request
    );
    return response.data;
  }

  // WebSocket connection for real-time chat
  connectRealTimeChat(conversationId: string): WebSocket {
    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'}/ws/ai-chat/${conversationId}`;
    const token = localStorage.getItem('access_token');
    
    const ws = new WebSocket(`${wsUrl}?token=${token}`);
    
    ws.onopen = () => {
      // AI Chat WebSocket connected
    };
    
    ws.onerror = (error) => {
      // AI Chat WebSocket error
    };
    
    ws.onclose = () => {
      // AI Chat WebSocket disconnected
    };
    
    return ws;
  }
}

export default new AIAssistantService();
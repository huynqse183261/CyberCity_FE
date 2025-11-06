import { BaseApiService, API_ENDPOINTS } from './BaseApiService';
import axiosInstance from './../api/axiosInstance';
import type { 
  LinuxLabEnvironment,
  LinuxLabSession
} from '../models/LinuxLabTypes';
import type { ApiResponse } from '../models';

// Interface cho lab environment request
export interface CreateLabEnvironmentRequest {
  name: string;
  description?: string;
  os: 'ubuntu' | 'kali' | 'centos' | 'debian';
  version: string;
  resources: {
    cpu: number;
    memory: number; // GB
    disk: number;   // GB
  };
  preInstalledTools?: string[];
  dockerImage?: string;
}

// Interface cho lab session
export interface CreateLabSessionRequest {
  environmentId: string;
  sessionName?: string;
  maxDuration?: number; // minutes
}

export interface LabCommand {
  command: string;
  timestamp: Date;
  output?: string;
  exitCode?: number;
}

export interface LabTerminalSession {
  sessionId: string;
  environmentId: string;
  isActive: boolean;
  commands: LabCommand[];
  createdAt: Date;
  lastActivity: Date;
}

class LinuxLabService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.LAB_ENVIRONMENTS);
  }

  // Lấy danh sách environments có sẵn
  async getAvailableEnvironments(): Promise<ApiResponse<LinuxLabEnvironment[]>> {
    return this.getAll<LinuxLabEnvironment>({ status: 'available' });
  }

  // Tạo environment mới
  async createEnvironment(data: CreateLabEnvironmentRequest): Promise<ApiResponse<LinuxLabEnvironment>> {
    return this.create<LinuxLabEnvironment, CreateLabEnvironmentRequest>(data);
  }

  // Khởi tạo lab session
  async createSession(data: CreateLabSessionRequest): Promise<ApiResponse<LinuxLabSession>> {
    const response = await axiosInstance.post<ApiResponse<LinuxLabSession>>(
      `${API_ENDPOINTS.LAB_SESSIONS}`,
      data
    );
    return response.data;
  }

  // Lấy thông tin session
  async getSession(sessionId: string): Promise<ApiResponse<LinuxLabSession>> {
    const response = await axiosInstance.get<ApiResponse<LinuxLabSession>>(
      `${API_ENDPOINTS.LAB_SESSIONS}/${sessionId}`
    );
    return response.data;
  }

  // Kết nối terminal WebSocket
  connectTerminal(sessionId: string): WebSocket {
    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'}/ws/terminal/${sessionId}`;
    const token = localStorage.getItem('access_token');
    
    const ws = new WebSocket(`${wsUrl}?token=${token}`);
    
    ws.onopen = () => {
      // Terminal WebSocket connected
    };
    
    ws.onerror = (error) => {
      // Terminal WebSocket error
    };
    
    ws.onclose = () => {
      // Terminal WebSocket disconnected
    };
    
    return ws;
  }

  // Thực thi lệnh
  async executeCommand(sessionId: string, command: string): Promise<ApiResponse<{
    output: string;
    exitCode: number;
    executionTime: number;
  }>> {
    const response = await axiosInstance.post<ApiResponse<{
      output: string;
      exitCode: number;
      executionTime: number;
    }>>(`${API_ENDPOINTS.TERMINALS}/${sessionId}/execute`, {
      command
    });
    return response.data;
  }

  // Lấy lịch sử lệnh
  async getCommandHistory(sessionId: string): Promise<ApiResponse<LabCommand[]>> {
    const response = await axiosInstance.get<ApiResponse<LabCommand[]>>(
      `${API_ENDPOINTS.TERMINALS}/${sessionId}/history`
    );
    return response.data;
  }

  // Dừng session
  async stopSession(sessionId: string): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `${API_ENDPOINTS.LAB_SESSIONS}/${sessionId}/stop`
    );
    return response.data;
  }

  // Lưu snapshot của environment
  async createSnapshot(sessionId: string, snapshotName: string): Promise<ApiResponse<{
    snapshotId: string;
    name: string;
    size: number;
    createdAt: Date;
  }>> {
    const response = await axiosInstance.post<ApiResponse<{
      snapshotId: string;
      name: string;
      size: number;
      createdAt: Date;
    }>>(`${API_ENDPOINTS.LAB_SESSIONS}/${sessionId}/snapshot`, {
      name: snapshotName
    });
    return response.data;
  }

  // Khôi phục từ snapshot
  async restoreFromSnapshot(sessionId: string, snapshotId: string): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `${API_ENDPOINTS.LAB_SESSIONS}/${sessionId}/restore/${snapshotId}`
    );
    return response.data;
  }

  // Upload file vào environment
  async uploadFile(sessionId: string, file: File, path?: string): Promise<ApiResponse<{
    fileName: string;
    filePath: string;
    fileSize: number;
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (path) {
      formData.append('path', path);
    }

    const response = await axiosInstance.post<ApiResponse<{
      fileName: string;
      filePath: string;
      fileSize: number;
    }>>(`${API_ENDPOINTS.LAB_SESSIONS}/${sessionId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Download file từ environment
  async downloadFile(sessionId: string, filePath: string): Promise<Blob> {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.LAB_SESSIONS}/${sessionId}/download`,
      {
        params: { path: filePath },
        responseType: 'blob'
      }
    );
    return response.data;
  }

  // Lấy thống kê sử dụng resources
  async getResourceUsage(sessionId: string): Promise<ApiResponse<{
    cpu: number;
    memory: number;
    disk: number;
    network: {
      upload: number;
      download: number;
    };
    uptime: number;
  }>> {
    const response = await axiosInstance.get<ApiResponse<{
      cpu: number;
      memory: number;
      disk: number;
      network: {
        upload: number;
        download: number;
      };
      uptime: number;
    }>>(`${API_ENDPOINTS.LAB_SESSIONS}/${sessionId}/resources`);
    return response.data;
  }

  // Lấy danh sách file/folder
  async listDirectory(sessionId: string, path: string = '~'): Promise<ApiResponse<{
    path: string;
    items: Array<{
      name: string;
      type: 'file' | 'directory' | 'symlink';
      size: number;
      permissions: string;
      lastModified: Date;
    }>;
  }>> {
    const response = await axiosInstance.get<ApiResponse<{
      path: string;
      items: Array<{
        name: string;
        type: 'file' | 'directory' | 'symlink';
        size: number;
        permissions: string;
        lastModified: Date;
      }>;
    }>>(`${API_ENDPOINTS.TERMINALS}/${sessionId}/ls`, {
      params: { path }
    });
    return response.data;
  }
}

export default new LinuxLabService();
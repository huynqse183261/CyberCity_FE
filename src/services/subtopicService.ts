import axiosInstance from '../api/axiosInstance';

// Types for Subtopic
export interface Subtopic {
  uid: string;
  topicId: string;
  title: string;
  content: string;
  orderIndex: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSubtopicRequest {
  topicId: string;
  title: string;
  content: string;
  orderIndex: number;
}

export interface UpdateSubtopicRequest {
  topicId: string;
  title: string;
  content: string;
  orderIndex: number;
}

export interface SubtopicListParams {
  pageNumber?: number;
  pageSize?: number;
  topicId?: string;
  search?: string;
}

export interface SubtopicListResponse {
  items: Subtopic[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// Subtopic API Service
class SubtopicService {
  private readonly basePath = '/api/subtopics';

  // Get all subtopics with pagination
  async getAllSubtopics(params: SubtopicListParams = {}): Promise<ApiResponse<SubtopicListResponse>> {
    try {
      const { pageNumber = 1, pageSize = 10, topicId, search } = params;
      const queryParams = new URLSearchParams({
        page: pageNumber.toString(),
        pageSize: pageSize.toString(),
        ...(topicId && { topicId }),
        ...(search && { search })
      });

      const response = await axiosInstance.get(`${this.basePath}?${queryParams}`);
      
      if (response.status === 200) {
        return {
          success: true,
          message: 'Subtopics retrieved successfully',
          data: response.data,
          statusCode: response.status
        };
      }
      
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error: any) {
      throw {
        success: false,
        message: error?.response?.data?.message || error.message || 'Failed to fetch subtopics',
        data: null,
        statusCode: error?.response?.status || 500
      };
    }
  }

  // Create new subtopic
  async createSubtopic(data: CreateSubtopicRequest): Promise<ApiResponse<Subtopic>> {
    try {
      const response = await axiosInstance.post(this.basePath, data);
      
      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message: 'Subtopic created successfully',
          data: response.data,
          statusCode: response.status
        };
      }
      
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error: any) {
      throw {
        success: false,
        message: error?.response?.data?.message || error.message || 'Failed to create subtopic',
        data: null,
        statusCode: error?.response?.status || 500
      };
    }
  }

  // Update subtopic
  async updateSubtopic(id: string, data: UpdateSubtopicRequest): Promise<ApiResponse<Subtopic>> {
    try {
      const response = await axiosInstance.put(`${this.basePath}/${id}`, data);
      
      if (response.status === 200) {
        return {
          success: true,
          message: 'Subtopic updated successfully',
          data: response.data,
          statusCode: response.status
        };
      }
      
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error: any) {
      throw {
        success: false,
        message: error?.response?.data?.message || error.message || 'Failed to update subtopic',
        data: null,
        statusCode: error?.response?.status || 500
      };
    }
  }

  // Delete subtopic
  async deleteSubtopic(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.delete(`${this.basePath}/${id}`);
      
      if (response.status === 200 || response.status === 204) {
        return {
          success: true,
          message: 'Subtopic deleted successfully',
          data: null,
          statusCode: response.status
        };
      }
      
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error: any) {
      throw {
        success: false,
        message: error?.response?.data?.message || error.message || 'Failed to delete subtopic',
        data: null,
        statusCode: error?.response?.status || 500
      };
    }
  }

  // Get subtopic by ID
  async getSubtopicById(id: string): Promise<ApiResponse<Subtopic>> {
    try {
      const response = await axiosInstance.get(`${this.basePath}/${id}`);
      
      if (response.status === 200) {
        return {
          success: true,
          message: 'Subtopic retrieved successfully',
          data: response.data,
          statusCode: response.status
        };
      }
      
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error: any) {
      throw {
        success: false,
        message: error?.response?.data?.message || error.message || 'Failed to fetch subtopic',
        data: null,
        statusCode: error?.response?.status || 500
      };
    }
  }
}

export default new SubtopicService();
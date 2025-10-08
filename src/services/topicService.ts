import axiosInstance from '../api/axiosInstance';

// Topic interfaces
export interface Topic {
  uid: string;
  lessonUid: string;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTopicRequest {
  lessonUid: string;
  title: string;
  description: string;
  orderIndex: number;
}

export interface UpdateTopicRequest {
  lessonUid: string;
  title: string;
  description: string;
  orderIndex: number;
}

export interface TopicListParams {
  pageNumber?: number;
  pageSize?: number;
  lessonUid?: string;
  search?: string;
}

export interface TopicListResponse {
  items: Topic[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Topic API service
class TopicService {
  private readonly baseUrl = '/api/topics';

  // Get all topics with pagination and filters
  async getAllTopics(params: TopicListParams = {}): Promise<ApiResponse<TopicListResponse>> {
    try {
      const { pageNumber = 1, pageSize = 10, lessonUid, search } = params;
      
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });

      if (lessonUid) {
        queryParams.append('lessonUid', lessonUid);
      }

      if (search) {
        queryParams.append('search', search);
      }

      console.log('Fetching topics with params:', Object.fromEntries(queryParams));
      
      const response = await axiosInstance.get(`${this.baseUrl}?${queryParams}`);
      
      console.log('Topics API response:', response.data);

      // Handle response structure
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: 'Topics retrieved successfully'
        };
      }

      return {
        success: false,
        data: {
          items: [],
          pageNumber: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0
        },
        message: 'Failed to retrieve topics'
      };
    } catch (error: any) {
      console.error('Error fetching topics:', error);
      
      return {
        success: false,
        data: {
          items: [],
          pageNumber: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0
        },
        message: error.response?.data?.message || 'Failed to fetch topics',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Create new topic
  async createTopic(data: CreateTopicRequest): Promise<ApiResponse<Topic>> {
    try {
      console.log('Creating topic with data:', data);
      
      const response = await axiosInstance.post(this.baseUrl, data);
      
      console.log('Create topic response:', response.data);

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          data: response.data,
          message: 'Topic created successfully'
        };
      }

      return {
        success: false,
        data: response.data,
        message: 'Failed to create topic'
      };
    } catch (error: any) {
      console.error('Error creating topic:', error);
      
      return {
        success: false,
        data: {} as Topic,
        message: error.response?.data?.message || 'Failed to create topic',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Update existing topic
  async updateTopic(id: string, data: UpdateTopicRequest): Promise<ApiResponse<Topic>> {
    try {
      console.log('Updating topic:', id, 'with data:', data);
      
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
      
      console.log('Update topic response:', response.data);

      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: 'Topic updated successfully'
        };
      }

      return {
        success: false,
        data: response.data,
        message: 'Failed to update topic'
      };
    } catch (error: any) {
      console.error('Error updating topic:', error);
      
      return {
        success: false,
        data: {} as Topic,
        message: error.response?.data?.message || 'Failed to update topic',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Delete topic
  async deleteTopic(id: string): Promise<ApiResponse<void>> {
    try {
      console.log('Deleting topic:', id);
      
      const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
      
      console.log('Delete topic response:', response.status);

      if (response.status === 200 || response.status === 204) {
        return {
          success: true,
          data: undefined,
          message: 'Topic deleted successfully'
        };
      }

      return {
        success: false,
        data: undefined,
        message: 'Failed to delete topic'
      };
    } catch (error: any) {
      console.error('Error deleting topic:', error);
      
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'Failed to delete topic',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get topic by ID (if needed)
  async getTopicById(id: string): Promise<ApiResponse<Topic>> {
    try {
      console.log('Fetching topic by ID:', id);
      
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      
      console.log('Get topic by ID response:', response.data);

      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: 'Topic retrieved successfully'
        };
      }

      return {
        success: false,
        data: {} as Topic,
        message: 'Failed to retrieve topic'
      };
    } catch (error: any) {
      console.error('Error fetching topic by ID:', error);
      
      return {
        success: false,
        data: {} as Topic,
        message: error.response?.data?.message || 'Failed to fetch topic',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }
}

export default new TopicService();
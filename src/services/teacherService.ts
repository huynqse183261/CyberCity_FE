import axiosInstance from '../api/axiosInstance';

// ===========================
// TYPES & INTERFACES
// ===========================

// Student Types
export interface StudentDto {
  uid: string;
  fullName: string;
  email: string;
  username: string;
  enrolledCourses: EnrolledCourse[];
  lastActive: string;
}

export interface EnrolledCourse {
  courseUid: string;
  courseTitle: string;
  enrolledAt?: string;
}

export interface StudentDetailDto {
  uid: string;
  fullName: string;
  email: string;
  username: string;
  enrolledCourses: EnrolledCourse[];
  lastActive: string;
}

// Student List Response (Updated to match backend)
export interface GetStudentsResponse {
  success: boolean;
  students: StudentDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Add Student Request/Response
export interface AddStudentRequest {
  studentUid: string;
  courseUid: string;
}

export interface AddStudentResponse {
  success: boolean;
  message: string;
  data: {
    uid: string;
    teacherUid: string;
    studentUid: string;
    courseUid: string;
    assignedAt: string;
  };
}

// Progress Types
export interface SubtopicProgress {
  subtopicUid: string;
  subtopicTitle: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface LessonProgress {
  lessonUid: string;
  lessonTitle: string;
  progress: number;
  totalSubtopics: number;
  completedSubtopics: number;
  subtopics: SubtopicProgress[];
}

export interface ModuleProgress {
  moduleUid: string;
  moduleTitle: string;
  progress: number;
  totalSubtopics: number;
  completedSubtopics: number;
  lessons: LessonProgress[];
}

export interface CourseProgress {
  courseUid: string;
  courseTitle: string;
  overallProgress: number;
  totalSubtopics: number;
  completedSubtopics: number;
  modules: ModuleProgress[];
  lastActivity: string;
}

export interface GetProgressResponse {
  success: boolean;
  data: CourseProgress[];
}

// Conversation Types
export interface ConversationDto {
  conversationUid: string;
  participantUid: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// Conversations Response (Updated to match backend)
export interface GetConversationsResponse {
  success: boolean;
  conversations: ConversationDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CreateConversationRequest {
  studentUid: string;
}

export interface CreateConversationResponse {
  success: boolean;
  message: string;
  data: {
    conversationUid: string;
    participant1Uid: string;
    participant2Uid: string;
    createdAt: string;
  };
}

// Message Types
export interface MessageDto {
  uid: string;
  senderUid: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface ParticipantDto {
  uid: string;
  fullName: string;
}

// Messages Response (Updated to match backend)
export interface GetMessagesResponse {
  success: boolean;
  conversationUid: string;
  participant: ParticipantDto | null;
  messages: MessageDto[];
  pagination: {
    currentPage: number;
    hasMore: boolean;
  };
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: MessageDto;
}

// Dashboard Stats
export interface DashboardStatsDto {
  totalStudents: number;
  activeCourses: number;
  unreadMessages: number;
  avgProgress: number;
}

export interface GetDashboardStatsResponse {
  success: boolean;
  data: DashboardStatsDto;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// ===========================
// SERVICE CLASS
// ===========================

class TeacherService {
  private readonly baseUrl = '/api/v1/teacher';

  // ===========================
  // STUDENT MANAGEMENT (4 APIs)
  // ===========================

  /**
   * 1. GET Danh sách học sinh
   * GET /api/v1/teacher/students
   */
  async getStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    courseUid?: string;
  }): Promise<GetStudentsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.courseUid) queryParams.append('courseUid', params.courseUid);

      const url = queryParams.toString()
        ? `${this.baseUrl}/students?${queryParams}`
        : `${this.baseUrl}/students`;

      const response = await axiosInstance.get<GetStudentsResponse>(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  /**
   * 2. GET Chi tiết học sinh
   * GET /api/v1/teacher/students/{studentUid}
   */
  async getStudentDetail(studentUid: string): Promise<ApiResponse<StudentDetailDto>> {
    try {
      const response = await axiosInstance.get<ApiResponse<StudentDetailDto>>(
        `${this.baseUrl}/students/${studentUid}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching student detail:', error);
      throw error;
    }
  }

  /**
   * 3. POST Thêm học sinh vào lớp
   * POST /api/v1/teacher/students/add
   */
  async addStudent(data: AddStudentRequest): Promise<AddStudentResponse> {
    try {
      const response = await axiosInstance.post<AddStudentResponse>(
        `${this.baseUrl}/students/add`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Error adding student:', error);
      throw error;
    }
  }

  /**
   * 4. DELETE Xóa học sinh khỏi lớp
   * DELETE /api/v1/teacher/students/{studentUid}?courseUid=xxx
   */
  async removeStudent(studentUid: string, courseUid: string): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `${this.baseUrl}/students/${studentUid}?courseUid=${courseUid}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error removing student:', error);
      throw error;
    }
  }

  // ===========================
  // STUDENT PROGRESS (1 API)
  // ===========================

  /**
   * 5. GET Tiến độ học sinh
   * GET /api/v1/teacher/students/{studentUid}/progress
   */
  async getStudentProgress(
    studentUid: string,
    courseUid?: string
  ): Promise<GetProgressResponse> {
    try {
      const url = courseUid
        ? `${this.baseUrl}/students/${studentUid}/progress?courseUid=${courseUid}`
        : `${this.baseUrl}/students/${studentUid}/progress`;

      const response = await axiosInstance.get<GetProgressResponse>(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching student progress:', error);
      throw error;
    }
  }

  // ===========================
  // CONVERSATIONS (5 APIs)
  // ===========================

  /**
   * 6. GET Danh sách conversations
   * GET /api/v1/teacher/conversations
   */
  async getConversations(params?: {
    page?: number;
    limit?: number;
  }): Promise<GetConversationsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = queryParams.toString()
        ? `${this.baseUrl}/conversations?${queryParams}`
        : `${this.baseUrl}/conversations`;

      const response = await axiosInstance.get<GetConversationsResponse>(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * 7. POST Tạo conversation mới
   * POST /api/v1/teacher/conversations
   */
  async createConversation(data: CreateConversationRequest): Promise<CreateConversationResponse> {
    try {
      const response = await axiosInstance.post<CreateConversationResponse>(
        `${this.baseUrl}/conversations`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * 8. GET Tin nhắn trong conversation
   * GET /api/v1/teacher/conversations/{conversationUid}/messages
   */
  async getMessages(
    conversationUid: string,
    params?: {
      page?: number;
      limit?: number;
      before?: string;
    }
  ): Promise<GetMessagesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.before) queryParams.append('before', params.before);

      const url = queryParams.toString()
        ? `${this.baseUrl}/conversations/${conversationUid}/messages?${queryParams}`
        : `${this.baseUrl}/conversations/${conversationUid}/messages`;

      const response = await axiosInstance.get<GetMessagesResponse>(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * 9. POST Gửi tin nhắn
   * POST /api/v1/teacher/conversations/{conversationUid}/messages
   */
  async sendMessage(
    conversationUid: string,
    data: SendMessageRequest
  ): Promise<SendMessageResponse> {
    try {
      const response = await axiosInstance.post<SendMessageResponse>(
        `${this.baseUrl}/conversations/${conversationUid}/messages`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * 10. PATCH Đánh dấu đã đọc
   * PATCH /api/v1/teacher/conversations/{conversationUid}/read
   */
  async markAsRead(conversationUid: string): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<null>>(
        `${this.baseUrl}/conversations/${conversationUid}/read`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }

  // ===========================
  // DASHBOARD (1 API)
  // ===========================

  /**
   * 11. GET Dashboard stats
   * GET /api/v1/teacher/dashboard/stats
   */
  async getDashboardStats(): Promise<GetDashboardStatsResponse> {
    try {
      const response = await axiosInstance.get<GetDashboardStatsResponse>(
        `${this.baseUrl}/dashboard/stats`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
const teacherService = new TeacherService();
export default teacherService;

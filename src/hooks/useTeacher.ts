import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import teacherService from '../services/teacherService';
import type {
  StudentDto,
  StudentDetailDto,
  CourseProgress,
  ConversationDto,
  MessageDto,
  DashboardStatsDto,
  AddStudentRequest,
  CreateConversationRequest,
  SendMessageRequest
} from '../services/teacherService';

// ===========================
// STUDENT MANAGEMENT HOOK
// ===========================

export const useTeacherStudents = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>();

  // Load students
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await teacherService.getStudents({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
        courseUid: selectedCourse
      });

      if (response.success) {
        setStudents(response.students);
        setTotalItems(response.pagination.totalItems);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      message.error('Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, selectedCourse]);

  // Get student detail
  const getStudentDetail = useCallback(async (studentUid: string): Promise<StudentDetailDto | null> => {
    try {
      const response = await teacherService.getStudentDetail(studentUid);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error loading student detail:', error);
      message.error('Không thể tải thông tin học sinh');
      return null;
    }
  }, []);

  // Add student
  const addStudent = useCallback(async (data: AddStudentRequest) => {
    try {
      const response = await teacherService.addStudent(data);
      if (response.success) {
        message.success(response.message || 'Thêm học sinh thành công');
        await loadStudents(); // Refresh list
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error adding student:', error);
      message.error(error.response?.data?.message || 'Không thể thêm học sinh');
      return false;
    }
  }, [loadStudents]);

  // Remove student
  const removeStudent = useCallback(async (studentUid: string, courseUid: string) => {
    try {
      const response = await teacherService.removeStudent(studentUid, courseUid);
      if (response.success) {
        message.success(response.message || 'Đã xóa học sinh khỏi lớp');
        await loadStudents(); // Refresh list
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error removing student:', error);
      message.error(error.response?.data?.message || 'Không thể xóa học sinh');
      return false;
    }
  }, [loadStudents]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle course filter
  const handleCourseFilter = useCallback((courseUid: string | undefined) => {
    setSelectedCourse(courseUid);
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Initial load
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return {
    loading,
    students,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    searchQuery,
    selectedCourse,
    loadStudents,
    getStudentDetail,
    addStudent,
    removeStudent,
    handleSearch,
    handleCourseFilter,
    handlePageChange
  };
};

// ===========================
// STUDENT PROGRESS HOOK
// ===========================

export const useStudentProgress = (studentUid: string, courseUid?: string) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<CourseProgress[]>([]);

  const loadProgress = useCallback(async () => {
    if (!studentUid) return;

    setLoading(true);
    try {
      const response = await teacherService.getStudentProgress(studentUid, courseUid);
      if (response.success) {
        setProgress(response.data);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      message.error('Không thể tải tiến độ học sinh');
    } finally {
      setLoading(false);
    }
  }, [studentUid, courseUid]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    loading,
    progress,
    loadProgress
  };
};

// ===========================
// CONVERSATIONS HOOK
// ===========================

export const useTeacherConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Load conversations
  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await teacherService.getConversations({
        page: currentPage,
        limit: pageSize
      });

      if (response.success) {
        setConversations(response.conversations);
        setTotalItems(response.pagination.totalItems);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      message.error('Không thể tải danh sách hội thoại');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // Load messages
  const loadMessages = useCallback(async (conversationUid: string) => {
    setLoading(true);
    try {
      const response = await teacherService.getMessages(conversationUid, {
        page: 1,
        limit: 100
      });

      if (response.success) {
        setMessages(response.messages);
        
        // Mark as read
        await teacherService.markAsRead(conversationUid);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      message.error('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  }, []);

  // Select conversation
  const selectConversation = useCallback(async (conversation: ConversationDto) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.conversationUid);
  }, [loadMessages]);

  // Create conversation
  const createConversation = useCallback(async (data: CreateConversationRequest) => {
    try {
      const response = await teacherService.createConversation(data);
      if (response.success) {
        message.success(response.message || 'Tạo hội thoại thành công');
        await loadConversations(); // Refresh list
        return response.data.conversationUid;
      }
      return null;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      message.error(error.response?.data?.message || 'Không thể tạo hội thoại');
      return null;
    }
  }, [loadConversations]);

  // Send message
  const sendMessage = useCallback(async (conversationUid: string, content: string) => {
    try {
      const request: SendMessageRequest = { content };
      const response = await teacherService.sendMessage(conversationUid, request);
      
      if (response.success) {
        await loadMessages(conversationUid); // Refresh messages
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error sending message:', error);
      message.error(error.response?.data?.message || 'Không thể gửi tin nhắn');
      return false;
    }
  }, [loadMessages]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    loading,
    conversations,
    selectedConversation,
    messages,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    loadConversations,
    loadMessages,
    selectConversation,
    createConversation,
    sendMessage,
    handlePageChange
  };
};

// ===========================
// DASHBOARD STATS HOOK
// ===========================

export const useTeacherDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await teacherService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      message.error('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    loading,
    stats,
    loadStats
  };
};

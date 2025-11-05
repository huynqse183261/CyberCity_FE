import axiosInstance from '../api/axiosInstance';

export type CourseProgress = {
  courseUid: string;
  courseTitle: string;
  completedSubtopics: number;
  totalSubtopics: number;
  progressPercentage: number;
  quizzes: {
    completed: number;
    total: number;
    averageScore: number;
  };
};

export type LessonProgress = {
  lessonUid: string;
  lessonTitle: string;
  completedSubtopics: number;
  totalSubtopics: number;
  progressPercentage: number;
  quiz?: {
    quizUid: string;
    completed: boolean;
    score: number;
    lastAttempt: string;
  };
};

export const progressService = {
  // GET /api/student/users/me/progress/courses/{courseUid}
  async getCourseProgress(courseUid: string): Promise<CourseProgress> {
    const res = await axiosInstance.get(`/api/student/users/me/progress/courses/${courseUid}`);
    return res.data?.data ?? res.data;
  },

  // GET /api/student/users/me/progress/lessons/{lessonUid}
  async getLessonProgress(lessonUid: string): Promise<LessonProgress> {
    const res = await axiosInstance.get(`/api/student/users/me/progress/lessons/${lessonUid}`);
    return res.data?.data ?? res.data;
  },
};

export default progressService;


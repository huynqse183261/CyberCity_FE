import axiosInstance from '../api/axiosInstance';

export type CourseSummary = {
  uid: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl?: string;
};

export type Subtopic = {
  uid: string;
  title: string;
  orderIndex: number;
  contentHtml?: string;
};

export type Topic = {
  uid: string;
  title: string;
  orderIndex: number;
  subtopics: Subtopic[];
};

export type Lesson = {
  uid: string;
  title: string;
  orderIndex: number;
  topics: Topic[];
};

export type Module = {
  uid: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
};

export type CourseOutline = {
  course: CourseSummary;
  modules: Module[];
};

export const contentService = {
  // GET /api/student/courses
  async listCourses(params?: { category?: 'linux' | 'pentest' }): Promise<CourseSummary[]> {
    const res = await axiosInstance.get('/api/student/courses', { params });
    return res.data?.data ?? res.data;
  },

  // GET /api/student/courses/slug/{slug}/outline
  async getCourseOutlineBySlug(slug: string): Promise<CourseOutline> {
    const res = await axiosInstance.get(`/api/student/courses/slug/${slug}/outline`);
    return res.data?.data ?? res.data;
  },

  // GET /api/student/courses/{courseUid}/outline
  async getCourseOutlineByUid(courseUid: string): Promise<CourseOutline> {
    const res = await axiosInstance.get(`/api/student/courses/${courseUid}/outline`);
    return res.data?.data ?? res.data;
  },

  // GET /api/student/lessons/{lessonUid}
  async getLesson(lessonUid: string): Promise<Lesson> {
    const res = await axiosInstance.get(`/api/student/lessons/${lessonUid}`);
    return res.data?.data ?? res.data;
  },

  // GET /api/student/topics/{topicUid}
  async getTopic(topicUid: string): Promise<Topic> {
    const res = await axiosInstance.get(`/api/student/topics/${topicUid}`);
    return res.data?.data ?? res.data;
  },

  // GET /api/student/subtopics/{subtopicUid}
  async getSubtopic(subtopicUid: string): Promise<Subtopic> {
    const res = await axiosInstance.get(`/api/student/subtopics/${subtopicUid}`);
    return res.data?.data ?? res.data;
  },

  // POST /api/student/subtopics/{subtopicUid}/progress
  async updateSubtopicProgress(subtopicUid: string, progress: number): Promise<{ subtopicUid: string; progress: number; updatedAt: string }> {
    const res = await axiosInstance.post(`/api/student/subtopics/${subtopicUid}/progress`, { progress });
    return res.data?.data ?? res.data;
  },

  // POST /api/student/courses/{courseUid}/enroll
  async enrollCourse(courseUid: string): Promise<{ message: string; courseUid: string; enrolledAt: string }> {
    const res = await axiosInstance.post(`/api/student/courses/${courseUid}/enroll`);
    return res.data?.data ?? res.data;
  },

  // GET /api/student/users/me/enrollments
  async getMyEnrollments(params?: { category?: 'linux' | 'pentest' }): Promise<Array<{
    enrollmentUid: string | null;
    courseUid: string;
    courseSlug: string;
    courseTitle: string;
    enrolledAt: string;
  }>> {
    const res = await axiosInstance.get('/api/student/users/me/enrollments', { params });
    return res.data?.data ?? res.data;
  },
};

export default contentService;



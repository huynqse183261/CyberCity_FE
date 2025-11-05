import axiosInstance from '../api/axiosInstance';

export type QuizSummary = {
  uid: string;
  title: string;
  description?: string;
  lessonUid?: string;
  moduleUid?: string;
  numQuestions: number;
  timeLimitSeconds?: number;
};

export type QuizAnswer = {
  uid: string;
  content: string;
  isCorrect?: boolean; // không trả về trong đề thi cho thí sinh
};

export type QuizQuestion = {
  uid: string;
  content: string;
  orderIndex: number;
  answers: QuizAnswer[];
  multipleChoice?: boolean;
};

export type QuizDetail = {
  uid: string;
  title: string;
  description?: string;
  timeLimitSeconds?: number;
  questions: QuizQuestion[];
};

export type QuizSubmissionRequest = {
  quizUid: string;
  answers: Array<{
    questionUid: string;
    selectedAnswerUids: string[]; // hỗ trợ trắc nghiệm nhiều đáp án
  }>;
};

export type QuizSubmissionResult = {
  submissionUid: string;
  score: number; // 0..100
  correctCount: number;
  totalQuestions: number;
  startedAt: string;
  submittedAt: string;
  breakdown?: Array<{
    questionUid: string;
    isCorrect: boolean;
    correctAnswerUids?: string[]; // chỉ trả về nếu policy cho phép lộ đáp án
  }>;
};

export const quizService = {
  // GET /api/student/quizzes
  async listQuizzes(params: { courseSlug?: string; moduleUid?: string; lessonUid?: string }): Promise<QuizSummary[]> {
    const res = await axiosInstance.get('/api/student/quizzes', { params });
    return res.data?.data ?? res.data;
  },

  // GET /api/student/quizzes/{quizUid}
  async getQuiz(quizUid: string): Promise<QuizDetail> {
    const res = await axiosInstance.get(`/api/student/quizzes/${quizUid}`);
    return res.data?.data ?? res.data;
  },

  // POST /api/student/quiz-submissions
  async submitQuiz(payload: QuizSubmissionRequest): Promise<QuizSubmissionResult> {
    const res = await axiosInstance.post('/api/student/quiz-submissions', payload);
    return res.data?.data ?? res.data;
  },

  // GET /api/student/quiz-submissions/{submissionUid}
  async getQuizSubmission(submissionUid: string): Promise<QuizSubmissionResult & {
    quizTitle: string;
    breakdown?: Array<{
      questionUid: string;
      questionContent: string;
      isCorrect: boolean;
      selectedAnswerUids: string[];
      correctAnswerUids?: string[];
    }>;
  }> {
    const res = await axiosInstance.get(`/api/student/quiz-submissions/${submissionUid}`);
    return res.data?.data ?? res.data;
  },
};

export default quizService;



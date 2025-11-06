import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import { type QuizSubmissionRequest } from '../services/quizService';
import {
  useCourseOutlineBySlug,
  useCourseOutlineByUid,
  useSubtopic,
  usePrefetchSubtopic,
  useUpdateSubtopicProgress,
  useQuizzesByModule,
  useQuiz,
  usePrefetchQuiz,
  useModuleAccess,
} from '../hooks/useCourseContent';
import quizService from '../services/quizService';
import '../styles/LinuxLabPage.css';
import '../styles/ModuleDetailPage.css';

const ModuleDetailPage: React.FC = () => {
  const { moduleIndex, courseUid } = useParams<{ moduleIndex: string; courseUid?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract courseSlug from path (/linux/module/1 or /pentest/module/1 or /linux/course/:courseUid/module/1)
  const courseSlug = location.pathname.includes('/linux/') ? 'linux' : 'pentest';
  const { user: currentUser } = useAuth();
  
  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  const [currentSection, setCurrentSection] = useState<'theory' | 'quiz'>('theory');
  const [selectedSubtopicUid, setSelectedSubtopicUid] = useState<string | null>(null);
  const [selectedQuizUid, setSelectedQuizUid] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{[questionUid: string]: string[]}>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [quizInstantResult, setQuizInstantResult] = useState<{ [questionUid: string]: 'correct' | 'incorrect' | null }>({});
  
  // Memoize module index
  const moduleIdx = useMemo(() => {
    return moduleIndex ? parseInt(moduleIndex) - 1 : -1;
  }, [moduleIndex]);

  // React Query hooks cho course outline
  const { data: outlineBySlug, isLoading: loadingOutlineBySlug } = useCourseOutlineBySlug(
    courseSlug,
    !courseUid && !!courseSlug
  );
  const { data: outlineByUid, isLoading: loadingOutlineByUid } = useCourseOutlineByUid(
    courseUid,
    !!courseUid
  );
  
  // Combine outline data
  const outline = outlineByUid || outlineBySlug || null;
  const loadingOutline = courseUid ? loadingOutlineByUid : loadingOutlineBySlug;
  
  // Get current module from outline
  const currentModule = useMemo(() => {
    if (!outline || moduleIdx < 0 || !outline.modules?.[moduleIdx]) {
      return null;
    }
    return outline.modules[moduleIdx];
  }, [outline, moduleIdx]);

  // Check module access
  const { data: accessData } = useModuleAccess(
    courseUid,
    moduleIdx,
    !!courseUid && moduleIdx >= 0
  );
  const hasAccess = useMemo(() => {
    return accessData?.success ? (accessData.data?.canAccess ?? true) : true;
  }, [accessData]);
  const accessError = useMemo(() => {
    return accessData?.success && !accessData.data?.canAccess 
      ? accessData.data?.reason || 'Bạn không có quyền truy cập module này.'
      : null;
  }, [accessData]);

  // Get quizzes for current module
  const { data: quizzes = [] } = useQuizzesByModule(
    currentModule?.uid,
    courseSlug,
    !!currentModule
  );

  // Get selected quiz
  const { data: selectedQuiz } = useQuiz(selectedQuizUid, !!selectedQuizUid);

  // Get selected subtopic with lazy loading
  const { data: subtopicData, isLoading: loadingSubtopic } = useSubtopic(
    selectedSubtopicUid,
    !!selectedSubtopicUid
  );

  // Prefetch hooks
  const prefetchSubtopic = usePrefetchSubtopic();
  const prefetchQuiz = usePrefetchQuiz();

  // Update progress mutation
  const updateProgressMutation = useUpdateSubtopicProgress();
  
  // Find subtopic in outline for immediate display
  const selectedSubtopic = useMemo(() => {
    if (subtopicData) {
      return subtopicData; // Use API data if available
    }
    // Fallback to outline data for immediate display
    if (selectedSubtopicUid && currentModule) {
      for (const lesson of currentModule.lessons || []) {
        for (const topic of lesson.topics || []) {
          const subtopic = topic.subtopics?.find(s => s.uid === selectedSubtopicUid);
          if (subtopic) {
            return subtopic;
          }
        }
      }
    }
    return null;
  }, [subtopicData, selectedSubtopicUid, currentModule]);

  const loading = loadingOutline;
  const error = useMemo(() => {
    if (!courseSlug || !moduleIndex) {
      return 'Không tìm thấy thông tin khóa học';
    }
    if (!loading && !outline) {
      return 'Không thể tải dữ liệu khóa học';
    }
    if (!loading && !currentModule) {
      return 'Không tìm thấy module';
    }
    return null;
  }, [courseSlug, moduleIndex, loading, outline, currentModule]);

  // Update progress when subtopic is loaded
  useEffect(() => {
    if (subtopicData && selectedSubtopicUid) {
      // Update progress to 100% when user reads subtopic
      updateProgressMutation.mutate({
        subtopicUid: selectedSubtopicUid,
        progress: 100,
      });
    }
  }, [subtopicData, selectedSubtopicUid, updateProgressMutation]);

  // Memoized handlers
  const handleSubtopicClick = useCallback((subtopicUid: string) => {
    if (!subtopicUid || loadingSubtopic) {
      return;
    }
    setSelectedSubtopicUid(subtopicUid);
  }, [loadingSubtopic]);

  // Prefetch subtopic on hover
  const handleSubtopicHover = useCallback((subtopicUid: string) => {
    prefetchSubtopic(subtopicUid);
  }, [prefetchSubtopic]);

  const handleQuizClick = useCallback((quizUid: string) => {
    setSelectedQuizUid(quizUid);
    setQuizAnswers({});
    setQuizScore(null);
    setShowQuizResult(false);
    setQuizInstantResult({});
  }, []);

  // Prefetch quiz on hover
  const handleQuizHover = useCallback((quizUid: string) => {
    prefetchQuiz(quizUid);
  }, [prefetchQuiz]);

  const handleQuizAnswerChange = useCallback((questionUid: string, answerUid: string, isMultiple: boolean) => {
    setQuizAnswers(prev => {
      const currentAnswers = prev[questionUid] || [];
      let nextAnswers: string[];
      if (isMultiple) {
        // Toggle answer for multiple choice
        if (currentAnswers.includes(answerUid)) {
          nextAnswers = currentAnswers.filter(a => a !== answerUid);
        } else {
          nextAnswers = [...currentAnswers, answerUid];
        }
      } else {
        // Single choice - replace
        nextAnswers = [answerUid];
      }

      // Đánh giá đúng/sai tức thì dựa trên dữ liệu isCorrect từ selectedQuiz
      try {
        if (selectedQuiz) {
          const question = selectedQuiz.questions.find(q => q.uid === questionUid);
          if (question) {
            const correctUids = (question.answers || []).filter(a => a.isCorrect).map(a => a.uid).sort();
            const picked = nextAnswers.slice().sort();

            if (!question.multipleChoice) {
              // Single choice: chỉ cần đáp án được chọn là đúng thì Đúng, ngược lại Sai
              const selectedIsCorrect = (question.answers || []).some(a => a.uid === answerUid && a.isCorrect);
              setQuizInstantResult(prevRes => ({
                ...prevRes,
                [questionUid]: selectedIsCorrect ? 'correct' : 'incorrect'
              }));
            } else {
              // Multiple choice:
              // - Nếu có bất kỳ lựa chọn nào thuộc tập đáp án sai -> Sai ngay
              const pickedHasWrong = picked.some(uid => !correctUids.includes(uid));
              if (pickedHasWrong) {
                setQuizInstantResult(prevRes => ({ ...prevRes, [questionUid]: 'incorrect' }));
              } else {
                // - Nếu tất cả lựa chọn đều thuộc tập đúng và số lượng bằng tập đúng -> Đúng
                const isExactlyCorrect = picked.length > 0 && JSON.stringify(correctUids) === JSON.stringify(picked);
                // - Nếu mới chọn một phần đúng (subset) -> chưa kết luận
                setQuizInstantResult(prevRes => ({
                  ...prevRes,
                  [questionUid]: isExactlyCorrect ? 'correct' : null
                }));
              }
            }
          }
        }
      } catch (e) {
        // Bỏ qua lỗi đánh giá tức thì
      }

      return {
        ...prev,
        [questionUid]: nextAnswers
      };
    });
  }, [selectedQuiz]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!selectedQuiz) return;

    try {
      const submission: QuizSubmissionRequest = {
        quizUid: selectedQuiz.uid,
        answers: Object.entries(quizAnswers).map(([questionUid, answerUids]) => ({
          questionUid,
          selectedAnswerUids: answerUids
        }))
      };

      const result = await quizService.submitQuiz(submission);
      setQuizScore(result.score);
      setShowQuizResult(true);
      
      // Lưu submissionUid để có thể xem lại sau
      if (result.submissionUid) {
        // Có thể lưu vào state hoặc localStorage nếu cần
      }
    } catch (err) {
      // Fallback chấm tạm trên client nếu API chưa sẵn (dev only)
      try {
        const totalQuestions = selectedQuiz.questions.length;
        let correctCount = 0;
        for (const q of selectedQuiz.questions) {
          const correct = (q.answers || []).filter(a => a.isCorrect).map(a => a.uid).sort();
          const picked = (quizAnswers[q.uid] || []).slice().sort();
          if (correct.length > 0 && JSON.stringify(correct) === JSON.stringify(picked)) {
            correctCount += 1;
          }
        }
        if (totalQuestions > 0) {
          const score = Math.round((correctCount / totalQuestions) * 100);
          setQuizScore(score);
          setShowQuizResult(true);
          return;
        }
      } catch (e) {
        // Local grading failed
      }
      alert('Không thể nộp bài quiz. Vui lòng thử lại.');
    }
  }, [selectedQuiz, quizAnswers]);

  if (loading) {
    return (
      <div className="linux-lab-page">
        <nav className="navigation">
          <div className="nav-container">
            <LinuxLabNavigation />
            <UserDropdown user={user} />
          </div>
        </nav>
        <div className="loading-container">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Hiển thị access error nếu không có quyền
  if (!hasAccess && accessError) {
    return (
      <div className="linux-lab-page">
        <nav className="navigation">
          <div className="nav-container">
            <LinuxLabNavigation />
            <UserDropdown user={user} />
          </div>
        </nav>
        <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ 
            padding: '2rem', background: 'rgba(255, 68, 68, 0.1)', 
            border: '2px solid rgba(255, 68, 68, 0.3)', 
            borderRadius: '20px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: '#ff4444', marginBottom: '1rem' }}>🔒 Khóa học nâng cao</h2>
            <p style={{ color: '#b8c5d1', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              {accessError}
            </p>
            <p style={{ color: '#b8c5d1', marginBottom: '1.5rem' }}>
              Module này chỉ dành cho học viên đã mua gói. Vui lòng mua gói để tiếp tục học.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn pentest-btn" 
                onClick={() => navigate('/student/pricing')}
                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              >
                Mua gói học ngay →
              </button>
              {courseUid && (
                <button 
                  className="btn ai-btn" 
                  onClick={() => navigate(`/${courseSlug}/course/${courseUid}`)}
                  style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                >
                  ← Quay lại khóa học
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentModule) {
    return (
      <div className="linux-lab-page">
        <nav className="navigation">
          <div className="nav-container">
            <LinuxLabNavigation />
            <UserDropdown user={user} />
          </div>
        </nav>
        <div className="error-container">
          <p>{error || 'Không tìm thấy module'}</p>
          <button onClick={() => navigate(`/${courseSlug}`)}>Quay lại khóa học</button>
        </div>
      </div>
    );
  }

  const courseTitle = courseSlug === 'linux' ? 'Linux' : 'Penetration Testing';

  return (
    <div className="linux-lab-page">
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      <div className="lesson-bar">
        {currentModule.title} - {courseTitle}
      </div>

      {/* Navigation Tabs */}
      <div className="module-tabs">
        <button 
          className={`tab-button ${currentSection === 'theory' ? 'active' : ''}`}
          onClick={() => setCurrentSection('theory')}
        >
          📚 Lý thuyết
        </button>
        <button 
          className={`tab-button ${currentSection === 'quiz' ? 'active' : ''}`}
          onClick={() => setCurrentSection('quiz')}
        >
          🧠 Quiz
        </button>
      </div>

      <main className="body-container">
        {/* Theory Section */}
        {currentSection === 'theory' && (
          <div className="module-theory-section">
            <div className="theory-sidebar">
              <h3>Nội dung module</h3>
              <div className="theory-tree">
                {(currentModule.lessons || []).map((lesson) => (
                  <div key={lesson.uid} className="lesson-item">
                    <h4>{lesson.title}</h4>
                    {(lesson.topics || []).map((topic) => (
                      <div key={topic.uid} className="topic-item">
                        <h5>{topic.title}</h5>
                        <ul className="subtopic-list">
                          {(topic.subtopics || []).map((subtopic) => {
                            return (
                              <li 
                                key={subtopic.uid}
                                className={`subtopic-item ${selectedSubtopic?.uid === subtopic.uid ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSubtopicClick(subtopic.uid);
                                }}
                                onMouseEnter={() => handleSubtopicHover(subtopic.uid)}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                }}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                              >
                                {subtopic.title}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="theory-content">
              {selectedSubtopic ? (
                <div className="subtopic-content">
                  <h2>{selectedSubtopic.title}</h2>
                  {loadingSubtopic ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <p>Đang tải nội dung...</p>
                    </div>
                  ) : selectedSubtopic.contentHtml ? (
                    <div 
                      className="subtopic-html-content"
                      dangerouslySetInnerHTML={{ __html: selectedSubtopic.contentHtml }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <p>Nội dung chưa có sẵn. Vui lòng thử lại sau.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="subtopic-placeholder">
                  <p>Chọn một bài học ở bên trái để bắt đầu</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {currentSection === 'quiz' && (
          <div className="module-quiz-section">
            {!selectedQuiz ? (
              <div className="quiz-list">
                <h2>Danh sách Quiz</h2>
                {quizzes.length > 0 ? (
                  <div className="quiz-cards">
                    {quizzes.map((quiz) => (
                      <div 
                        key={quiz.uid} 
                        className="quiz-card"
                        onClick={() => handleQuizClick(quiz.uid)}
                        onMouseEnter={() => handleQuizHover(quiz.uid)}
                      >
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description || 'Không có mô tả'}</p>
                        <div className="quiz-meta">
                          <span>Số câu hỏi: {quiz.numQuestions}</span>
                          {quiz.timeLimitSeconds && (
                            <span>Thời gian: {Math.floor(quiz.timeLimitSeconds / 60)} phút</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Chưa có quiz nào cho module này</p>
                )}
              </div>
            ) : (
              <div className="quiz-detail">
                <div className="quiz-header">
                  <button onClick={() => setSelectedQuizUid(null)}>← Quay lại danh sách</button>
                  <h2>{selectedQuiz.title}</h2>
                  {selectedQuiz.description && <p>{selectedQuiz.description}</p>}
                  {selectedQuiz.timeLimitSeconds && (
                    <p>Thời gian: {Math.floor(selectedQuiz.timeLimitSeconds / 60)} phút</p>
                  )}
                </div>

                {!showQuizResult ? (
                  <div className="quiz-questions">
                    {selectedQuiz.questions.map((question, idx) => (
                      <div key={question.uid} className="question-item">
                        <h3>
                          Câu {idx + 1}: {question.content}
                        </h3>
                        <div className="question-answers">
                          {question.answers.map((answer) => {
                            const isSelected = (quizAnswers[question.uid] || []).includes(answer.uid);
                            const color = isSelected ? (answer.isCorrect ? '#16a34a' : '#dc2626') : undefined;
                            return (
                              <label 
                                key={answer.uid}
                                className={`answer-option ${question.multipleChoice ? 'multiple' : 'single'}`}
                                style={{ color }}
                              >
                                <input
                                  type={question.multipleChoice ? 'checkbox' : 'radio'}
                                  name={`question-${question.uid}`}
                                  checked={isSelected}
                                  onChange={() => handleQuizAnswerChange(
                                    question.uid, 
                                    answer.uid, 
                                    question.multipleChoice || false
                                  )}
                                />
                                <span>{answer.content}</span>
                              </label>
                            );
                          })}
                        </div>
                        {quizInstantResult[question.uid] && (
                          <div style={{ marginTop: 8, fontWeight: 600, color: quizInstantResult[question.uid] === 'correct' ? '#16a34a' : '#dc2626' }}>
                            {quizInstantResult[question.uid] === 'correct' ? 'Kết quả: Đúng' : 'Kết quả: Sai'}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="quiz-actions">
                      <button 
                        className="submit-quiz-btn"
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(quizAnswers).length === 0}
                      >
                        Nộp bài
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-result">
                    <h2>Kết quả Quiz</h2>
                    <div className="quiz-score">
                      <p>Điểm số: {quizScore}%</p>
                      <div className="score-bar">
                        <div 
                          className="score-fill" 
                          style={{ width: `${quizScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <button onClick={() => {
                      setSelectedQuizUid(null);
                      setQuizAnswers({});
                      setQuizScore(null);
                      setShowQuizResult(false);
                    }}>
                      Làm lại quiz khác
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModuleDetailPage;


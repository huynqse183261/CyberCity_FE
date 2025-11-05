import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import contentService, { type CourseOutline, type Module as ModuleType, type Subtopic } from '../services/contentService';
import quizService, { type QuizSummary, type QuizDetail, type QuizSubmissionRequest } from '../services/quizService';
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
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleType | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetail | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{[questionUid: string]: string[]}>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSubtopic, setLoadingSubtopic] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseSlug || !moduleIndex) {
      setError('Không tìm thấy thông tin khóa học');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const moduleIdx = parseInt(moduleIndex) - 1; // Convert 1-based to 0-based

        // Load course outline - dùng courseUid nếu có, nếu không dùng slug
        let courseOutline: CourseOutline;
        if (courseUid) {
          // Load outline theo courseUid (từ CourseDetailPage)
          courseOutline = await contentService.getCourseOutlineByUid(courseUid);
        } else {
          // Load outline theo slug (từ route cũ)
          courseOutline = await contentService.getCourseOutlineBySlug(courseSlug);
        }
        setOutline(courseOutline);

        // Find current module
        if (courseOutline.modules && courseOutline.modules[moduleIdx]) {
          const module = courseOutline.modules[moduleIdx];
          setCurrentModule(module);

          // Load quizzes for this module
          const moduleQuizzes = await quizService.listQuizzes({ 
            courseSlug, 
            moduleUid: module.uid 
          });
          setQuizzes(moduleQuizzes);
        } else {
          setError('Không tìm thấy module');
        }
      } catch (err) {
        console.error('Error loading module data:', err);
        setError('Không thể tải dữ liệu module');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseSlug, moduleIndex, courseUid, location.pathname]);

  const handleSubtopicClick = async (subtopicUid: string) => {
    console.log('handleSubtopicClick called with:', subtopicUid);
    console.log('currentModule:', currentModule);
    console.log('loadingSubtopic:', loadingSubtopic);
    
    // Prevent multiple clicks
    if (loadingSubtopic) {
      console.log('Already loading, skipping...');
      return;
    }
    
    if (!subtopicUid) {
      console.error('No subtopicUid provided');
      return;
    }
    
    setLoadingSubtopic(true);
    
    try {
      // Find subtopic in current module để hiển thị ngay
      let foundSubtopic = null;
      if (currentModule) {
        console.log('Searching in currentModule.lessons:', currentModule.lessons);
        for (const lesson of currentModule.lessons || []) {
          console.log('Checking lesson:', lesson.title, 'topics:', lesson.topics);
          for (const topic of lesson.topics || []) {
            console.log('Checking topic:', topic.title, 'subtopics:', topic.subtopics);
            const subtopic = topic.subtopics?.find(s => s.uid === subtopicUid);
            if (subtopic) {
              console.log('Found subtopic in outline:', subtopic);
              foundSubtopic = subtopic;
              // Set ngay để hiển thị title
              setSelectedSubtopic(subtopic);
              break;
            }
          }
          if (foundSubtopic) break;
        }
      }
      
      // Load full content from API
      try {
        console.log('Fetching subtopic from API:', subtopicUid);
        const fullSubtopic = await contentService.getSubtopic(subtopicUid);
        console.log('Loaded subtopic from API:', fullSubtopic);
        setSelectedSubtopic(fullSubtopic);
        
        // Cập nhật progress khi người dùng đọc subtopic (100% khi đọc xong)
        try {
          await contentService.updateSubtopicProgress(subtopicUid, 100);
        } catch (progressErr) {
          console.error('Error updating progress:', progressErr);
          // Không block nếu cập nhật progress thất bại
        }
      } catch (apiErr: any) {
        console.error('Error loading subtopic from API:', apiErr);
        // Nếu API lỗi nhưng đã có subtopic từ outline, vẫn hiển thị
        if (foundSubtopic) {
          console.log('Using subtopic from outline since API failed');
        } else if (apiErr?.response?.status !== 404) {
          alert('Không thể tải nội dung bài học. Vui lòng thử lại.');
        }
      }
    } catch (err) {
      console.error('Error loading subtopic:', err);
      alert('Không thể tải nội dung bài học. Vui lòng thử lại.');
    } finally {
      setLoadingSubtopic(false);
    }
  };

  const handleQuizClick = async (quizUid: string) => {
    try {
      const quiz = await quizService.getQuiz(quizUid);
      setSelectedQuiz(quiz);
      setQuizAnswers({});
      setQuizScore(null);
      setShowQuizResult(false);
    } catch (err) {
      console.error('Error loading quiz:', err);
    }
  };

  const handleQuizAnswerChange = (questionUid: string, answerUid: string, isMultiple: boolean) => {
    setQuizAnswers(prev => {
      const currentAnswers = prev[questionUid] || [];
      if (isMultiple) {
        // Toggle answer for multiple choice
        if (currentAnswers.includes(answerUid)) {
          return {
            ...prev,
            [questionUid]: currentAnswers.filter(a => a !== answerUid)
          };
        } else {
          return {
            ...prev,
            [questionUid]: [...currentAnswers, answerUid]
          };
        }
      } else {
        // Single choice - replace
        return {
          ...prev,
          [questionUid]: [answerUid]
        };
      }
    });
  };

  const handleSubmitQuiz = async () => {
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
        console.log('Quiz submitted:', result.submissionUid);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('Không thể nộp bài quiz. Vui lòng thử lại.');
    }
  };

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
                            console.log('Rendering subtopic:', subtopic.uid, subtopic.title);
                            return (
                              <li 
                                key={subtopic.uid}
                                className={`subtopic-item ${selectedSubtopic?.uid === subtopic.uid ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('Subtopic clicked:', subtopic.uid, subtopic.title);
                                  handleSubtopicClick(subtopic.uid);
                                }}
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
                  <button onClick={() => setSelectedQuiz(null)}>← Quay lại danh sách</button>
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
                          {question.answers.map((answer) => (
                            <label 
                              key={answer.uid}
                              className={`answer-option ${question.multipleChoice ? 'multiple' : 'single'}`}
                            >
                              <input
                                type={question.multipleChoice ? 'checkbox' : 'radio'}
                                name={`question-${question.uid}`}
                                checked={quizAnswers[question.uid]?.includes(answer.uid) || false}
                                onChange={() => handleQuizAnswerChange(
                                  question.uid, 
                                  answer.uid, 
                                  question.multipleChoice || false
                                )}
                              />
                              <span>{answer.content}</span>
                            </label>
                          ))}
                        </div>
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
                      setSelectedQuiz(null);
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


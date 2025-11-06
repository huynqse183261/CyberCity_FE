import React, { useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import { type Module as ModuleType } from '../services/contentService';
import { useCourseOutlineByUid, usePrefetchCourseOutline } from '../hooks/useCourseContent';
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess';
import '../styles/LinuxLabPage.css';
import '../styles/CourseDetailPage.css';

const CourseDetailPage: React.FC = () => {
  const { courseUid } = useParams<{ courseUid: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract courseSlug from path để xác định category
  const courseSlug = location.pathname.includes('/linux/') ? 'linux' : 'pentest';
  const { user: currentUser } = useAuth();

  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  // React Query hook cho course outline
  const { data: outline, isLoading: loading, error: outlineError } = useCourseOutlineByUid(courseUid, !!courseUid);
  
  // Prefetch hook
  const { prefetchByUid } = usePrefetchCourseOutline();
  
  // Use subscription access hook
  const { canViewAllModules, maxFreeModules, subscriptionInfo, loading: subscriptionLoading } = useSubscriptionAccess();
  const hasSubscription = canViewAllModules;

  // Memoized error
  const error = useMemo(() => {
    if (!courseUid) {
      return 'Không tìm thấy thông tin khóa học';
    }
    if (outlineError) {
      return 'Không thể tải dữ liệu khóa học';
    }
    if (!loading && !outline) {
      return 'Không tìm thấy khóa học';
    }
    return null;
  }, [courseUid, outlineError, loading, outline]);

  // Memoized filtered modules
  const filteredModules = useMemo(() => {
    if (!outline?.modules) {
      return [];
    }
    return outline.modules.filter((_, idx: number) => hasSubscription || idx < maxFreeModules);
  }, [outline, hasSubscription, maxFreeModules]);

  // Memoized handler
  const handleModuleClick = useCallback((moduleIndex: number) => {
    if (!courseUid) return;
    // Prefetch module outline before navigation
    prefetchByUid(courseUid);
    navigate(`/${courseSlug}/course/${courseUid}/module/${moduleIndex + 1}`);
  }, [courseUid, courseSlug, navigate, prefetchByUid]);

  // Prefetch module on hover
  const handleModuleHover = useCallback(() => {
    if (courseUid) {
      prefetchByUid(courseUid);
    }
  }, [courseUid, prefetchByUid]);

  if (loading || subscriptionLoading) {
    return (
      <div className="linux-lab-page">
        <nav className="navigation">
          <div className="nav-container">
            <LinuxLabNavigation />
            <UserDropdown user={user} />
          </div>
        </nav>
        <div className="loading-container">
          <p>Đang tải dữ liệu khóa học...</p>
        </div>
      </div>
    );
  }

  if (error || !outline) {
    return (
      <div className="linux-lab-page">
        <nav className="navigation">
          <div className="nav-container">
            <LinuxLabNavigation />
            <UserDropdown user={user} />
          </div>
        </nav>
        <div className="error-container">
          <p>{error || 'Không tìm thấy khóa học'}</p>
          <button onClick={() => navigate(`/${courseSlug}`)}>Quay lại danh sách</button>
        </div>
      </div>
    );
  }

  return (
    <div className="linux-lab-page">
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      <div className="course-detail-header">
        <div className="course-detail-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0 }}>{outline.course.title}</h1>
            {hasSubscription && subscriptionInfo && (
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(0, 212, 255, 0.2)',
                border: '1px solid rgba(0, 212, 255, 0.5)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: '#00d4ff',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}>
                ✓ Đã mua gói
              </span>
            )}
          </div>
          <p className="course-description">{outline.course.description}</p>
          {hasSubscription && subscriptionInfo && (
            <p style={{ 
              color: '#00d4ff', 
              fontSize: '0.9rem', 
              marginTop: '0.5rem',
              marginBottom: '1rem'
            }}>
              Gói: {subscriptionInfo.planName} 
              {subscriptionInfo.daysRemaining !== null && subscriptionInfo.daysRemaining > 0 && (
                <span> • Còn {subscriptionInfo.daysRemaining} ngày</span>
              )}
            </p>
          )}
          <button 
            className="btn-back" 
            onClick={() => navigate(`/${courseSlug}`)}
          >
            ← Quay lại danh sách
          </button>
        </div>
      </div>

      <div className="container">
        <div className="section">
          <h2>📚 Nội Dung Khóa Học</h2>
          {outline?.modules && outline.modules.length > 0 ? (
            <>
              <div className="modules-list">
                {/* Filter modules: chỉ hiển thị 2 module đầu nếu chưa mua gói */}
                {filteredModules.map((module: ModuleType) => {
                    const originalIndex = outline?.modules?.findIndex(m => m.uid === module.uid) ?? -1;
                    return (
                      <div 
                        key={module.uid} 
                        className="module-card" 
                        onClick={() => handleModuleClick(originalIndex)}
                        onMouseEnter={handleModuleHover}
                      >
                        <div className="module-header">
                          <h3>Module {originalIndex + 1}: {module.title}</h3>
                          <button className="btn">Vào Module →</button>
                        </div>
                        {module.lessons && module.lessons.length > 0 && (
                          <div className="module-content-preview">
                            <h4>Bài học trong module:</h4>
                            <ul>
                              {module.lessons.slice(0, 3).map((lesson) => (
                                <li key={lesson.uid}>{lesson.title}</li>
                              ))}
                              {module.lessons.length > 3 && (
                                <li>... và {module.lessons.length - 3} bài học khác</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              
              {/* Hiển thị thông báo nếu chưa mua gói và có nhiều hơn 2 modules */}
              {!hasSubscription && outline?.modules && outline.modules.length > maxFreeModules && (
                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  background: 'rgba(255, 68, 68, 0.1)', 
                  border: '2px solid rgba(255, 68, 68, 0.3)', 
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>🔒 Khóa học nâng cao</h3>
                  <p style={{ color: '#b8c5d1', marginBottom: '1rem' }}>
                    Bạn đang xem {maxFreeModules} module đầu tiên miễn phí. Để xem toàn bộ {outline?.modules?.length || 0} modules, vui lòng mua gói học.
                  </p>
                  <button 
                    className="btn pentest-btn" 
                    onClick={() => navigate('/student/pricing')}
                    style={{ marginTop: '1rem' }}
                  >
                    Mua gói học ngay →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Khóa học này chưa có module nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;


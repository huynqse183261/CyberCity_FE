import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import contentService, { type CourseOutline, type Module as ModuleType } from '../services/contentService';
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

  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseUid) {
      setError('Không tìm thấy thông tin khóa học');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // Load course outline by courseUid
        const courseOutline = await contentService.getCourseOutlineByUid(courseUid);
        setOutline(courseOutline);
      } catch (err) {
        console.error('Error loading course outline:', err);
        setError('Không thể tải dữ liệu khóa học');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseUid]);

  const handleModuleClick = (moduleIndex: number) => {
    // Navigate to module detail page với courseUid
    navigate(`/${courseSlug}/course/${courseUid}/module/${moduleIndex + 1}`);
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
          <h1>{outline.course.title}</h1>
          <p className="course-description">{outline.course.description}</p>
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
          {outline.modules && outline.modules.length > 0 ? (
            <div className="modules-list">
              {outline.modules.map((module: ModuleType, idx: number) => (
                <div key={module.uid} className="module-card" onClick={() => handleModuleClick(idx)}>
                  <div className="module-header">
                    <h3>Module {idx + 1}: {module.title}</h3>
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
              ))}
            </div>
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


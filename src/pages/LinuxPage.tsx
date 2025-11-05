import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import '../styles/LinuxLabPage.css';
import contentService, { type CourseSummary } from '../services/contentService';

const LinuxPage: React.FC = () => {
  const headerProgress = 10;
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Transform AuthContext user to component user format
  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    contentService
      .listCourses({ category: 'linux' })
      .then((data) => {
        if (isMounted) {
          setCourses(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading courses:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="linux-lab-page">
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      <div className="linux-card-header">
        <div className="linux-card-left">
          <h1 className="linux-card-title">Khóa Học Linux</h1>
          <p className="linux-card-desc">Khóa học thực hành Linux từ cơ bản đến nâng cao, giúp bạn làm chủ hệ điều hành mã nguồn mở, sử dụng thành thạo terminal, quản trị hệ thống, bảo mật và DevOps.</p>
          <div className="linux-card-tags">
            <span className="linux-card-tag">Linux</span>
            <span className="linux-card-tag">Quản trị hệ thống</span>
            <span className="linux-card-tag">Dòng lệnh</span>
            <span className="linux-card-tag">DevOps</span>
          </div>
          <div className="linux-card-info">
            <span className="linux-card-author">Tác giả <b>namle</b></span>
            <span className="linux-card-students"><svg width="18" height="18" style={{ verticalAlign: 'middle' }}><circle cx="9" cy="9" r="8" fill="#00d4ff"/></svg> 12,345 Học viên</span>
            <span className="linux-card-rating">
              <span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">☆</span>
              <span className="linux-card-rating-value">4.0</span>
            </span>
          </div>
        </div>
        <div className="linux-card-right">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png" alt="Linux Tux" className="linux-card-img" />
        </div>
        <div className="linux-card-progress-bar">
          <div className="linux-card-progress" style={{ width: `${headerProgress}%` }}></div>
          <span className="linux-card-progress-label"></span>
        </div>
      </div>

      <div className="container">
        <div className="section">
          <h2>🚀 Giới Thiệu</h2>
          <div className="intro-grid">
            <div className="intro-item">
              <h3>📖 Giới Thiệu Sơ Qua</h3>
              <p>Linux là hệ điều hành mã nguồn mở mạnh mẽ, được sử dụng rộng rãi từ máy chủ web, siêu máy tính đến các thiết bị IoT. Với tính ổn định cao, bảo mật tốt và khả năng tùy chỉnh linh hoạt, Linux đã trở thành lựa chọn hàng đầu của các chuyên gia IT và lập trình viên trên toàn thế giới.</p>
            </div>
            <div className="intro-item">
              <h3>⚡ Đặc Trưng Cơ Bản Linux</h3>
              <p>• Mã nguồn mở và miễn phí<br/>• Đa nhiệm và đa người dùng<br/>• Bảo mật cao với hệ thống phân quyền<br/>• Ổn định và hiệu suất tối ưu<br/>• Hỗ trợ đa nền tảng phần cứng<br/>• Cộng đồng phát triển lớn mạnh</p>
            </div>
            <div className="intro-item">
              <h3>🌟 Ứng Dụng Của Linux</h3>
              <p>• Máy chủ web và cơ sở dữ liệu<br/>• Hệ thống embedded và IoT<br/>• Siêu máy tính và HPC<br/>• Desktop và máy trạm<br/>• Container và Cloud Computing<br/>• Phát triển phần mềm</p>
            </div>
            <div className="intro-item">
              <h3>🎯 Mục Tiêu Khóa Học</h3>
              <p>Khóa học giúp bạn nắm vững kiến thức Linux từ cơ bản đến nâng cao, có khả năng quản trị hệ thống, lập trình shell script, và triển khai các ứng dụng thực tế. Sau khóa học, bạn sẽ tự tin sử dụng Linux trong công việc và cuộc sống.</p>
            </div>
          </div>
          <div className="intro-item">
            <h3>💡 Lời Kết</h3>
            <p>Hành trình học Linux không chỉ là việc nắm bắt một hệ điều hành mà còn là cơ hội mở ra thế giới công nghệ rộng lớn. Hãy cùng chúng tôi khám phá sức mạnh của Linux và trở thành một chuyên gia công nghệ thực thụ!</p>
          </div>
        </div>

        <div className="section">
          <h2>📚 Danh Sách Bài Học</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Đang tải danh sách bài học...</p>
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Chưa có bài học nào.</p>
            </div>
          ) : (
            <div className="course-content">
              {courses.map((course: CourseSummary) => (
                <div className="module" key={course.uid}>
                  <h3>{course.title}</h3>
                  <div className="module-content">
                    <div className="topics">
                      <h4>📋 Mô tả:</h4>
                      <p style={{ color: '#b0b0b0', lineHeight: '1.6', marginBottom: '15px' }}>
                        {course.description}
                      </p>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div className="rating-comment">
                      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button 
                          className="btn" 
                          onClick={() => {
                            // Mỗi course là một bài học riêng
                            // Có thể tạo route mới để hiển thị outline của course này
                            // Tạm thời dùng slug để lấy outline, sau đó có thể dùng courseUid
                            navigate(`/linux/course/${course.uid}`);
                          }}
                        >
                          Vào bài học →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="footer">
          <h3>🎓 Hoàn Thành Khóa Học</h3>
          <p>Chúc mừng bạn đã hoàn thành hành trình học Linux! Hãy tiếp tục thực hành và khám phá thêm nhiều điều thú vị khác.</p>
          <button className="btn" style={{ marginTop: 20 }}>Nhận Chứng Chỉ</button>
        </div>
      </div>
    </div>
  );
};

export default LinuxPage;



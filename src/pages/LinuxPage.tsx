import React, { useEffect, useMemo, useState } from 'react';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import type { User } from '../models/LinuxLabTypes';
import '../styles/LinuxLabPage.css';

const LinuxPage: React.FC = () => {
  const [introProgress, setIntroProgress] = useState<number[]>([95, 88, 75, 65, 45, 30]);
  const headerProgress = 10;
  const [user] = useState<User>({ name: 'H', username: 'huy@linuxlab', avatar: 'H' });

  const modules = useMemo(() => [
    {
      title: 'Module 1: Làm Quen Với Linux',
      topics: [
        'Lịch sử và triết lý Linux',
        'Các bản phân phối phổ biến',
        'Cài đặt Ubuntu/CentOS',
        'Giao diện Desktop và Terminal',
        'Cấu trúc thư mục hệ thống',
        'Các lệnh cơ bản đầu tiên'
      ],
      progress: introProgress[0],
      rating: 5,
      commentPlaceholder: 'Chia sẻ cảm nhận của bạn về module này...'
    },
    {
      title: 'Module 2: Làm Chủ Terminal',
      topics: [
        'Navigating với cd, ls, pwd',
        'Quản lý file và thư mục',
        'Quyền truy cập và chmod',
        'Tìm kiếm với find và grep',
        'Xử lý text với sed, awk',
        'Pipes và redirection'
      ],
      progress: introProgress[1],
      rating: 4,
      commentPlaceholder: 'Terminal là trái tim của Linux...'
    },
    {
      title: 'Module 3: Quản Lý Hệ Thống',
      topics: [
        'Quản lý user và group',
        'Giám sát hệ thống với top, htop',
        'Quản lý process và service',
        'Cấu hình network',
        'Quản lý package',
        'Cron jobs và automation'
      ],
      progress: introProgress[2],
      rating: 5,
      commentPlaceholder: 'Quản trị hệ thống là kỹ năng cần thiết...'
    },
    {
      title: 'Module 4: Shell Scripting',
      topics: [
        'Bash scripting cơ bản',
        'Biến và tham số',
        'Vòng lặp và điều kiện',
        'Functions và arrays',
        'Xử lý input/output',
        'Debugging và best practices'
      ],
      progress: introProgress[3],
      rating: 4,
      commentPlaceholder: 'Shell script giúp tự động hóa công việc...'
    },
    {
      title: 'Module 5: Bảo Mật Linux',
      topics: [
        'SSH và khóa công khai',
        'Firewall với iptables/ufw',
        'SSL/TLS certificates',
        'Hardening hệ thống',
        'Backup và recovery',
        'Audit và monitoring'
      ],
      progress: introProgress[4],
      rating: 5,
      commentPlaceholder: 'Bảo mật là ưu tiên hàng đầu...'
    },
    {
      title: 'Module 6: Server và DevOps',
      topics: [
        'Web server (Apache, Nginx)',
        'Database server (MySQL, PostgreSQL)',
        'Container với Docker',
        'CI/CD pipeline',
        'Monitoring và logging',
        'Cloud deployment'
      ],
      progress: introProgress[5],
      rating: 4,
      commentPlaceholder: 'DevOps là tương lai của IT...'
    }
  ], [introProgress]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.module');
      let updated = [...introProgress];
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          updated[idx] = modules[idx]?.progress ?? updated[idx];
        }
      });
      setIntroProgress(updated);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [modules, introProgress]);

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
            <span className="linux-card-tag">linux</span>
            <span className="linux-card-tag">sysadmin</span>
            <span className="linux-card-tag">terminal</span>
            <span className="linux-card-tag">devops</span>
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
          <h2>📚 Nội Dung Khóa Học</h2>
          <div className="course-content">
            {modules.map((m, idx) => (
              <div className="module" key={m.title}>
                <h3>{m.title}</h3>
                <div className="module-content">
                  <div className="topics">
                    <h4>📋 Nội dung:</h4>
                    <ul>
                      {m.topics.map(topic => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${introProgress[idx]}%` }}></div>
                    </div>
                  </div>
                  <div className="rating-comment">
                    <div className="rating">
                      <h4>⭐ Đánh giá:</h4>
                      <div className="stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span className="star" key={i}>{i < m.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <h4>💬 Bình luận:</h4>
                    <textarea className="comment-box" placeholder={m.commentPlaceholder}></textarea>
                    <a className="btn" href={idx === 0 ? '/linux/module-1' : '#'}>{idx === 0 ? 'Vào Module 1' : 'Gửi bình luận'}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
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



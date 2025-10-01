import React, { useEffect, useRef, useState } from 'react';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import type { User } from '../models/LinuxLabTypes';
import '../styles/LinuxLabPage.css';

const LinuxModule1: React.FC = () => {
  const [user] = useState<User>({ name: 'H', username: 'huy@linuxlab', avatar: 'H' });
  const [progress, setProgress] = useState<number>(0);
  const [runLabel, setRunLabel] = useState<string>('▶ Chạy thử');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let width = 0;
    const id = setInterval(() => {
      width += 1;
      if (width >= 75) {
        clearInterval(id);
      }
      setProgress(Math.min(width, 75));
    }, 20);
    return () => clearInterval(id);
  }, []);

  const handleRun = () => {
    setRunLabel('⏳ Đang kiểm tra...');
    setTimeout(() => {
      if (terminalRef.current) {
        const newLine = document.createElement('div');
        newLine.innerHTML = '<div class="terminal-prompt">user@linux:~$ </div><div class="terminal-output">Hello, Linux World!</div>';
        terminalRef.current.appendChild(newLine);
      }
      setRunLabel('✓ Đúng!');
      setTimeout(() => setRunLabel('▶ Chạy thử'), 1500);
    }, 1200);
  };

  return (
    <div className="linux-lab-page">
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      <div className="lesson-bar">Module 1: Làm Quen Với Linux</div>

      <main className="body-container">
        <div className="lesson-column">
          <div className="user-info">
            <div className="user-avatar">🐧</div>
            <div className="user-details">
              <h3>Linux Learner</h3>
              <p>Đang học - 100 điểm</p>
            </div>
          </div>

          <div className="progress-info">
            <h4>Tiến độ học tập</h4>
            <div className="progress-bar lesson">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}% hoàn thành</p>
            <p>Thời gian: 45 phút</p>
          </div>

          <div className="lesson-section">
            <h2>📖 Bài tập</h2>
            <p>Bạn hãy đi vào các đoạn code thích hợp để chương trình hiển thị ra màn hình dòng chữ:</p>
            <div className="code-block"><pre><code>Hello, Linux World!</code></pre></div>
            <p>Hãy đọc phần lý thuyết và xem hướng dẫn để biết cách làm bài này!</p>
          </div>

          <div className="lesson-section">
            <h2>🧠 Lý thuyết</h2>
            <div className="theory-section">
              <h3>Giới thiệu về Linux</h3>
              <p>Linux là một hệ điều hành mã nguồn mở được phát triển bởi Linus Torvalds vào năm 1991. Đây là một trong những hệ điều hành phổ biến nhất trên thế giới, được sử dụng từ máy chủ web, siêu máy tính cho đến các thiết bị nhúng.</p>
            </div>
            <div className="theory-section">
              <h3>Cấu trúc cơ bản của Linux</h3>
              <p>Linux có cấu trúc phân lớp với <span className="highlight">Kernel</span> là lõi của hệ thống, quản lý phần cứng và cung cấp các dịch vụ cơ bản. Trên kernel là các <span className="highlight">System Services</span> và <span className="highlight">Applications</span>.</p>
            </div>
            <div className="code-block">
              <pre><code><span className="highlight">ls</span>        # Liệt kê files và thư mục
<span className="highlight">pwd</span>       # Hiển thị thư mục hiện tại  
<span className="highlight">cd</span>        # Chuyển đổi thư mục
<span className="highlight">mkdir</span>     # Tạo thư mục mới
<span className="highlight">touch</span>     # Tạo file mới
<span className="highlight">cat</span>       # Đọc nội dung file
<span className="highlight">echo</span>      # In text ra màn hình</code></pre>
            </div>
            <div className="theory-section">
              <h3>Lệnh echo cơ bản</h3>
              <p>Lệnh <span className="highlight">echo</span> được sử dụng để hiển thị text ra màn hình. Cú pháp cơ bản:</p>
              <div className="terminal">
                <div className="terminal-content" ref={terminalRef}>
                  <div className="terminal-prompt">user@linux:~$ </div>
                  <div className="terminal-command">echo "Hello, Linux World!"</div>
                  <div className="terminal-output">Hello, Linux World!</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lesson-section">
            <h2>💡 Hướng dẫn</h2>
            <div className="theory-section">
              <h3>Cách làm bài tập</h3>
              <p>Để hiển thị dòng chữ <span className="highlight">Hello, Linux World!</span> trên terminal, bạn hãy sử dụng lệnh <span className="highlight">echo</span> như sau:</p>
              <div className="terminal">
                <div className="terminal-content">
                  <div className="terminal-prompt">user@linux:~$ </div>
                  <div className="terminal-command">echo "Hello, Linux World!"</div>
                  <div className="terminal-output">Hello, Linux World!</div>
                </div>
              </div>
              <p>Bạn có thể thử các lệnh khác như <span className="highlight">ls</span>, <span className="highlight">pwd</span> để khám phá thêm.</p>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="lesson-header">
            <h1>Module 1: Làm Quen Với Linux</h1>
          </div>
          <div className="content-section">
            <h2>⚡ Terminal thực hành</h2>
            <button className="btn" onClick={handleRun}>{runLabel}</button>
            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-title">🐧 Linux Terminal</div>
                <div className="terminal-buttons">
                  <div className="terminal-btn close"></div>
                  <div className="terminal-btn minimize"></div>
                  <div className="terminal-btn maximize"></div>
                </div>
              </div>
              <div className="terminal-content">
                <div className="terminal-prompt">user@linux:~$ </div>
                <span>echo "Hello, Linux World!"</span>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2>🎯 Kiểm tra</h2>
            <div className="test-section">
              <h3>Kết quả kiểm thử</h3>
              <p>Vui lòng chạy thử code của bạn trước!</p>
              <div className="test-results">
                <div className="test-result">
                  <h4>Kiểm thử 1</h4>
                  <div className="value">✓ Đạt</div>
                  <div className="description">Đầu ra thực tế: "Hello, Linux World!"</div>
                </div>
                <div className="test-result">
                  <h4>Đầu ra mong đợi</h4>
                  <div className="value">"Hello, Linux World!"</div>
                  <div className="description">Kết quả chính xác</div>
                </div>
                <div className="test-result">
                  <h4>Giới hạn thời gian</h4>
                  <div className="value">50 ms</div>
                  <div className="description">Thời gian thực thi</div>
                </div>
                <div className="test-result">
                  <h4>Điểm số</h4>
                  <div className="value">100/100</div>
                  <div className="description">Hoàn thành xuất sắc!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinuxModule1;



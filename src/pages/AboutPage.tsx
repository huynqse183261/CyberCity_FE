import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/AboutPage.css';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Phan Thị Mỹ Duyên",
      title: "Chuyên gia An Toàn Thông Tin",
      image: "https://via.placeholder.com/150x150/00d4ff/ffffff?text=MD"
    },
    {
      name: "Nguyễn Quốc Huy",
      title: "Kĩ sư phần mềm",
      image: "https://via.placeholder.com/150x150/00d4ff/ffffff?text=QH"
    },
    {
      name: "Nguyễn Thụy Minh Hạnh",
      title: "Chuyên gia An Toàn Thông Tin",
      image: "https://via.placeholder.com/150x150/00d4ff/ffffff?text=MH"
    },
    {
      name: "Hồ Đạo Tỷ",
      title: "Chuyên gia An Toàn Thông Tin",
      image: "https://via.placeholder.com/150x150/00d4ff/ffffff?text=DT"
    },
    {
      name: "Nguyễn Đình Khôi",
      title: "Chuyên gia An Toàn Thông Tin",
      image: "https://via.placeholder.com/150x150/00d4ff/ffffff?text=NK"
    }
  ];

  return (
    <div className="about-page">
      <Navigation />
      
      <div className="about-content">
        {/* Chúng tôi là ai */}
        <section className="about-section">
          <h2>CHÚNG TÔI LÀ AI?</h2>
          <div className="section-content">
            <div className="text-content">
              <p>
                CyberLearn là nền tảng tương tác trực tuyến hàng đầu tại Việt Nam, 
                chuyên cung cấp các khóa học và công cụ thực hành về an toàn thông tin, 
                lập trình và kỹ thuật số. Chúng tôi cam kết mang đến trải nghiệm học tập 
                hiện đại, thực tế và hiệu quả cho mọi đối tượng từ người mới bắt đầu đến 
                các chuyên gia trong lĩnh vực công nghệ.
              </p>
            </div>
            <div className="image-content">
              <img 
                src="https://via.placeholder.com/400x300/1a1a2e/00d4ff?text=Team+Photo" 
                alt="Đội ngũ CyberLearn" 
                className="team-photo"
              />
            </div>
          </div>
        </section>

        {/* Tầm nhìn */}
        <section className="about-section">
          <h2>TẦM NHÌN</h2>
          <div className="section-content">
            <div className="text-content">
              <p>
                Trở thành nền tảng học tập công nghệ số 1 tại Việt Nam và khu vực Đông Nam Á, 
                nơi mọi người có thể phát triển kỹ năng lập trình và an toàn thông tin một cách 
                toàn diện, từ cơ bản đến nâng cao, với phương pháp học tập hiện đại và thực tế.
              </p>
            </div>
            <div className="visual-content">
              <div className="mission-visual">
                <h3>MISSION</h3>
                <div className="swirling-lines"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Sứ mệnh */}
        <section className="about-section">
          <h2>SỨ MỆNH</h2>
          <div className="section-content">
            <div className="visual-content">
              <div className="world-map">
                <div className="cloud-network">
                  <div className="cloud-icon">☁️</div>
                  <div className="cloud-icon">☁️</div>
                  <div className="cloud-icon">☁️</div>
                  <div className="connection-lines"></div>
                </div>
              </div>
            </div>
            <div className="text-content">
              <p>
                Cung cấp môi trường học tập trực tuyến chất lượng cao, kết hợp lý thuyết 
                và thực hành, giúp người học phát triển kỹ năng thực tế trong lĩnh vực 
                công nghệ thông tin. Chúng tôi cam kết đào tạo ra những chuyên gia có 
                năng lực cao, đáp ứng nhu cầu thị trường lao động trong thời đại số.
              </p>
            </div>
          </div>
        </section>

        {/* Giá trị */}
        <section className="about-section">
          <h2>GIÁ TRỊ</h2>
          <div className="values-content">
            <ul className="values-list">
              <li><strong>Chất lượng:</strong> Cam kết cung cấp nội dung học tập chất lượng cao, cập nhật theo xu hướng công nghệ mới nhất</li>
              <li><strong>Thực tế:</strong> Tập trung vào kỹ năng thực hành và ứng dụng thực tế trong môi trường làm việc</li>
              <li><strong>Đổi mới:</strong> Liên tục cải tiến phương pháp giảng dạy và công nghệ học tập</li>
              <li><strong>Cộng đồng:</strong> Xây dựng cộng đồng học tập tích cực, hỗ trợ lẫn nhau</li>
              <li><strong>Minh bạch:</strong> Đảm bảo tính minh bạch trong mọi hoạt động và cam kết với người học</li>
            </ul>
          </div>
        </section>

        {/* Đội ngũ */}
        <section className="about-section">
          <h2>ĐỘI NGŨ CỦA CHÚNG TÔI</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-photo">
                  <img src={member.image} alt={member.name} />
                </div>
                <h4>{member.name}</h4>
                <p>{member.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage; 
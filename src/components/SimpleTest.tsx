import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      {/* Navigation */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: 'rgba(15, 15, 35, 0.95)', 
        padding: '1rem 2rem',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4ff' }}>
            🛡️ CyberLearn VN
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ 
              background: 'linear-gradient(135deg, #00d4ff, #ff0080)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '25px'
            }}>Đăng nhập</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        paddingTop: '100px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
            Thành thạo An toàn thông tin với Linux
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.8 }}>
            Nền tảng học trực tuyến giúp sinh viên thực hành An toàn thông tin
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #00d4ff, #ff0080)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '25px',
            fontSize: '1.1rem',
            marginRight: '1rem'
          }}>
            Khám phá khóa học
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>
          Tính năng nổi bật
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { icon: '🐧', title: 'Linux Command Mastery', desc: 'Thành thạo Linux từ cơ bản đến nâng cao' },
            { icon: '💻', title: 'Virtual Lab', desc: 'Thực hành trực tiếp trên môi trường ảo' },
            { icon: '🔍', title: 'Pentest Tools', desc: 'Thực hành với các công cụ bảo mật' }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ marginBottom: '1rem', color: '#00d4ff' }}>{feature.title}</h3>
              <p style={{ opacity: 0.8 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: '#0a0a1a', 
        padding: '3rem 0 2rem',
        marginTop: '4rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4ff', marginBottom: '2rem' }}>
            🛡️ CyberLearn VN
          </div>
          <p style={{ opacity: 0.7 }}>
            CyberLearn là nền tảng học tập An toàn thông tin với Linux
          </p>
          <div style={{ marginTop: '2rem', opacity: 0.6 }}>
            <p>📍 Tòa FPT, số 10 Phạm Văn Bach, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội</p>
            <p>📞 1900.633.331</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleTest;

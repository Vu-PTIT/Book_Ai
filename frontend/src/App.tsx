import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock } from 'lucide-react';
import MysticalResult from './components/MysticalResult';
import DivinationAnimation from './components/DivinationAnimation';
import './App.css';

const MysticParticles = ({ count = 20 }: { count?: number }) => (
  <div className="particle-system">
    {[...Array(count)].map((_, i) => (
      <div 
        key={i} 
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${Math.random() * 10 + 15}s`,
          background: i % 3 === 0 ? 'var(--color-thien)' : i % 3 === 1 ? 'var(--color-dia)' : 'var(--color-nhan)',
          opacity: 0.4
        }}
      />
    ))}
  </div>
);


function App() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('12:00');
  const [loading, setLoading] = useState(false);
  const [divining, setDivining] = useState(false);
  const [error, setError] = useState('');
  const [showMystical, setShowMystical] = useState(false);
  const [divinationData, setDivinationData] = useState<any>(null);

  const handleDivination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dob) {
      setError('Vui lòng nhập đầy đủ thông tin Tín chủ.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          dob: dob,
          tob: tob
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối với Thần Thư.');
      }

      const data = await response.json();
      setDivinationData(data);
      setDivining(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối.');
      setLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    setDivining(false);
    setLoading(false);
    setShowMystical(true);
  };

  if (divining) {
    return <DivinationAnimation onComplete={handleAnimationComplete} />;
  }

  if (showMystical && divinationData) {
    return (
      <div className="app-container">
        <MysticParticles count={30} />
        <MysticalResult 
          data={divinationData}
          onReset={() => {
            setShowMystical(false);
            setDivinationData(null);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <MysticParticles count={20} />
      <div className="landing-view fade-in-up">
        <header className="hero-section">
          <div className="mystic-logo-container">
            <Sparkles className="icon-gold glow-animation" size={64} />
          </div>
          <h1 className="title title-gradient">Mệnh Thư</h1>
          <p className="subtitle">Thiên Thời • Địa Lợi • Nhân Hòa</p>
        </header>

        <form onSubmit={handleDivination} className="glass-panel main-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="label">Tên Tín Chủ</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Ngày Sinh</label>
              <input
                type="date"
                className="input-field"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Giờ Sinh (Không bắt buộc)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="time"
                  className="input-field"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                />
                <Clock size={16} className="input-icon" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              </div>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary submit-btn" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? (
              <><span className="loading-spinner"></span> Đang kết nối...</>
            ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
                  <BookOpen size={20} /> Khai Mở Thiên Thư
                </span>
            )}
          </button>
        </form>

        <footer className="landing-footer">
          <div className="ornament-divider">
            <div className="divider-line"></div>
            <div className="divider-diamond"></div>
            <div className="divider-line rev"></div>
          </div>
          <p className="footer-tag">Dẫn dắt bởi Trí Tuệ Nhân Tạo & Đạo Học Phương Đông</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

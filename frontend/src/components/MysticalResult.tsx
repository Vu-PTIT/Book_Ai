import React, { useEffect, useState } from 'react';
import { Book, Sparkles, Download, RotateCcw } from 'lucide-react';

interface BaziDetails {
  year: string;
  month: string;
  day: string;
  hour: string;
  element: string;
}

interface MysticalResultProps {
  data: {
    user_bazi: BaziDetails;
    current_bazi: BaziDetails;
    ai_content: {
      thien: { title: string; description: string };
      nhan: { title: string; description: string };
      dia: { 
        title: string; 
        book: { title: string; author: string; energy: string; reason: string; image_url?: string } 
      };
      advice: string;
      mantra: string;
      error?: string;
    };
  };
  onReset: () => void;
}

const MysticalResult: React.FC<MysticalResultProps> = ({ data, onReset }) => {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReveal(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const ai = data.ai_content;
  
  if (ai.error) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Có lỗi xảy ra khi kết nối với tinh tú. Vui lòng thử lại.</p>
        <button className="btn-primary" onClick={onReset} style={{ marginTop: '1rem' }}>Quay Lại</button>
      </div>
    );
  }

  return (
    <div className={`mystical-result-view ${reveal ? 'revealed' : ''}`}>
      <header className="result-header fade-in-up">
        <h1 className="title-gradient">Mệnh Thư Luận Giải</h1>
        <div className="bazi-badges">
          <span className="badge">Bản Mệnh: {data.user_bazi.element}</span>
          <span className="badge">Năm: {data.user_bazi.year}</span>
          <span className="badge">Tháng: {data.user_bazi.month}</span>
          <span className="badge">Ngày: {data.user_bazi.day}</span>
          <span className="badge">Giờ: {data.user_bazi.hour}</span>
        </div>
      </header>

      <div className="book-container fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="book-spread">
          {/* PAGE 1: THIÊN & NHÂN */}
          <div className="book-page page-left">
             <div className="ornament">
                <Sparkles size={24} color="#634a15" opacity={0.6} />
             </div>
             
             <section>
               <h2>{ai.thien?.title}</h2>
               <p>{ai.thien?.description}</p>
               <div style={{ fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'right', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem', color: '#634a15' }}>
                  Thời khí: {data.current_bazi.hour} • {data.current_bazi.day}
               </div>
             </section>

             <section style={{ marginTop: '2.5rem' }}>
               <h2>{ai.nhan?.title}</h2>
               <p>{ai.nhan?.description}</p>
             </section>
          </div>

          <div className="book-spine"></div>

          {/* PAGE 2: ĐỊA & LỜI KHUYÊN */}
          <div className="book-page page-right">
             <section>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                   <Book size={32} color="#634a15" opacity={0.8} />
                </div>
                <h2>{ai.dia?.title}</h2>
                <div className="book-rec-card">
                   {ai.dia?.book?.image_url && (
                     <div className="book-cover-container">
                        <img src={ai.dia?.book?.image_url} alt={ai.dia?.book?.title} className="book-cover-img" />
                        <div className="book-cover-glow"></div>
                     </div>
                   )}
                   <div className="book-info-content">
                      <h3 className="book-title">{ai.dia?.book?.title}</h3>
                      <p className="book-author">Tác giả: {ai.dia?.book?.author}</p>
                      <span className="energy-tag">Hành: {ai.dia?.book?.energy}</span>
                   </div>
                </div>
                <p>{ai.dia?.book?.reason}</p>
             </section>

             <section style={{ marginTop: 'auto', borderTop: '2px double rgba(99, 74, 21, 0.2)', paddingTop: '1.5rem' }}>
                <p style={{ fontWeight: 600, color: '#634a15', textAlign: 'center', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Lời Khuyên</p>
                <p style={{ fontStyle: 'italic', textAlign: 'center', fontSize: '1.1rem', color: '#2c2410' }}>"{ai.advice}"</p>
                
                <div className="mantra-scroll" style={{ marginTop: '1rem', background: 'rgba(212, 175, 55, 0.08)', padding: '1rem', borderRadius: '4px', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                   <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '4px', display: 'block', marginBottom: '0.5rem', color: '#634a15' }}>Khẩu Quyết</span>
                   <p style={{ fontSize: '1.4rem', color: '#634a15', margin: 0, fontFamily: "'Playfair Display', serif" }}>{ai.mantra}</p>
                </div>
             </section>
          </div>
        </div>
      </div>

      <footer className="result-footer fade-in-up" style={{ animationDelay: '0.8s', marginBottom: '4rem' }}>
        <div className="action-btns">
          <button className="secondary-btn" onClick={onReset}>
            <RotateCcw size={18} /> Gieo Quẻ Mới
          </button>
          <button className="btn-primary">
            <Download size={18} /> Lưu Mệnh Thư
          </button>
        </div>
      </footer>

      <style>{`
        .mystical-result-view {
          padding: 2rem;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
        }

        .result-header {
          text-align: center;
          margin-bottom: 1rem;
        }

        .result-header h1 {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .bazi-badges {
          display: flex;
          justify-content: center;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .badge {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--primary-gold-dim);
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          font-size: 0.85rem;
          color: var(--primary-gold);
          font-family: 'Playfair Display', serif;
        }

        .result-footer {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .action-btns {
          display: flex;
          gap: 1.5rem;
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid var(--glass-border);
          padding: 1rem 2rem;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary-gold);
        }

        .energy-tag {
          display: inline-block;
          background: rgba(99, 74, 21, 0.1);
          color: #634a15;
          padding: 0.2rem 0.6rem;
          border-radius: 3px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .book-rec-card {
          background: rgba(99, 74, 21, 0.03);
          border: 1px solid rgba(99, 74, 21, 0.1);
          border-radius: 8px;
          padding: 1.2rem;
          display: flex;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .book-rec-card:hover {
          transform: translateY(-5px);
          background: rgba(99, 74, 21, 0.05);
          box-shadow: 0 10px 30px rgba(99, 74, 21, 0.1);
        }

        .book-cover-container {
          position: relative;
          flex-shrink: 0;
          width: 80px;
          height: 120px;
          perspective: 1000px;
        }

        .book-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 2px 4px 12px rgba(0,0,0,0.2);
          transform: rotateY(-15deg);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .book-rec-card:hover .book-cover-img {
          transform: rotateY(0deg) scale(1.05);
        }

        .book-cover-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          z-index: 3;
          pointer-events: none;
        }

        .book-info-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .book-title {
          color: #2c2410;
          font-size: 1.3rem;
          margin: 0 0 0.2rem 0;
          font-family: 'Playfair Display', serif;
          line-height: 1.2;
        }

        .book-author {
          font-size: 0.85rem;
          color: #634a15;
          margin: 0 0 0.6rem 0;
        }

        @media (max-width: 900px) {
          .result-header h1 { font-size: 2rem; }
          .book-page { padding: 2rem; }
          .book-spread { min-height: auto; }
          .action-btns { flex-direction: column; width: 100%; }
          .secondary-btn, .btn-primary { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default MysticalResult;

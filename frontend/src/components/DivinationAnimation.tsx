import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';

interface DivinationAnimationProps {
  onComplete?: () => void;
}

const DivinationAnimation: React.FC<DivinationAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(1);
  const [hexagram, setHexagram] = useState<string[]>([]);

  useEffect(() => {
    // Generate a random hexagram (6 lines of Yin/Yang)
    const lines = Array.from({ length: 6 }, () => (Math.random() > 0.5 ? 'yang' : 'yin'));
    setHexagram(lines);

    const timer1 = setTimeout(() => setPhase(2), 1500);
    const timer2 = setTimeout(() => setPhase(3), 3000);
    const timer3 = setTimeout(() => {
        if (onComplete) onComplete();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="divination-overlay">
      <div className={`ritual-circle ${phase >= 1 ? 'active' : ''}`}>
        <Compass className="bagua-icon" size={120} />
        <div className="energy-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>
      </div>

      <div className={`hexagram-display ${phase >= 2 ? 'visible' : ''}`}>
        {hexagram.map((line, i) => (
          <div key={i} className={`hex-line ${line} delay-${i}`}></div>
        ))}
      </div>

      <div className={`mystic-status ${phase >= 1 ? 'fade-in' : ''}`}>
        {phase === 1 && <p>Đang hội tụ linh khí...</p>}
        {phase === 2 && <p>Đang gieo quẻ Dịch...</p>}
        {phase === 3 && <p>Mệnh thư đang mở...</p>}
      </div>

      <style>{`
        .divination-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 12, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .ritual-circle {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .bagua-icon {
          color: var(--primary-gold);
          animation: rotate-bagua 10s linear infinite;
          filter: drop-shadow(0 0 15px var(--primary-gold-dim));
        }

        .energy-rings {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid var(--primary-gold-dim);
          border-radius: 50%;
          animation: ring-pulse 3s infinite ease-out;
        }

        .ring-1 { width: 100%; height: 100%; animation-delay: 0s; }
        .ring-2 { width: 140%; height: 140%; animation-delay: 1s; }
        .ring-3 { width: 180%; height: 180%; animation-delay: 2s; }

        .hexagram-display {
          display: flex;
          flex-direction: column-reverse;
          gap: 12px;
          width: 120px;
          opacity: 0;
          transition: opacity 1s ease;
        }

        .hexagram-display.visible { opacity: 1; }

        .hex-line {
          height: 8px;
          background: var(--primary-gold);
          box-shadow: 0 0 10px var(--primary-gold-dim);
          border-radius: 4px;
        }

        .hex-line.yin {
          background: transparent;
          display: flex;
          justify-content:空间-between;
          background: none;
          box-shadow: none;
        }

        .hex-line.yin::before, .hex-line.yin::after {
          content: '';
          width: 45%;
          height: 100%;
          background: var(--primary-gold);
          border-radius: 4px;
          box-shadow: 0 0 10px var(--primary-gold-dim);
        }

        .mystic-status {
          margin-top: 3rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: var(--primary-gold);
          letter-spacing: 2px;
          text-align: center;
          height: 2rem;
        }

        @keyframes rotate-bagua {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ring-pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        .delay-0 { animation: pop-in 0.3s 0.2s both; }
        .delay-1 { animation: pop-in 0.3s 0.4s both; }
        .delay-2 { animation: pop-in 0.3s 0.6s both; }
        .delay-3 { animation: pop-in 0.3s 0.8s both; }
        .delay-4 { animation: pop-in 0.3s 1.0s both; }
        .delay-5 { animation: pop-in 0.3s 1.2s both; }

        @keyframes pop-in {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DivinationAnimation;

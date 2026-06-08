'use client';

import { useRouter } from 'next/navigation';

export default function MenuGatePage() {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: '#06140F',
        backgroundImage: 'linear-gradient(135deg, rgba(6,20,15,0.95), rgba(20,45,35,0.95))',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Montserrat", sans-serif',
        color: '#FDFBF7',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        
        .modern-royalty-panel {
          background: rgba(10, 35, 24, 0.85);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(212, 175, 55, 0.5);
          border-radius: 24px;
          padding: 60px 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(212, 175, 55, 0.2);
          animation: fadeInScale 0.8s ease-out forwards;
          text-align: center;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .royalty-title {
          font-family: "Cormorant Garamond", serif;
          font-size: 3rem;
          color: #D4AF37;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin: 0 0 20px 0;
          font-weight: 600;
        }

        .royalty-subtitle {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.4rem;
          color: #E5D08F;
          margin: 0 0 40px 0;
          font-style: italic;
          font-weight: 400;
        }

        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          margin: 40px 0;
        }

        .gate-message {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #FDFBF7;
          margin: 40px 0;
          letter-spacing: 0.5px;
        }

        .barcode-icon {
          font-size: 3.5rem;
          margin: 30px 0;
          display: block;
        }

        .btn-primary {
          display: inline-block;
          padding: 16px 50px;
          background: linear-gradient(145deg, #D4AF37, #B8860B);
          color: #06140F;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: 0.3s ease;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
          margin-top: 20px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .footer-text {
          margin-top: 50px;
          font-size: 0.85rem;
          color: #888;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="modern-royalty-panel">
        <h1 className="royalty-title">M'K26 Menu</h1>
        <p className="royalty-subtitle">Modern Royalty</p>

        <div className="divider" />

        <span className="barcode-icon">📱</span>

        <p className="gate-message">
          To access the live menu and place your order, please scan the M'K26 Barcode located on your table.
        </p>

        <div className="divider" />

        <button onClick={() => router.back()} className="btn-primary">
          ← Back
        </button>

        <p className="footer-text">The M'K26 Gala Experience</p>
      </div>
    </div>
  );
}

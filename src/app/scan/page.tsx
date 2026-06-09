'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScanQRPage() {
  const router = useRouter();
  const [manualTableNumber, setManualTableNumber] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleManualEntry = () => {
    if (!manualTableNumber.trim()) {
      alert('Please enter a table number');
      return;
    }
    // Redirect to menu with table parameter
    router.push(`/menu?table=${encodeURIComponent(manualTableNumber.trim())}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualEntry();
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#06140F',
        backgroundImage:
          'linear-gradient(to bottom, rgba(6,20,15,0.3), rgba(6,20,15,0.95)), url("https://res.cloudinary.com/din74ljlu/image/upload/v1779080657/SAVE_20260518_242659_ftuf3e.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
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
        
        .qr-glass-panel {
          background: rgba(10, 35, 24, 0.8);
          backdrop-filter: blur(16px);
          border: 2px solid rgba(229, 208, 143, 0.4);
          border-radius: 20px;
          padding: 50px 30px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pulse-icon {
          font-size: 5rem;
          display: block;
          text-align: center;
          margin-bottom: 20px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .qr-title {
          font-family: "Cormorant Garamond", serif;
          font-size: 2.2rem;
          color: #E5D08F;
          text-align: center;
          margin: 0 0 15px 0;
          letter-spacing: 2px;
        }

        .qr-subtitle {
          text-align: center;
          color: #aaa;
          font-size: 1rem;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .qr-instructions {
          background: rgba(0, 0, 0, 0.3);
          border-left: 4px solid #E5D08F;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 40px;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #FDFBF7;
        }

        .input-table {
          width: 100%;
          padding: 16px;
          margin-bottom: 20px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(229, 208, 143, 0.4);
          border-radius: 8px;
          color: #FDFBF7;
          font-family: "Montserrat", sans-serif;
          font-size: 1.1rem;
          text-align: center;
          letter-spacing: 3px;
          outline: none;
          transition: 0.3s;
        }

        .input-table:focus {
          border-color: #E5D08F;
          background: rgba(0, 0, 0, 0.7);
          box-shadow: 0 0 15px rgba(229, 208, 143, 0.2);
        }

        .btn-scan {
          width: 100%;
          padding: 18px;
          background: linear-gradient(145deg, #E5D08F, #C7A951);
          color: #06140F;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 10px 30px rgba(229, 208, 143, 0.2);
        }

        .btn-scan:active {
          transform: scale(0.97);
        }

        .btn-manual {
          width: 100%;
          padding: 14px;
          background: transparent;
          color: #E5D08F;
          border: 1px solid rgba(229, 208, 143, 0.5);
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 15px;
        }

        .btn-manual:hover {
          border-color: #E5D08F;
          background: rgba(229, 208, 143, 0.1);
        }

        .manual-entry {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>

      <div className="qr-glass-panel">
        <span className="pulse-icon">≡ƒô▒</span>

        <h1 className="qr-title">Welcome, Honored Guest</h1>

        <p className="qr-subtitle">
          Please scan your table QR code to access the menu and place your
          order.
        </p>

        <div className="qr-instructions">
          <strong style={{ color: '#E5D08F' }}>How it works:</strong>
          <p style={{ margin: '10px 0 0 0' }}>
            Your table has a QR code that links directly to the menu. Simply
            scan it with your phone camera or any QR scanner app to get started.
          </p>
        </div>

        {!showManualEntry ? (
          <>
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '2px dashed rgba(212, 175, 55, 0.4)',
                borderRadius: '12px',
                padding: '60px 20px',
                textAlign: 'center',
                marginBottom: '30px',
              }}
            >
              <p style={{ color: '#aaa', margin: '0', fontSize: '0.9rem' }}>
                QR Scanner Ready
              </p>
            </div>

            <button onClick={() => setShowManualEntry(true)} className="btn-manual">
              Can&apos;t scan? Enter table number manually
            </button>
          </>
        ) : (
          <div className="manual-entry">
            <label
              style={{
                display: 'block',
                color: '#E5D08F',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '10px',
              }}
            >
              Table Number
            </label>
            <input
              type="text"
              placeholder="Enter your table number (e.g., 5)"
              className="input-table"
              value={manualTableNumber}
              onChange={(e) => setManualTableNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <button onClick={handleManualEntry} className="btn-scan">
              Access Menu
            </button>
            <button
              onClick={() => {
                setShowManualEntry(false);
                setManualTableNumber('');
              }}
              className="btn-manual"
            >
              Back
            </button>
          </div>
        )}

        <p
          style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '0.8rem',
            marginTop: '40px',
          }}
        >
          The M&apos;K26 Gala
        </p>
      </div>
    </div>
  );
}

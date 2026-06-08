'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function VaultPage() {
  const [blessingMessage, setBlessingMessage] = useState('');

  return (
    <main
      style={{
        backgroundColor: '#06140F',
        minHeight: '100vh',
        color: '#FDFBF7',
        fontFamily: '"Montserrat", sans-serif',
        padding: '60px 20px 40px 20px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');

        .vault-container {
          max-width: 700px;
          margin: 0 auto;
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .vault-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .vault-title {
          font-family: "Cormorant Garamond", serif;
          font-size: 2.8rem;
          color: #E5D08F;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin: 0 0 15px 0;
        }

        .vault-subtitle {
          font-size: 0.95rem;
          color: #aaa;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .blessing-card {
          background: linear-gradient(135deg, rgba(229, 208, 143, 0.08), rgba(212, 175, 55, 0.08));
          border: 2px solid rgba(229, 208, 143, 0.3);
          border-radius: 16px;
          padding: 50px 30px;
          text-align: center;
          margin: 40px 0;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(229, 208, 143, 0.1);
        }

        .blessing-icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
          display: block;
        }

        .blessing-title {
          font-family: "Cormorant Garamond", serif;
          font-size: 2rem;
          color: #D4AF37;
          margin: 0 0 15px 0;
          font-weight: 400;
        }

        .blessing-copy {
          font-size: 1rem;
          line-height: 1.8;
          color: #FDFBF7;
          letter-spacing: 0.5px;
          margin-bottom: 30px;
        }

        .message-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(229, 208, 143, 0.3);
          border-radius: 12px;
          padding: 25px;
          margin: 30px 0;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .message-box-text {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.3rem;
          color: #E5D08F;
          font-style: italic;
          line-height: 1.6;
        }

        .message-input {
          width: 100%;
          padding: 15px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(229, 208, 143, 0.3);
          border-radius: 8px;
          color: #FDFBF7;
          font-family: "Montserrat", sans-serif;
          font-size: 0.95rem;
          resize: vertical;
          min-height: 100px;
          outline: none;
          transition: 0.3s;
          margin-bottom: 15px;
        }

        .message-input:focus {
          border-color: #E5D08F;
          background: rgba(0, 0, 0, 0.6);
          box-shadow: 0 0 15px rgba(229, 208, 143, 0.2);
        }

        .submit-blessing {
          padding: 12px 30px;
          background: rgba(229, 208, 143, 0.2);
          color: #E5D08F;
          border: 1px solid #E5D08F;
          border-radius: 6px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.85rem;
          transition: 0.3s;
        }

        .submit-blessing:hover {
          background: rgba(229, 208, 143, 0.3);
        }

        .nav-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 80px;
          padding-top: 30px;
          border-top: 1px solid rgba(229, 208, 143, 0.2);
        }

        .nav-link {
          color: #E5D08F;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.85rem;
          transition: 0.3s;
        }

        .nav-link:hover {
          color: #D4AF37;
        }

        .nav-center {
          font-size: 0.8rem;
          color: #888;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .divider-small {
          height: 1px;
          background: rgba(229, 208, 143, 0.2);
          margin: 20px 0;
        }
      `}</style>

      <div className="vault-container">
        <div className="vault-header">
          <h1 className="vault-title">Bless the Couple</h1>
          <p className="vault-subtitle">The Blessing Vault</p>
        </div>

        <div className="blessing-card">
          <span className="blessing-icon">✨</span>
          <h2 className="blessing-title">Share Your Blessings</h2>
          <p className="blessing-copy">
            We invite you to leave a heartfelt message of joy and blessings for the newlyweds. Your words will be cherished forever.
          </p>

          <div className="divider-small" />

          <div className="message-box">
            <p className="message-box-text">
              "May Allah bless for you, and may He bless on you, and combine both of you in good."
            </p>
          </div>

          <div className="divider-small" />

          <textarea
            className="message-input"
            placeholder="Share your blessings and well-wishes for Muhammed & Kaothar..."
            value={blessingMessage}
            onChange={(e) => setBlessingMessage(e.target.value)}
          />

          <button className="submit-blessing" onClick={() => { alert('Thank you for your blessings!'); setBlessingMessage(''); }}>
            Send Blessing
          </button>
        </div>

        <div className="nav-footer">
          <Link href="/honorary" className="nav-link">
            ← Previous: The Honorees
          </Link>
          <span className="nav-center">The M'K26 Gala</span>
          <div style={{ width: '100px' }}></div>
        </div>
      </div>
    </main>
  );
}

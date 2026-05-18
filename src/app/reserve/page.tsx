'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ReservePage() {
  const [vipCode, setVipCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  const checkCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('checking');
    setTimeout(() => {
      if (vipCode.toUpperCase().startsWith('MK26-')) {
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    }, 1500);
  };

  return (
    <div style={{ backgroundImage: 'linear-gradient(to bottom, rgba(6,20,15,0.7), rgba(6,20,15,0.95)), url("https://res.cloudinary.com/din74ljlu/image/upload/v1779080840/SAVE_20260518_242622_aynhqf.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '"Montserrat", sans-serif', color: '#FDFBF7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');
        .glass-vault { background: rgba(10, 35, 24, 0.7); backdrop-filter: blur(15px); border: 1px solid rgba(229, 208, 143, 0.3); border-radius: 16px; padding: 40px 30px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .vip-input { width: 100%; padding: 18px; margin-bottom: 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(229, 208, 143, 0.5); border-radius: 8px; color: #E5D08F; font-family: "Montserrat", sans-serif; font-size: 1.2rem; text-align: center; letter-spacing: 4px; outline: none; text-transform: uppercase; }
        .vip-input::placeholder { color: rgba(229, 208, 143, 0.3); letter-spacing: 2px; }
        .btn-champagne { width: 100%; padding: 20px; background: linear-gradient(145deg, #E5D08F, #C7A951); color: #06140F; font-weight: 600; border: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; cursor: pointer; transition: 0.3s; }
      `}</style>

      <div className="glass-vault">
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🎟️</span>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2rem', margin: '0 0 10px 0' }}>The VIP Vault</h1>
        <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '30px', lineHeight: '1.6' }}>Enter your exclusive access code to secure your seat.</p>

        {status === 'valid' ? (
          <div>
            <h2 style={{ color: '#10b981', margin: '0 0 10px 0' }}>Access Granted</h2>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>Welcome to the inner circle.</p>
            <Link href="/" style={{ color: '#E5D08F', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid #E5D08F' }}>Return Home</Link>
          </div>
        ) : (
          <form onSubmit={checkCode}>
            <input type="text" placeholder="MK26-XXXX" className="vip-input" value={vipCode} onChange={(e) => setVipCode(e.target.value)} required />
            <button type="submit" disabled={status === 'checking'} className="btn-champagne">
              {status === 'checking' ? 'Verifying...' : 'Unlock Pass'}
            </button>
            {status === 'invalid' && <p style={{ color: '#ef4444', marginTop: '15px', fontSize: '0.85rem' }}>Invalid access code. Please try again.</p>}
          </form>
        )}
      </div>
    </div>
  );
}

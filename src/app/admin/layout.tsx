'use client';
import { useState } from 'react';

export default function AdminSecurityLayout({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('mk26_staff_auth') === '5273';
  });
  const [pin, setPin] = useState('');

  const handleUnlock = () => {
    if (pin === '5273') {
      localStorage.setItem('mk26_staff_auth', '5273');
      setIsUnlocked(true);
    } else {
      alert("⚠️ ACCESS DENIED. Unauthorized entry logged.");
    }
  };

  if (!isUnlocked) {
    return (
      <div style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Montserrat", sans-serif' }}>
        <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '16px', border: '1px solid #ef4444', textAlign: 'center', width: '90%', maxWidth: '400px', boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🔒</span>
          <h2 style={{ color: '#ef4444', margin: '0 0 20px 0' }}>Staff Portal Restricted</h2>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '25px' }}>Enter Master Authorization PIN</p>
          <input type="password" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: '100%', padding: '15px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '25px', outline: 'none', textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem' }} />
          <button onClick={handleUnlock} style={{ width: '100%', padding: '15px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Unlock System</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

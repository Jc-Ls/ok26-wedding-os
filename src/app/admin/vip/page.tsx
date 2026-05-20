'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function VIPGenerator() {
  const [count, setCount] = useState(50);
  const [status, setStatus] = useState('');

  const generateCodes = async () => {
    setStatus('Generating...');
    try {
      await fetch('/api/vip/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      setStatus(`Successfully generated ${count} new codes!`);
    } catch(e) {
      setStatus('Error generating codes.');
    }
  };

  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Montserrat", sans-serif', backgroundColor: '#050505', color: '#FDFBF7', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ color: '#D4AF37', fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem' }}>VIP Code Generator</h1>
      <p style={{ color: '#aaa', marginBottom: '40px' }}>Generate secure MK26- access passes.</p>
      
      <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', maxWidth: '400px', margin: '0 auto' }}>
        <input 
          type="number" value={count} onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: '100%', padding: '15px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '20px', outline: 'none', textAlign: 'center', fontSize: '1.2rem' }}
        />
        <button onClick={generateCodes} style={{ width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Generate Codes
        </button>
        {status && <p style={{ marginTop: '20px', color: '#10b981' }}>{status}</p>}
      </div>
      <Link href="/admin" style={{ display: 'inline-block', marginTop: '30px', color: '#D4AF37', textDecoration: 'none', borderBottom: '1px solid #D4AF37' }}>← Back to Hub</Link>
    </div>
  );
}

'use client';
import { useState } from 'react';

export default function SecurityGate() {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'neutral' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    // In the final wiring phase, this will hit our /api/guests route
    setTimeout(() => {
      if (pin.length < 5) {
        setStatus({ message: "Invalid PIN format. Must be OK26-XXXX", type: 'error' });
      } else {
        setStatus({ message: `Access Granted! Guest verified.`, type: 'success' });
      }
      setIsLoading(false);
      setPin('');
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A142F', color: '#fff', padding: '20px', fontFamily: '"Montserrat", sans-serif' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', paddingTop: '50px' }}>
        <h1 style={{ fontFamily: '"Cinzel", serif', color: '#D4AF37', marginBottom: '10px' }}>Security Gate</h1>
        <p style={{ color: '#d1d5db', marginBottom: '30px', fontSize: '0.9rem' }}>Verify guest reservation passes here.</p>

        <form onSubmit={handleVerify} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '30px 20px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <input 
            type="text" 
            value={pin} 
            onChange={(e) => setPin(e.target.value.toUpperCase())} 
            placeholder="e.g. OK26-1234" 
            style={{ width: '100%', padding: '15px', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '2px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #D4AF37', color: '#fff', borderRadius: '8px', marginBottom: '20px', textTransform: 'uppercase' }}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', textTransform: 'uppercase' }}
          >
            {isLoading ? 'Verifying...' : 'Verify Pass'}
          </button>
        </form>

        {status && (
          <div style={{ marginTop: '20px', padding: '20px', borderRadius: '8px', backgroundColor: status.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)', border: `1px solid ${status.type === 'success' ? '#4CAF50' : '#F44336'}` }}>
            <h3 style={{ color: status.type === 'success' ? '#4CAF50' : '#F44336', marginBottom: '5px' }}>
              {status.type === 'success' ? '✅ VALID' : '❌ DENIED'}
            </h3>
            <p style={{ fontSize: '0.9rem' }}>{status.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

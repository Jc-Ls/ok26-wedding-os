'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ReservePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', passcode: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [ticketId, setTicketId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(''); // Clear old errors
    
    // Trim accidental spaces from the passcode
    const cleanPasscode = form.passcode.trim();
    
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, passcode: cleanPasscode })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setTicketId(data.ticketId);
        setStatus('success');
      } else {
        setStatus('error');
        // Capture the specific error from our new backend!
        setErrorMessage(data.error || 'Authentication failed.'); 
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: '#06140F', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        
        .glass-vault {
          background: rgba(10, 35, 24, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(229, 208, 143, 0.2);
          border-radius: 20px;
          padding: 40px 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: slideUpFade 0.8s ease-out;
          margin-top: auto;
        }

        .input-emerald {
          width: 100%;
          padding: 20px;
          margin-bottom: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(229, 208, 143, 0.2);
          border-radius: 12px;
          color: #FDFBF7;
          font-family: "Montserrat", sans-serif;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-emerald:focus {
          border-color: #E5D08F;
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 15px rgba(229, 208, 143, 0.1);
        }

        .btn-champagne {
          width: 100%;
          padding: 22px;
          background: linear-gradient(145deg, #E5D08F, #C7A951);
          color: #06140F;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(229, 208, 143, 0.2);
          transition: all 0.3s ease;
        }

        @keyframes slideUpFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ position: 'absolute', top: '30px', left: '20px' }}>
        <Link href="/" style={{ color: '#E5D08F', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          ← Return
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '50px' }}>
        {status === 'success' ? (
          <div className="glass-vault" style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #E5D08F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <span style={{ fontSize: '2rem' }}>✨</span>
            </div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2.5rem', marginBottom: '10px', fontWeight: '400' }}>Access Granted</h2>
            
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px dashed #E5D08F', borderRadius: '12px', padding: '20px', margin: '25px 0' }}>
              <p style={{ color: '#aaa', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px 0' }}>Your VIP Ticket ID</p>
              <h1 style={{ color: '#E5D08F', fontSize: '2.5rem', margin: 0, letterSpacing: '4px', fontFamily: '"Cormorant Garamond", serif' }}>{ticketId}</h1>
            </div>

            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6', fontWeight: '300' }}>
              Your reservation is secured in our system.<br/><br/>
              {form.email ? (
                <>
                  A confirmation has been sent to your email.<br/>
                  <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#E5D08F' }}>
                    (Please check your spam/junk folder if you do not see it within 2 minutes).
                  </span>
                </>
              ) : "Please screenshot this pass for the entrance."}
            </p>
          </div>
        ) : (
          <div className="glass-vault">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2.8rem', margin: '0 0 10px 0', fontWeight: '400' }}>VIP Access</h1>
              <p style={{ color: '#aaa', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: '300' }}>Secure your place at the Gala.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name (Required)" required className="input-emerald" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input type="tel" placeholder="Phone Number (Optional)" className="input-emerald" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <input type="email" placeholder="Email Address (Optional)" className="input-emerald" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              
              <div style={{ position: 'relative' }}>
                <input type="password" placeholder="Enter VIP Passcode" required className="input-emerald" value={form.passcode} onChange={e => setForm({...form, passcode: e.target.value})} style={{ borderColor: status === 'error' ? '#ff4444' : '' }} />
                {status === 'error' && (
                  <p style={{ position: 'absolute', bottom: '-22px', left: '5px', color: '#ff4444', fontSize: '0.75rem', letterSpacing: '1px' }}>
                    {errorMessage}
                  </p>
                )}
              </div>

              <button type="submit" disabled={status === 'submitting'} className="btn-champagne" style={{ marginTop: '30px', opacity: status === 'submitting' ? 0.7 : 1 }}>
                {status === 'submitting' ? 'Authenticating...' : 'Secure Reservation'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ padding: '30px 20px 10px', width: '100%', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ color: 'rgba(253,251,247,0.3)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
          Seamlessly Engineered by <br/>
          <a href="#" style={{ color: 'rgba(229,208,143,0.7)', fontWeight: '600', display: 'inline-block', marginTop: '8px', textDecoration: 'none', transition: '0.3s' }}>
            JCLs (Jare's Choice Labs)
          </a>
        </p>
      </div>

    </div>
  );
}
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ReservePage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', vipCode: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketData, setTicketData] = useState({ code: '', name: '' });

  const submitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setTicketData({ code: data.ticketId, name: data.name });
        setStatus('success');
      } else {
        setErrorMsg(data.error || "Failed to secure reservation. Please try again.");
        setStatus('idle');
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      setStatus('idle');
    }
  };

  return (
    <div style={{ backgroundImage: 'linear-gradient(to bottom, rgba(6,20,15,0.3), rgba(6,20,15,0.85)), url("https://res.cloudinary.com/din74ljlu/image/upload/v1779080840/SAVE_20260518_242622_aynhqf.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '"Montserrat", sans-serif', color: '#FDFBF7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .glass-panel { background: rgba(10, 35, 24, 0.4); backdrop-filter: blur(10px); border: 1px solid rgba(229, 208, 143, 0.3); border-radius: 16px; padding: 40px 25px; width: 100%; max-width: 450px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .input-emerald { width: 100%; padding: 16px; margin-bottom: 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(229, 208, 143, 0.3); border-radius: 8px; color: #FDFBF7; font-family: "Montserrat", sans-serif; font-size: 1rem; outline: none; transition: 0.3s; }
        .input-emerald:focus { border-color: #E5D08F; background: rgba(0,0,0,0.6); }
        .vip-input { text-align: center; font-size: 1.2rem; letter-spacing: 2px; text-transform: uppercase; border-color: #E5D08F; }
        .btn-champagne { width: 100%; padding: 20px; background: linear-gradient(145deg, #E5D08F, #C7A951); color: #06140F; font-weight: 600; border: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; cursor: pointer; transition: transform 0.2s; }
        .btn-champagne:active { transform: scale(0.98); }
        .ticket-card { background: rgba(6, 20, 15, 0.9); border: 2px dashed #E5D08F; border-radius: 12px; padding: 30px 20px; text-align: center; position: relative; margin-bottom: 20px; }
        .ticket-card::before, .ticket-card::after { content: ''; position: absolute; top: 50%; width: 30px; height: 30px; background: #0a1f16; border-radius: 50%; transform: translateY(-50%); border: 2px dashed #E5D08F; }
        .ticket-card::before { left: -16px; border-left-color: transparent; border-top-color: transparent; border-bottom-color: transparent; }
        .ticket-card::after { right: -16px; border-right-color: transparent; border-top-color: transparent; border-bottom-color: transparent; }
      `}</style>

      {status === 'success' ? (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🎟️</span>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#10b981', fontSize: '2rem', margin: '0 0 10px 0' }}>Reservation Confirmed</h2>
          <p style={{ color: '#FDFBF7', fontSize: '0.9rem', marginBottom: '30px' }}>Please take a screenshot of your digital pass below. It will be required for entry.</p>
          
          <div className="ticket-card">
            <p style={{ color: '#E5D08F', fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>VIP Access Pass</p>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FDFBF7', fontSize: '1.8rem', margin: '0 0 20px 0', fontWeight: '400' }}>{ticketData.name}</h3>
            
            <div style={{ backgroundColor: 'rgba(229, 208, 143, 0.1)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(229, 208, 143, 0.3)' }}>
              <p style={{ color: '#aaa', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Secure Code</p>
              <h1 style={{ fontFamily: 'monospace', color: '#E5D08F', fontSize: '2.5rem', letterSpacing: '4px', margin: 0 }}>{ticketData.code}</h1>
            </div>
            <p style={{ color: '#E5D08F', fontSize: '0.7rem', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>The Olowojare Gala</p>
          </div>

          <p style={{ color: '#FDFBF7', fontSize: '0.8rem', marginBottom: '20px' }}>
            {form.email ? "A copy of this pass has also been sent to your email." : "Save this code to present at the entrance."}
          </p>
          
          <Link href="/" style={{ color: '#E5D08F', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid #E5D08F', paddingBottom: '2px' }}>
            Return to Homepage
          </Link>
        </div>
      ) : (
        <div className="glass-panel">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2.2rem', margin: '0 0 10px 0' }}>VIP Registration</h1>
            <p style={{ color: '#FDFBF7', fontSize: '0.85rem', lineHeight: '1.6' }}>Enter your details and invitation code to secure your pass.</p>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={submitReservation}>
            <input type="text" placeholder="Full Name *" className="input-emerald" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            <input type="tel" placeholder="Phone Number *" className="input-emerald" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required />
            <input type="email" placeholder="Email Address (Optional)" className="input-emerald" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            
            <p style={{ fontSize: '0.75rem', color: '#E5D08F', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', textAlign: 'center', marginTop: '10px' }}>Invitation Code *</p>
            <input type="text" placeholder="MK26-XXXXX" className="input-emerald vip-input" value={form.vipCode} onChange={(e) => setForm({...form, vipCode: e.target.value.toUpperCase()})} required />

            <button type="submit" disabled={status === 'submitting'} className="btn-champagne" style={{ marginTop: '10px' }}>
              {status === 'submitting' ? 'Verifying Pass...' : 'Secure VIP Pass'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

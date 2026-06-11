'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ReservationsPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', vipCode: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketData, setTicketData] = useState({ code: '', name: '' });
  const [showMenuGateModal, setShowMenuGateModal] = useState(false);

  const submitReservation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.vipCode) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTicketData({ code: data.ticketId, name: data.name });
        setStatus('success');
      } else {
        setErrorMsg(data.error || 'Failed to secure reservation. Please try again.');
        setStatus('idle');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <main className="page-shell reservation-page" style={{ backgroundImage: 'linear-gradient(135deg, rgba(10,20,47,0.85) 0%, rgba(20,35,70,0.9) 50%, rgba(10,20,47,0.85) 100%)', backgroundAttachment: 'fixed' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>Reservations</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 6vw, 4rem)', marginBottom: '18px' }}>Secure Your Invitation</h1>
        <p style={{ color: '#D9D2C1', lineHeight: 1.8, marginBottom: '24px' }}>
          Reserve your place at the Olowojares gala with a premium booking experience. Enter your details and VIP access code to confirm attendance.
        </p>
        <p style={{ color: '#D9D2C1', lineHeight: 1.8, marginBottom: '40px' }}>
          Your reservation is confirmed! At the reception, scan your table's QR code to unlock the menu and place your order. All orders will be sent directly to the kitchen.
        </p>

        {status === 'success' ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,208,143,0.18)', borderRadius: '24px', padding: '30px', boxShadow: '0 30px 70px rgba(0,0,0,0.25)' }}>
            <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Reservation Confirmed</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.1rem', marginBottom: '16px', color: '#fff' }}>{ticketData.name}</h2>
            <p style={{ color: '#CBC1AF', marginBottom: '24px', lineHeight: 1.7 }}>Please save the VIP access code below and present it when requested at the event entrance.</p>
            <div style={{ background: 'rgba(212,175,55,0.08)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(212,175,55,0.25)' }}>
              <p style={{ color: '#D9D2C1', letterSpacing: '2px', fontSize: '0.75rem', marginBottom: '10px' }}>VIP PASS CODE</p>
              <p style={{ fontFamily: 'monospace', fontSize: '2rem', color: '#F5EFE0', margin: 0 }}>{ticketData.code}</p>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap', flexDirection: 'column' }}>
              <p style={{ color: '#E5C07B', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>📱 <strong>To access the menu:</strong> Scan the QR code at your table in the reception hall. This will unlock your personalized menu and ordering options.</p>
              <button onClick={() => setShowMenuGateModal(true)} className="btn-secondary" style={{ cursor: 'pointer', width: '100%' }}>
                Access Menu (via QR)
              </button>
              <Link href="/" className="btn-secondary">
                Back: Home
              </Link>
            </div>
          </div>
        ) : (
          <form style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,208,143,0.18)', borderRadius: '24px', padding: '30px', boxShadow: '0 30px 70px rgba(0,0,0,0.25)' }}>
            {errorMsg ? (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '14px 16px', color: '#fee2e2', marginBottom: '20px' }}>
                {errorMsg}
              </div>
            ) : null}

            <div style={{ display: 'grid', gap: '18px' }}>
              <input
                type="text"
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(229,208,143,0.2)', borderRadius: '12px', color: '#fff', outline: 'none' }}
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(229,208,143,0.2)', borderRadius: '12px', color: '#fff', outline: 'none' }}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(229,208,143,0.2)', borderRadius: '12px', color: '#fff', outline: 'none' }}
              />
              <input
                type="text"
                placeholder="VIP Access Code *"
                value={form.vipCode}
                onChange={(e) => setForm({ ...form, vipCode: e.target.value.toUpperCase() })}
                style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(229,208,143,0.2)', borderRadius: '12px', color: '#fff', outline: 'none', letterSpacing: '1px' }}
              />
            </div>
            <button
              type="button"
              onClick={submitReservation}
              disabled={status === 'submitting'}
              className="btn-primary"
              style={{ width: '100%', marginTop: '24px' }}
            >
              {status === 'submitting' ? 'Securing Reservation...' : 'Secure My Invitation'}
            </button>
          </form>
        )}
      </div>

      {showMenuGateModal && (
        <div className="tracker-overlay" role="dialog" aria-modal="true" style={{ zIndex: 200 }} onClick={() => setShowMenuGateModal(false)}>
          <div style={{ position: 'relative', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,208,143,0.18)', borderRadius: '24px', padding: '30px', maxWidth: '500px', boxShadow: '0 30px 70px rgba(0,0,0,0.25)' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowMenuGateModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'transparent', color: '#E5D08F', fontWeight: 700, fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>Menu Access</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#fff', marginBottom: '16px' }}>Scan to Order</h2>
              <span style={{ fontSize: '3rem', display: 'block', margin: '24px 0' }}>📱</span>
              <p style={{ color: '#D9D2C1', lineHeight: 1.7, margin: '20px 0', fontSize: '0.95rem' }}>To access the menu and place your order, you must scan the unique QR code at your table in the reception hall. This will unlock your personalized ordering experience.</p>
              <button onClick={() => setShowMenuGateModal(false)} className="btn-primary" style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '24px' }}>
                Got It, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReservationsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', vipCode: '', guestCategory: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketData, setTicketData] = useState({ code: '', name: '', guestCategory: '' });
  const [showMenuGateModal, setShowMenuGateModal] = useState(false);

  const submitReservation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.vipCode || !form.guestCategory) {
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
        setTicketData({ code: data.ticketId, name: data.name, guestCategory: data.guestCategory });
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
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 6vw, 4rem)', marginBottom: '18px' }}>Secure Your VIP Reservation</h1>
        <p style={{ color: '#D9D2C1', lineHeight: 1.8, marginBottom: '24px' }}>
          Enter your access code to confirm your attendance. Your designated Table Number will be delivered directly to your email (and SMS).
        </p>
        <p style={{ color: '#D9D2C1', lineHeight: 1.8, marginBottom: '40px' }}>
         A Seamless Reception: Once seated, simply scan your table&apos;s QR code to send your dining choices straight to the kitchen. Sit back, connect, and let the hospitality come to you without a single interruption.
        </p>

        {status === 'success' ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,208,143,0.18)', borderRadius: '24px', padding: '30px', boxShadow: '0 30px 70px rgba(0,0,0,0.25)' }}>
            <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Reservation Confirmed</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.1rem', marginBottom: '16px', color: '#fff' }}>{ticketData.name}</h2>
            <p style={{ color: '#D9D2C1', fontSize: '0.95rem', marginBottom: '20px' }}>
              Attending as: <span style={{ color: '#E5C07B', fontWeight: 600 }}>{ticketData.guestCategory}</span>
            </p>
            <p style={{ color: '#CBC1AF', marginBottom: '24px', lineHeight: 1.7 }}>Please save the VIP access code below and present it when requested at the event entrance.</p>
            <div style={{ background: 'rgba(212,175,55,0.08)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(212,175,55,0.25)' }}>
              <p style={{ color: '#D9D2C1', letterSpacing: '2px', fontSize: '0.75rem', marginBottom: '10px' }}>VIP PASS CODE</p>
              <p style={{ fontFamily: 'monospace', fontSize: '2rem', color: '#F5EFE0', margin: 0 }}>{ticketData.code}</p>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap', flexDirection: 'column' }}>
              <p style={{ color: '#E5C07B', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>📱 <strong>To access the menu:</strong> Scan the QR code at your table in the reception hall. This will unlock your personalized menu and ordering options.</p>
              <button onClick={() => router.push('/menu-gate')} className="btn-secondary" style={{ cursor: 'pointer', width: '100%' }}>
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
              <select
                value={form.guestCategory}
                onChange={(e) => setForm({ ...form, guestCategory: e.target.value })}
                style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(229,208,143,0.2)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '1rem', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(229,208,143,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '24px', paddingRight: '40px' }}
              >
                <option value="" disabled>
                  Select Guest Category *
                </option>
                <option value="Bride's Guest">Bride's Guest</option>
                <option value="Groom's Guest">Groom's Guest</option>
              </select>
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

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Reservations() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await fetch('/api/reservations');
        if (res.ok) setGuests(await res.json());
      } catch(e) {}
      setLoading(false);
    };
    fetchGuests();
  }, []);

  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Montserrat", sans-serif', backgroundColor: '#050505', color: '#FDFBF7', minHeight: '100vh' }}>
      <h1 style={{ color: '#D4AF37', fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', textAlign: 'center' }}>Guest Check-in</h1>
      {loading ? <p style={{ textAlign: 'center', color: '#aaa', marginTop: '50px' }}>Loading the Royal Guestlist...</p> : (
        <div style={{ maxWidth: '600px', margin: '30px auto', backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
          {guests.length === 0 ? <p style={{ color: '#aaa', textAlign: 'center' }}>No reservations found.</p> : guests.map((g, i) => (
            <div key={i} style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
              <span>{g.fullName || g.name}</span>
              <span style={{ color: '#D4AF37' }}>{g.reservationId}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '40px' }}><Link href="/admin" style={{ color: '#D4AF37', textDecoration: 'none', borderBottom: '1px solid #D4AF37' }}>← Back to Hub</Link></div>
    </div>
  );
}

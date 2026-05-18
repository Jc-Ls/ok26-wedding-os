'use client';
import Link from 'next/link';

export default function MasterAdminHub() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: '"Montserrat", sans-serif' }}>
      <header style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px', marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '2.5rem', margin: 0 }}>O'K26 Command Center</h1>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '10px' }}>Master Event Control</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* KITCHEN MODULE */}
        <Link href="/admin/kitchen" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', textAlign: 'center', transition: '0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.borderColor = '#D4AF37'} onMouseOut={e => e.currentTarget.style.borderColor = '#333'}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>👨‍🍳</span>
            <h2 style={{ color: '#D4AF37', margin: '0 0 10px 0', fontSize: '1.5rem' }}>Kitchen Engine</h2>
            <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>Live orders & VIP dispatch</p>
          </div>
        </Link>

        {/* MENU MANAGER MODULE */}
        <Link href="/admin/menu" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', textAlign: 'center', transition: '0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.borderColor = '#D4AF37'} onMouseOut={e => e.currentTarget.style.borderColor = '#333'}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🍽️</span>
            <h2 style={{ color: '#D4AF37', margin: '0 0 10px 0', fontSize: '1.5rem' }}>Menu Manager</h2>
            <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>Add/Edit Gala food selections</p>
          </div>
        </Link>

        {/* VIP PASS GENERATOR MODULE (Placeholder for our next step) */}
        <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', textAlign: 'center', opacity: 0.7 }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🎟️</span>
            <h2 style={{ color: '#D4AF37', margin: '0 0 10px 0', fontSize: '1.5rem' }}>VIP Ticket Hub</h2>
            <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>Manage MK26- Access Codes</p>
        </div>

      </div>
    </div>
  );
}

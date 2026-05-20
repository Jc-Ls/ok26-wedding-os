import Link from 'next/link';

export default function AdminHub() {
  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Montserrat", sans-serif', backgroundColor: '#050505', color: '#FDFBF7', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ color: '#D4AF37', fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', marginBottom: '10px' }}>Royal Command Center</h1>
      <p style={{ color: '#aaa', marginBottom: '40px' }}>Select a module to manage.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/admin/kitchen" style={{ textDecoration: 'none' }}><div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}><span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>👨‍🍳</span><h3 style={{ color: '#D4AF37', margin: 0 }}>Kitchen Engine</h3><p style={{ color: '#aaa', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Manage live orders</p></div></Link>
        <Link href="/admin/menu" style={{ textDecoration: 'none' }}><div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}><span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>📋</span><h3 style={{ color: '#D4AF37', margin: 0 }}>Menu Manager</h3><p style={{ color: '#aaa', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Add/Remove Food</p></div></Link>
        <Link href="/admin/vip" style={{ textDecoration: 'none' }}><div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}><span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>🎟️</span><h3 style={{ color: '#D4AF37', margin: 0 }}>VIP Codes</h3><p style={{ color: '#aaa', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Generate access passes</p></div></Link>
        <Link href="/admin/reservations" style={{ textDecoration: 'none' }}><div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}><span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>📖</span><h3 style={{ color: '#D4AF37', margin: 0 }}>Reservations</h3><p style={{ color: '#aaa', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Guest list & check-in</p></div></Link>
      </div>
      <Link href="/" style={{ display: 'inline-block', marginTop: '50px', color: '#D4AF37', textDecoration: 'none', borderBottom: '1px solid #D4AF37' }}>← Return to Portal</Link>
    </div>
  );
}

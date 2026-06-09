'use client';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';

const guests = [
  { name: 'Mall. Abdulrahman Abdulrazak (CON)', title: 'The Executive Governor of Kwara State' },
  { name: 'Mall. Mustapha M Ishowo', title: 'Executive Secretary, Kwara State APC' },
  { name: 'Engr. Femi Sanni Araba', title: 'CEO / Founder, Flow FM Station 90.7FM Araba Radio' },
  { name: 'Prof. Abdulkadri Laaro', title: 'Dean, Faculty of Education, Kwasu' },
  { name: 'Mr. Alabi Amuda Zeriki', title: 'Retd. Perm. Sec., LGSC' },
  { name: 'Mr. Habeeb Bolaji', title: 'NULGE Chairman, Ilorin South' },
  { name: 'Mr. Lanre Gambari', title: 'Dangote Group of Company' },
  { name: 'Alhaji Olaitan Jimoh', title: 'Former NNPC Manager' },
  { name: 'Alhaji Abdul Kareem Lambe', title: 'Former Commissioner 1, LGSC' },
];

export default function SpecialGuestsPage() {
  return (
    <main className="modern-page" style={{ background: 'linear-gradient(180deg, rgba(4,10,20,0.98), rgba(6,14,24,1))' }}>
      <div className="modern-inner">
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
          The Special Invitees
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, marginBottom: '24px' }}>Guest Section</h1>
        <p style={{ maxWidth: 760, marginBottom: '42px', color: '#D9D2C1', lineHeight: 1.8, fontSize: '1rem' }}>
          These cards present the distinguished invitees with the guest name at the top and their formal title below.
        </p>

        <div className="edge-grid compact">
          {guests.map((guest) => (
            <TiltCard key={guest.name} className="compact-card">
              <h2 style={{ margin: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.85rem', color: '#fff' }}>{guest.name}</h2>
              <p style={{ marginTop: '14px', color: '#D9D2C1', fontSize: '0.95rem', lineHeight: 1.8 }}>{guest.title}</p>
            </TiltCard>
          ))}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <Link href="/meet-the-olowojares" className="btn-secondary">
            Back: Meet the Olowojares
          </Link>
          <Link href="/traditions" className="btn-primary">
            Next: Traditions
          </Link>
        </div>
      </div>
    </main>
  );
}

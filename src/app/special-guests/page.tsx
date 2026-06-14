'use client';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';

const guests = [
  { name: 'Mall. Abdulrahman Abdulrazak (CON)', title: 'The Executive Governor of Kwara State' },
  { name: 'Mall. Mustapha M Ishowo', title: 'Executive Secretary, Kwara State APC' },
  { name: 'Engr. Femi Sanni Araba', title: 'CEO / Founder, Flow FM Station 92.7FM Araba Radio' },
  { name: 'Prof. Ibrahim Laro ABUBAKAR', title: 'Dean, Faculty of Education, Kwasu' },
  { name: 'Mr. Alabi Amuda Zeriki', title: 'Retd. Perm. Sec., LGSC' },
  { name: 'Mr. Habeeb Bolaji', title: 'NULGE Chairman, Ilorin South' },
  { name: 'Mr. Lanre Gambari', title: 'Dangote Group of Company' },
  { name: 'Alhaji Olaitan Jimoh', title: 'Former NNPC Manager' },
  { name: 'Alhaji Abdul Kareem Lambe', title: 'Former Commissioner 1, LGSC' },
   { name: 'Hon. Abdulgfar Ahmed (Thecuteabiola)', title: 'TCA AUTOS' },
];

export default function SpecialGuestsPage() {
  return (
    <main className="modern-page" style={{ backgroundImage: 'linear-gradient(135deg, rgba(10,20,47,0.85) 0%, rgba(20,35,70,0.9) 50%, rgba(10,20,47,0.85) 100%)', backgroundAttachment: 'fixed' }}>
      <div className="modern-inner">
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
          The Special Invitees
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, marginBottom: '24px' }}>Distinguished Guests & Dignitaries</h1>
        <p style={{ maxWidth: 760, marginBottom: '42px', color: '#D9D2C1', lineHeight: 1.8, fontSize: '1rem' }}>
          We are honored to welcome exceptional leaders from government, business, education, and community service who have shaped the landscape of Kwara State and beyond. Their presence elevates this celebration to a truly distinguished occasion.
        </p>

        <div className="edge-grid compact">
          {guests.map((guest) => (
            <TiltCard key={guest.name} className="compact-card">
              <h2 style={{ margin: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.85rem', color: '#fff' }}>{guest.name}</h2>
              <p style={{ marginTop: '14px', color: '#D9D2C1', fontSize: '0.95rem', lineHeight: 1.8 }}>{guest.title}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </main>
  );
}

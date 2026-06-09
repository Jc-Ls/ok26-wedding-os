'use client';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';

const couple = [
  {
    role: 'Groom',
    name: 'Muhammed Lawal Olowojare',
    headline: 'A visionary leader balancing legacy, family, and celebration.',
    biography:
      'Muhammed brings a refined spirit and bold leadership to every moment of this wedding experience. His passion for family, culture, and premium hospitality sets the tone for a truly unforgettable gala.',
  },
  {
    role: 'Bride',
    name: 'Khoathar',
    headline: 'A creative curator of beauty, grace, and unforgettable celebration.',
    biography:
      'Khoathar’s elegant vision guides every detail of this luxury celebration, blending tradition with modern warmth. Her style and heart create an inspiring atmosphere for family and guests alike.',
  },
];

const hosts = [
  {
    role: 'The Host',
    name: 'Engr. Hammed Olowojare',
    subtitle: 'CEO / MD Malad Global Concept FCT',
  },
  {
    role: 'The Father of the Day',
    name: 'Alhaji. Hakeem Olademeji Lawal',
    subtitle: 'CEO / Founder Awilya Foundation',
  },
  {
    role: 'Mother of the Day',
    name: 'Alhaja. Binta A Logun',
    subtitle: 'Proprietress Five-ways Int’l School Ilorin',
  },
];

export default function MeetTheCouplePage() {
  return (
    <main className="modern-page" style={{ background: 'radial-gradient(circle at top, rgba(212,175,55,0.12), transparent 35%), #060e18' }}>
      <div className="modern-inner">
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
          The Couple
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, marginBottom: '24px' }}>Muhammed &amp; Khoathar</h1>
        <p style={{ maxWidth: 760, lineHeight: 1.8, color: '#D9D2C1', fontSize: '1rem', marginBottom: '42px' }}>
          Discover the story of the Olowojares: a premium union of heritage, warmth, and exquisite celebration. This page introduces the two individuals at the heart of the gala with premium elegance and poetic presence.
        </p>

        <div className="edge-grid">
          {couple.map((person) => (
            <TiltCard key={person.name}>
              <span style={{ display: 'inline-block', color: '#F9A8D4', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem', marginBottom: '14px' }}>
                {person.role}
              </span>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', margin: '0 0 16px 0', color: '#fff' }}>{person.name}</h2>
              <p style={{ color: '#E5D8BA', fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>{person.headline}</p>
              <p style={{ color: '#CBC1AF', lineHeight: 1.85, fontSize: '0.98rem' }}>{person.biography}</p>
            </TiltCard>
          ))}
        </div>

        <section style={{ marginTop: '60px' }}>
          <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
            Hosts & Parents
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.3rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '18px', color: '#fff' }}>
            Honoured Guests Behind the Ceremony
          </h2>
          <p style={{ maxWidth: 760, lineHeight: 1.8, color: '#D9D2C1', fontSize: '1rem', marginBottom: '36px' }}>
            After introducing the groom and bride, we honour the host and the parents of the day who play a central role in welcoming guests and guiding the celebration.
          </p>

          <div className="edge-grid compact">
            {hosts.map((person) => (
              <TiltCard key={person.name} className="compact-card">
                <span style={{ display: 'inline-block', color: '#F9A8D4', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem', marginBottom: '14px' }}>
                  {person.role}
                </span>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', margin: '0 0 14px 0', color: '#fff' }}>{person.name}</h3>
                <p style={{ color: '#D9D2C1', fontSize: '0.98rem', lineHeight: 1.75, margin: 0 }}>{person.subtitle}</p>
              </TiltCard>
            ))}
          </div>
        </section>

        <div style={{ marginTop: '48px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
          <Link href="/meet-the-olowojares" className="btn-primary">
            Next: Meet the Olowojares
          </Link>
        </div>
      </div>
    </main>
  );
}

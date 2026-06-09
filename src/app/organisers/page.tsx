'use client';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';

const organisers = [
  {
    name: 'Amina Lawal',
    title: 'Chief Event Director',
    summary:
      'Oversees the entire gala with a focus on premium guest experience, timeline precision, and exquisite presentation.',
  },
  {
    name: 'James Oyebanji',
    title: 'Creative Hospitality Lead',
    summary:
      'Curates luxury service, décor, and ambience to ensure every moment feels exceptionally polished.',
  },
  {
    name: 'Fatima Bello',
    title: 'Guest Relations Director',
    summary:
      'Coordinates VIP support, reservations, and on-site guest care for a seamless wedding experience.',
  },
];

export default function OrganisersPage() {
  return (
    <main className="modern-page" style={{ background: 'radial-gradient(circle at top, rgba(249,168,212,0.12), transparent 30%), #05070f' }}>
      <div className="modern-inner">
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
          The Organisers
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, marginBottom: '24px' }}>Crafting a Premium Gala Experience</h1>
        <p style={{ maxWidth: 760, lineHeight: 1.8, color: '#D9D2C1', fontSize: '1rem', marginBottom: '42px' }}>
          Meet the team behind the scenes: the designers, coordinators, and guest-service experts building every refined detail of this wedding celebration.
        </p>

        <div className="edge-grid compact">
          {organisers.map((organiser) => (
            <TiltCard key={organiser.name} className="compact-card">
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '12px', color: '#fff' }}>{organiser.name}</h2>
              <p style={{ color: '#E5D8BA', fontWeight: 700, marginBottom: '18px' }}>{organiser.title}</p>
              <p style={{ color: '#CBC1AF', lineHeight: 1.85 }}>{organiser.summary}</p>
            </TiltCard>
          ))}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <Link href="/traditions" className="btn-secondary">
            Back: Traditions
          </Link>
          <Link href="/reservations" className="btn-primary">
            Next: Reservations
          </Link>
        </div>
      </div>
    </main>
  );
}

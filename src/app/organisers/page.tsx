'use client';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';

const organisers = [
  {
    name: 'Yusuf Kayode Yusuf',
    title: 'Chief Event Director',
    contact: '',
    summary:
      'Oversees the entire gala with a focus on premium guest experience, timeline precision, and exquisite presentation.',
  },
  {
    name: 'Idriz Salman',
    title: 'Creative Hospitality Lead',
    contact: '',
    summary:
      'Curates luxury service, décor, and ambience to ensure every moment feels exceptionally polished.',
  },
  {
    name: 'Okandeji Kehinde',
    title: 'Guest Relations Director',
    contact: '',
    summary:
      'Coordinates VIP support, reservations, and on-site guest care for a seamless wedding experience.',
  },
  {
    name: 'Olowojare Abubakar',
    title: 'Guest Relations Director',
    contact: '',
    summary:
      'Coordinates VIP support, reservations, and on-site guest care for a seamless wedding experience.',
  },
  {
    name: 'Abdulrasaq Sulu-Gambari',
    image: '/organisers/Abdulrasaq_Sulugambari.png',
     contact: '07012774756',
    title: 'FrontEnd Dev',
    summary:
      'Coordinates VIP support, reservations, and on-site guest care for a seamless wedding experience.',
  },
  {
    name: 'Abdulwasiu',
    title: 'FrontEnd Dev',
    contact: '07039575635',
    summary:
      'Coordinates VIP support, reservations, and on-site guest care for a seamless wedding experience.',
  },
  {
    name: 'Abidemi',
    title: 'FrontEnd Dev',
    contact: '09038792949',
    summary:
      'Coordinates VIP support, reservations, and on-site guest care for a seamless wedding experience.',
  },
  {
    name: 'Faruq',
    title: 'FrontEnd Dev',
    contact: '09114326578',
    summary:
      'Coordinates VIP support, reservations, and on-site guest care for a seamless wedding experience.',
  },
];



export default function OrganisersPage() {
  return (
    <main className="modern-page">
      <div className="modern-inner">
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
          The Organisers
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, marginBottom: '24px' }}>Crafting a Premium Gala Experience</h1>
        <p style={{ maxWidth: 760, lineHeight: 1.8, color: '#D9D2C1', fontSize: '1rem', marginBottom: '42px' }}>
          Meet the team behind the scenes: the designers, coordinators, and guest-service experts building every refined detail of this wedding celebration.
        </p>

        <div className="edge-grid compact">
          {organisers.map((organiser) => {
            const slug = organiser.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            const imgSrc = organiser.image ?? `/organisers/${slug}.jpg`;
            const initials = organiser.name
              .split(' ')
              .filter(Boolean)
              .map((p) => p[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <TiltCard key={slug} className="compact-card">
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: '0 0 auto' }}>
                    <img
                      src={imgSrc}
                      alt={organiser.name}
                      className="organiser-avatar"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                        const sibling = el.nextElementSibling as HTMLElement | null;
                        if (sibling) sibling.style.display = 'flex';
                      }}
                    />
                    <div className="organiser-avatar-fallback" aria-hidden style={{ display: 'none' }}>
                      {initials}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', margin: 0, color: '#fff' }}>{organiser.name}</h2>
                    <p style={{ color: '#E5D8BA', fontWeight: 700, margin: '8px 0 18px' }}>{organiser.title}</p>
                    <p style={{ color: '#CBC1AF', lineHeight: 1.85 }}>{organiser.summary}</p>
                  </div>
                </div>
              </TiltCard>
            );
          })}
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

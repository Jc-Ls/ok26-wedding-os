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
    name: 'Kaothar Abdulfatai',
    headline: 'A creative curator of beauty, grace, and unforgettable celebration.',
    biography:
      'Kaothar’s elegant vision guides every detail of this luxury celebration, blending tradition with modern warmth. Her style and heart create an inspiring atmosphere for family and guests alike.',
  },
];


export default function MeetTheCouplePage() {
  return (
    <main className="modern-page" style={{ backgroundImage: 'linear-gradient(135deg, rgba(10,20,47,0.85) 0%, rgba(20,35,70,0.9) 50%, rgba(10,20,47,0.85) 100%)', backgroundAttachment: 'fixed' }}>
      <div className="modern-inner">
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
          The Couple
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, marginBottom: '24px' }}>Muhammed &amp; Kaothar</h1>
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
      </div>
    </main>
  );
}

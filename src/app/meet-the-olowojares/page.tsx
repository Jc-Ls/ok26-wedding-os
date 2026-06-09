'use client';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';

const familyCards = [
  {
    title: 'Olowojare Family',
    description:
      'A revered lineage known for entrepreneurship, generosity, and cultural pride. The Olowojare family anchors this celebration with warmth and a distinguished presence.',
    highlights: ['Legacy of leadership', 'Community stewardship', 'Generations of elegance'],
  },
  {
    title: 'Sarumi Family',
    description:
      'A family shaped by creativity, grace, and a commitment to refined celebration. Their support and hospitality make this wedding truly exceptional.',
    highlights: ['Artful hospitality', 'Cultural heritage', 'Thoughtful collaboration'],
  },
];

export default function MeetTheOlowojaresPage() {
  return (
    <main className="modern-page">
      <div className="modern-inner">
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
          Meet The Olowojares
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, marginBottom: '24px' }}>A Family Celebration in Premium Style</h1>
        <p style={{ maxWidth: 760, lineHeight: 1.8, color: '#D9D2C1', fontSize: '1rem', marginBottom: '42px' }}>
          Introducing the family support behind Muhammed and Kaothar: two households united by meaningful tradition, elevated hospitality, and a refined sense of occasion.
        </p>

        <div className="edge-grid">
          {familyCards.map((card) => (
            <TiltCard key={card.title}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '16px', color: '#fff' }}>{card.title}</h2>
              <p style={{ color: '#E5D8BA', lineHeight: 1.85, marginBottom: '22px' }}>{card.description}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
                {card.highlights.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#D9D2C1' }}>
                    <span style={{ color: '#D4AF37', fontSize: '1.1rem', lineHeight: 1 }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          ))}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <Link href="/meet-the-couple" className="btn-secondary">
            Back: Meet the Couple
          </Link>
          <Link href="/special-guests" className="btn-primary">
            Next: Special Guests
          </Link>
        </div>
      </div>
    </main>
  );
}

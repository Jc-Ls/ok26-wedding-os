'use client';
import Link from 'next/link';
import PageFooter from '@/components/PageFooter';

const coupleProfiles = [
  {
    role: 'The Groom',
    name: 'Muhammed Olowojare',
    biography:
      'A visionary leader shaping tomorrow with elegance, purpose, and warmth. Engr. Hammed brings family, faith, and timeless celebration together.',
    career: 'CEO / MD, Malad Global Concept FCT',
    achievements: ['Business leader', 'Community builder', 'Family first'],
    gallery: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop',
    ],
  },
  {
    role: 'The Bride',
    name: 'Kaothar Olowojare',
    biography:
      'A graceful partner with a radiant spirit. Her journey blends tradition, creativity, and a heart for unforgettable celebrations.',
    career: 'Creative Advisor & Event Curator',
    achievements: ['Inspired design', 'Cultural storyteller', 'Luxury curator'],
    gallery: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop',
    ],
  },
];

const timelineItems = [
  {
    label: 'First Meeting',
    description: 'A meaningful meeting that charted the course of a beautiful story.',
  },
  {
    label: 'Courtship',
    description: 'A season of laughter, care, and shared dreams.',
  },
  {
    label: 'Engagement',
    description: 'A joyful promise sealed with family blessings.',
  },
  {
    label: 'Wedding Journey',
    description: 'Three days of celebration, culture, and celebration.',
  },
];

export default function CoupleePage() {
  return (
    <main className="page-shell">
      <nav aria-label="Primary navigation">
        <Link href="/" className="logo">
          THE OLOWOJARE'S
        </Link>
        <div className="nav-actions">
          <Link href="/itinerary">Schedule</Link>
          <Link href="/couple">Couple</Link>
          <Link href="/honorees">Honorees</Link>
          <Link href="#footer">Support</Link>
        </div>
      </nav>

      <section className="section" id="couple">
        <div className="section-heading">
          <span>Meet the Couple</span>
          <h2>Stories, portraits, and the journey to the altar</h2>
        </div>

        <div className="profile-grid">
          {coupleProfiles.map((person) => (
            <article key={person.role} className="profile-card">
              <p className="eyebrow">{person.role}</p>
              <h3>{person.name}</h3>
              <p>{person.biography}</p>
              <div className="profile-meta">{person.career}</div>
              <ul className="feature-list">
                {person.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="gallery-grid">
                {person.gallery.map((src) => (
                  <div key={src} className="gallery-item" style={{ backgroundImage: `url(${src})` }} />
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="timeline-panel">
          <p className="eyebrow">Our Love Story</p>
          <div className="timeline-list">
            {timelineItems.map((item) => (
              <div key={item.label} className="timeline-item">
                <span className="timeline-marker" />
                <div>
                  <h4>{item.label}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageFooter
        previousHref="/"
        previousLabel="Home"
        nextHref="/honorees"
        nextLabel="Honorees"
      />
    </main>
  );
}

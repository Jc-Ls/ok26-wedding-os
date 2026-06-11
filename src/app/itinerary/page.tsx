'use client';
import Link from 'next/link';

const scheduleItems = [
  {
    title: 'SISA',
    day: 'DAY 1',
    date: '25 June 2026',
    time: 'Evening',
    venue: "Olowojare's Compound, Adeta, Ilorin",
    query: "Olowojare's Compound Adeta Ilorin",
    datetime: '2026-06-25T20:00:00',
    description: 'Traditional activities popularly known as SISA.',
  },
  {
    title: 'AISUN (Wedding Eve)',
    day: 'DAY 1',
    date: '25 June 2026',
    time: '9:00 PM',
    venue: "Olowojare's Compound, Adeta, Ilorin",
    query: "Olowojare's Compound Adeta Ilorin",
    datetime: '2026-06-25T21:00:00',
    description: 'Wedding Eve celebration at Olowojare\'s compound.',
  },
  {
    title: 'WOLIMAH',
    day: 'DAY 2',
    date: '26 June 2026',
    time: '9:00 AM',
    venue: 'Akala Central Mosque, Adeta, Ilorin',
    query: 'Akala Central Mosque Adeta Ilorin',
    datetime: '2026-06-26T09:00:00',
    description: 'Wolimat ceremony begins at Akala Central Mosque.',
  },
  {
    title: 'NIKKAH',
    day: 'DAY 2',
    date: '26 June 2026',
    time: 'After Wolimah',
    venue: 'Sarumi Central Mosque, Ode Alfa NDA, Ilorin',
    query: 'Sarumi Central Mosque Ode Alfa NDA Ilorin',
    datetime: '2026-06-26T12:00:00',
    description: 'Nikkah ceremony at Sarumi Central Mosque after Wolimah.',
  },
  {
    title: 'RECEPTION & DINNER',
    day: 'DAY 3',
    date: '27 June 2026',
    time: '7:00 PM',
    venue: 'Al-Kareem Event Center, Opposite Air Force Junction, Oloje, Ilorin',
    query: 'Al-Kareem Event Center Oloje Ilorin',
    datetime: '2026-06-27T19:00:00',
    description: 'Grand reception and dinner to conclude the celebration.',
  },
];

const directionsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function ItineraryPage() {
  return (
    <main className="page-shell" style={{ backgroundImage: 'linear-gradient(135deg, rgba(10,20,47,0.85) 0%, rgba(20,35,70,0.9) 50%, rgba(10,20,47,0.85) 100%)', backgroundAttachment: 'fixed' }}>
      <nav aria-label="Primary navigation">
        <Link href="/" className="logo">
          THE OLOWOJARE&apos;S
        </Link>
        <div className="nav-actions">
          <Link href="/itinerary">Schedule</Link>
          <Link href="/meet-the-couple">Couple</Link>
          <Link href="/honorees">Honorees</Link>
          <Link href="#footer">Support</Link>
        </div>
      </nav>

      <section className="section" id="schedule">
        <div className="section-heading">
          <span>Event Schedule</span>
          <h2>Follow the full celebration journey</h2>
        </div>

        <div className="schedule-grid">
          {scheduleItems.map((item) => (
            <article key={item.title} className="schedule-card">
              <div className="schedule-top">
                <span className="badge">{item.day}</span>
                <span className="meta">{item.date}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="schedule-time">{item.time}</p>
              <p className="schedule-location">{item.venue}</p>
              {item.description ? <p className="schedule-description">{item.description}</p> : null}
              <div className="schedule-actions">
                <a href={directionsUrl(item.query)} target="_blank" rel="noreferrer" className="btn-link">
                  Open in Google Maps
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      
    </main>
  );
}

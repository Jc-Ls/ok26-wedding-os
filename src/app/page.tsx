'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const heroSlides = [
  {
    src: 'https://res.cloudinary.com/din74ljlu/image/upload/v1779078967/SAVE_20260518_242717_kylnnd.jpg',
    caption: 'A luxury celebration in Ilorin',
  },
  {
    src: 'https://res.cloudinary.com/din74ljlu/image/upload/v1779079235/SAVE_20260518_242642_vyqfjk.jpg',
    caption: 'Joy, color, and family',
  },
  {
    src: 'https://res.cloudinary.com/din74ljlu/image/upload/v1779080144/SAVE_20260518_242650_wgqxex.jpg',
    caption: 'A premium wedding experience',
  },
];

const coupleProfiles = [
  {
    role: 'The Groom',
    name: 'Engr. Hammed Olowojare',
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
    description: 'Wedding Eve celebration at Olowojare’s compound.',
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

const dressColors = [
  { label: 'Gold & Cream', tone: '#E5C07B' },
  { label: 'Midnight Navy', tone: '#09121F' },
  { label: 'Blush Pink', tone: '#F9A8D4' },
  { label: 'Ivory Lace', tone: '#F8F1E7' },
];

const sponsorInfo = {
  name: 'BABA-K TICKETHUB',
  description:
    'A premium sponsor celebration for guests joining the royal wedding experience.',
  cta: 'Explore Sponsorship',
};

const assistants = [
  { label: 'AI Wedding Assistant', href: '#assistant' },
  { label: 'Watch Live', href: '#live' },
  { label: 'Get Directions', href: '#schedule' },
  { label: 'Contact Support', href: '#footer' },
];

const LIVE_STREAM_URL =
  process.env.NEXT_PUBLIC_LIVESTREAM_URL ||
  'https://www.youtube.com/watch?v=live';

function formatCountdown(milliseconds: number) {
  if (milliseconds <= 0) return '00d 00h 00m 00s';
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(remainder).padStart(2, '0')}s`;
}

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [splashComplete, setSplashComplete] = useState(false);
  const [showHub, setShowHub] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [musicOn, setMusicOn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplashComplete(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const heroTimer = setInterval(
      () => setActiveSlide((current) => (current + 1) % heroSlides.length),
      5000,
    );
    return () => clearInterval(heroTimer);
  }, []);

  const currentTimestamp = currentTime.getTime();
  const eventStart = new Date('2026-06-25T18:00:00').getTime();
  const eventEnd = new Date('2026-06-28T02:00:00').getTime();
  const eventPhase = useMemo(() => {
    if (currentTimestamp >= eventEnd) return 'post';
    if (currentTimestamp >= eventStart) return 'live';
    return 'pre';
  }, [currentTimestamp]);

  const nextEvent = useMemo(() => {
    const upcoming = scheduleItems.find((item) => new Date(item.datetime).getTime() > currentTimestamp);
    return upcoming || scheduleItems[scheduleItems.length - 1];
  }, [currentTimestamp]);

  const countdownTarget = useMemo(
    () => new Date('2026-06-25T18:00:00').getTime() - currentTimestamp,
    [currentTimestamp],
  );

  const eventStatusLabel =
    eventPhase === 'post'
      ? 'Post-Wedding Archive'
      : eventPhase === 'live'
      ? 'Live Event Mode'
      : 'Countdown to Celebration';

  const eventStatusDescription =
    eventPhase === 'post'
      ? 'Thank you for celebrating the Olowojare wedding. Browse highlights, memories, and recorded livestreams.'
      : eventPhase === 'live'
      ? 'The celebration is happening now. Watch live, follow the schedule, and stay connected.'
      : 'Join us soon for a three-day celebration of culture, joy, and luxury in Ilorin.';

  const liveEventLabel =
    eventPhase === 'live' ? '🔴 LIVE NOW' : eventPhase === 'pre' ? '⏳ Coming Soon' : '🎉 Celebration Complete';

  function LiveDashboard({ currentEvent }: { currentEvent: any }) {
    const upcoming = nextEvent;
    const total = scheduleItems.length;
    const completed = scheduleItems.filter((s) => new Date(s.datetime).getTime() <= currentTimestamp).length;
    const progressPct = Math.min(100, Math.round((completed / Math.max(1, total)) * 100));
    return (
      <div className="live-dashboard" role="region" aria-label="Live event dashboard">
        <div className="live-header">
          <div className="live-now">
            <div className="live-eyebrow">Now Showing</div>
            <div className="live-title">{currentEvent?.title || 'Live Event'}</div>
            <div className="live-venue">{currentEvent?.venue || ''}</div>
          </div>
          <div className="live-next">
            <div className="live-eyebrow">What's Next</div>
            <div className="live-next-title">{upcoming?.title}</div>
            <div className="live-next-time">{upcoming?.date}</div>
          </div>
        </div>

        <div className="live-progress">
          <div className="progress-meta">
            <div className="progress-label">Progress</div>
            <div className="progress-percent">{progressPct}%</div>
          </div>
          <div className="progress-track" aria-hidden>
            <motion.div className="progress-fill" initial={{ scaleX: 0 }} animate={{ scaleX: progressPct / 100 }} transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }} style={{ transformOrigin: 'left center' }} />
          </div>
          <div className="live-items">
            {scheduleItems.map((s, idx) => {
              const started = new Date(s.datetime).getTime() <= currentTimestamp;
              const isCurrent = currentEvent?.title === s.title || (!started && idx === completed);
              return (
                <motion.div
                  key={s.title}
                  className={`live-item ${started ? 'started' : ''} ${isCurrent ? 'current' : ''}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div className="live-dot" aria-hidden
                    animate={isCurrent ? { scale: [1, 1.35, 1], opacity: [1, 0.7, 1] } : { scale: 1 }}
                    transition={isCurrent ? { duration: 1.6, repeat: Infinity } : { duration: 0 }}
                  />
                  <div className="live-item-text">
                    <div className="live-item-title">{s.title}</div>
                    <div className="live-item-meta">{s.date} • {s.time}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function ChatAssistant({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<{ from: 'user' | 'assistant'; text: string }[]>([]);
    const [input, setInput] = useState('');

    const send = () => {
      if (!input.trim()) return;
      const userMsg = { from: 'user' as const, text: input.trim() };
      setMessages((m) => [...m, userMsg]);
      setInput('');
      // lightweight stubbed assistant reply
      setTimeout(() => {
        setMessages((m) => [...m, { from: 'assistant', text: `Thanks — I can help with schedule, directions, RSVP, menu, and gifts. For example: '${userMsg.text}'` }]);
      }, 600);
    };

    return (
      <div className="tracker-overlay" role="dialog" aria-modal="true" style={{ zIndex: 200 }}>
        <div className="tracker-card" style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>AI Wedding Assistant</h3>
            <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: '#E5D08F', fontWeight: 700 }}>Close</button>
          </div>
          <div style={{ marginTop: 16, maxHeight: 320, overflow: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 10, textAlign: m.from === 'user' ? 'right' : 'left' }}>
                <div style={{ display: 'inline-block', background: m.from === 'user' ? 'rgba(229,208,143,0.9)' : 'rgba(255,255,255,0.06)', color: m.from === 'user' ? '#000' : '#e6e6e6', padding: '8px 12px', borderRadius: 10 }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about the schedule, RSVP, or gifts" style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid rgba(229,208,143,0.15)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
            <button onClick={send} className="btn-primary" type="button">Send</button>
          </div>
        </div>
      </div>
    );
  }

  const directionsUrl = (query: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <main className="page-shell">
      {!splashComplete && (
        <div className="splash-screen">
          <div className="splash-panel">
            <p className="splash-eyebrow">The Olowojare's Wedding</p>
            <h1 className="splash-title">A Luxury Celebration in Ilorin</h1>
            <p className="splash-copy">A memorable entrance into a premium wedding experience.</p>
            <div className="splash-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSplashComplete(true)}
              >
                Enter Website
              </button>
              <button
                type="button"
                className={`btn-secondary ${musicOn ? 'active' : ''}`}
                onClick={() => setMusicOn((value) => !value)}
              >
                {musicOn ? 'Music On' : 'Music Off'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="carousel-container">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.src}
            className={`slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.src})` }}
            aria-hidden={index !== activeSlide}
          />
        ))}
        <div className="overlay" />
        <div className="particle-layer" aria-hidden="true">
          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
          <span className="particle particle-4" />
        </div>
      </div>

      <nav aria-label="Primary navigation">
        <Link href="/" className="logo">
          THE OLOWOJARE'S
        </Link>
        <div className="nav-actions">
          <Link href="#schedule">Schedule</Link>
          <Link href="#couple">Couple</Link>
          <Link href="#rsvp">RSVP</Link>
          <Link href="#footer">Support</Link>
        </div>
      </nav>

      <section className="hero" id="hero">
        <p className="welcome-text">A luxury digital wedding experience for family and guests</p>
        <h1 className="couple">THE OLOWOJARE'S</h1>
        <p className="hero-copy">June 25–27, 2026 | Ilorin, Nigeria</p>

        <div className="hero-buttons">
          <Link href="/reserve" className="btn-primary">
            RSVP Now
          </Link>
          <a href="#schedule" className="btn-secondary">
            View Schedule
          </a>
          {eventPhase === 'live' ? (
            <a href={LIVE_STREAM_URL} target="_blank" rel="noreferrer" className="btn-secondary">
              Watch Live
            </a>
          ) : (
            <button className="btn-secondary disabled" type="button" disabled>
              Watch Live
            </button>
          )}
        </div>

        <div className="hero-status-card">
          <div>
            <span className="status-label">{liveEventLabel}</span>
            <h2>{eventStatusLabel}</h2>
            <p>{eventStatusDescription}</p>
          </div>
          {eventPhase !== 'post' && (
            <div className="countdown">
              <span>Starts in</span>
              <strong>{formatCountdown(countdownTarget)}</strong>
            </div>
          )}
        </div>
        <div id="live" />
        {eventPhase === 'live' && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 20, zIndex: 12 }}>
            <div style={{ width: '100%', maxWidth: 980, display: 'grid', gap: 14 }}>
              <div style={{ background: 'rgba(0,0,0,0.6)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(229,208,143,0.08)' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe title="Live Stream" src={LIVE_STREAM_URL} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen />
                </div>
              </div>

              <LiveDashboard currentEvent={nextEvent} />
            </div>
          </div>
        )}
      </section>

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

      <section className="section rsvp-panel" id="rsvp">
        <div className="section-heading">
          <span>RSVP Experience</span>
          <h2>Confirm your attendance with ease</h2>
        </div>
        <div className="rsvp-card">
          <p className="rsvp-text">
            Share your details, attendance, dietary notes, and special requests so we can welcome you in luxury.
          </p>
          <div className="rsvp-grid">
            <div>
              <p className="small-label">Step 1</p>
              <h3>Personal Information</h3>
            </div>
            <div>
              <p className="small-label">Step 2</p>
              <h3>Attendance Details</h3>
            </div>
            <div>
              <p className="small-label">Step 3</p>
              <h3>Special Requests</h3>
            </div>
            <div>
              <p className="small-label">Step 4</p>
              <h3>Confirmation</h3>
            </div>
          </div>
          <Link href="/reserve" className="btn-primary">
            Confirm Attendance
          </Link>
        </div>
      </section>

      <section className="section dress-section">
        <div className="section-heading">
          <span>Dress Code</span>
          <h2>Elegant style guidance for every guest</h2>
        </div>
        <div className="dress-grid">
          {dressColors.map((item) => (
            <div key={item.label} className="dress-card">
              <div className="dress-swatch" style={{ backgroundColor: item.tone }} />
              <h3>{item.label}</h3>
            </div>
          ))}
        </div>
        <p className="dress-copy">
          Embrace soft luxury, traditional elegance, and a polished celebration palette across the three-day wedding experience.
        </p>
      </section>

      <section className="section" id="food-preview">
        <div className="section-heading">
          <span>Food Ordering</span>
          <h2>Premium menu experience with fast mobile ordering</h2>
        </div>
        <div className="food-grid">
          <article className="food-card">
            <div className="food-visual" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1662481028751-bb3d5eb9231f?q=80&w=600&auto=format&fit=crop)' }} />
            <div className="food-body">
              <h3>Royal Jollof Rice</h3>
              <p>Signature celebration plate with spicy beef and festive sides.</p>
              <span className="price">₦12,000</span>
            </div>
          </article>
          <article className="food-card">
            <div className="food-visual" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=600&auto=format&fit=crop)' }} />
            <div className="food-body">
              <h3>Amala & Ewedu</h3>
              <p>Traditional luxury pairing served with carefully selected meats.</p>
              <span className="price">₦10,500</span>
            </div>
          </article>
          <article className="food-card">
            <div className="food-visual" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop)' }} />
            <div className="food-body">
              <h3>Chilled Zobo</h3>
              <p>Refreshing floral drink crafted for the wedding celebration.</p>
              <span className="price">₦2,500</span>
            </div>
          </article>
        </div>
        <Link href="/menu-gate" className="btn-secondary">
          Browse Full Menu
        </Link>
      </section>

      <section className="section gift-section" id="gift">
        <div className="section-heading">
          <span>Bless the Couple</span>
          <h2>Premium gifting experience with secure payment support</h2>
        </div>
        <div className="gift-grid">
          <div className="gift-card">
            <h3>₦15,000</h3>
            <p>Support the wedding décor and guest hospitality.</p>
          </div>
          <div className="gift-card featured">
            <h3>₦30,000</h3>
            <p>Help create a memorable celebration for everyone.</p>
          </div>
          <div className="gift-card">
            <h3>₦50,000+</h3>
            <p>Contribute toward premium reception experiences.</p>
          </div>
        </div>
        <p className="gift-note">
          Payment verification and gift receipts are handled by the backend services. Support includes OPay-ready payment integration and transaction reference tracking.
        </p>
      </section>

      <section className="section about-section" id="assistant">
        <div className="section-heading">
          <span>About the Celebration</span>
          <h2>Hosts, tradition, and distinguished guests</h2>
        </div>
        <div className="about-grid">
          <article className="about-card">
            <p className="eyebrow">The Host</p>
            <h3>Engr. Hammed Olowojare</h3>
            <p>CEO/MD Malad Global Concept FCT</p>
          </article>
          <article className="about-card">
            <p className="eyebrow">Father of the Day</p>
            <h3>Alhaji Hakeem Olademeji Lawal</h3>
            <p>CEO / Founder Awilya Foundation</p>
          </article>
          <article className="about-card">
            <p className="eyebrow">Mother of the Day</p>
            <h3>Alhaja Binta A. Logun</h3>
            <p>Proprietress Five-Ways International School, Ilorin</p>
          </article>
        </div>
        <div className="guest-list">
          <h3>Special Invitees</h3>
          <p>
            Mall. Abdulrahman Abdulrazaq (CON) — The Executive Governor of Kwara State,
            Mall. Mustapha M. Ishowo — Executive Secretary, Kwara State APC,
            Engr. Femi Sanni Araba — CEO / Founder, Flow FM Station 90.7FM Araba Radio,
            Prof. Abdulkadri Laaro — Dean, Faculty of Education Kwasu,
            Mr. Alabi Amuda Zeriki — Retd. Perm. Sec., LGSC,
            Mr. Habeeb Bolaji — NULGE Chairman Ilorin South,
            Mr. Lanre Gambari — Dangote Group of Company,
            Alhaji Olaitan Jimoh — Former NNPC Manager,
            Alhaji Abdul Kareem Lambe — Former Commissioner 1, LGSC.
          </p>
        </div>
      </section>

      <section className="section sponsor-section">
        <div className="sponsor-card">
          <div>
            <span className="eyebrow">Sponsor Promotion</span>
            <h2>{sponsorInfo.name}</h2>
            <p>{sponsorInfo.description}</p>
          </div>
          <Link href="#footer" className="btn-primary">
            {sponsorInfo.cta}
          </Link>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-grid">
          <div>
            <p className="footer-title">Quick Links</p>
            <ul>
              <li><Link href="#hero">Home</Link></li>
              <li><Link href="#schedule">Schedule</Link></li>
              <li><Link href="#rsvp">RSVP</Link></li>
              <li><Link href="#food-preview">Food</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-title">Need Help?</p>
            <p>Event Coordinator</p>
            <p>Groom Representative</p>
            <p>Bride Representative</p>
          </div>
          <div>
            <p className="footer-title">Contact</p>
            <p>+234 800 000 0000</p>
            <p>support@olowojarewedding.com</p>
          </div>
        </div>
        <p className="footer-credit">
          Designed & Developed by Jare's Choice Labs (JCLs) • Crafting Digital Experiences That Matter
        </p>
      </footer>

      <div className={`floating-hub ${showHub ? 'open' : ''}`}>
        <button
          type="button"
          className="hub-toggle"
          onClick={() => setShowHub((value) => !value)}
          aria-expanded={showHub}
          aria-label="Open quick actions"
        >
          {showHub ? 'Close' : 'Quick Actions'}
        </button>
        {showHub && (
          <div className="hub-menu">
            {assistants.map((item) => (
              item.label === 'AI Wedding Assistant' ? (
                <button key={item.label} type="button" onClick={() => setShowAssistantModal(true)} className="hub-link">
                  {item.label}
                </button>
              ) : (
                <a key={item.label} href={item.href} className="hub-link">
                  {item.label}
                </a>
              )
            ))}
            <a href={LIVE_STREAM_URL} target="_blank" rel="noreferrer" className="hub-link">
              Live Stream
            </a>
          </div>
        )}
      </div>
      {showAssistantModal && <ChatAssistant onClose={() => setShowAssistantModal(false)} />}
    </main>
  );
}

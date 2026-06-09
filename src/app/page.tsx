'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageFooter from '@/components/PageFooter';

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
          <Link href="/itinerary">Schedule</Link>
          <Link href="/couple">Couple</Link>
          <Link href="/honorees">Honorees</Link>
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
          <Link href="/itinerary" className="btn-secondary">
            View Schedule
          </Link>
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

      <PageFooter
        previousHref={undefined}
        previousLabel="Previous Page"
        nextHref="/couple"
        nextLabel="Meet the Couple"
      />
    </main>
  );
}

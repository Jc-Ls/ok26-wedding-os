'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

const pageLinks = [
  { label: 'Meet the Couple', href: '/meet-the-couple' },
  { label: 'The Family', href: '/meet-the-olowojares' },
  { label: 'Special Guests', href: '/special-guests' },
  { label: 'Traditions', href: '/traditions' },
  { label: 'Organisers', href: '/organisers' },
  { label: 'Reservations', href: '/reservations' },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const { scrollY } = useScroll();
  const heroDepth = useTransform(scrollY, [0, 700], [0, 90]);
  const heroScale = useTransform(scrollY, [0, 700], [1, 1.08]);
  const heroStageMove = useTransform(scrollY, [0, 700], [0, -28]);
  const heroStageTilt = useTransform(scrollY, [0, 700], [0, 6]);

  useEffect(() => {
    const heroTimer = setInterval(
      () => setActiveSlide((current) => (current + 1) % heroSlides.length),
      5200,
    );
    return () => clearInterval(heroTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 7200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="page-shell">
      <div id="carousel-container">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.src}
            className={`slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.src})` }}
            animate={{ scale: index === activeSlide ? 1.08 : 1, y: index === activeSlide ? -14 : 0 }}
            transition={{ duration: 5.2, ease: 'easeOut' }}
            aria-hidden={index !== activeSlide}
          />
        ))}
        <div className="overlay" />
      </div>

      <nav aria-label="Primary navigation">
        <Link href="/" className="logo">
          OLOWOJARE GALA
        </Link>
        <div className="nav-actions">
          <details className="nav-dropdown">
            <summary>Explore</summary>
            <div className="nav-dropdown-panel">
              <Link href="/#schedule">Schedule</Link>
              <Link href="/meet-the-couple">Couple</Link>
              <Link href="/meet-the-olowojares">The Family</Link>
              <Link href="/special-guests">Special Guests</Link>
              <Link href="/traditions">Traditions</Link>
              <Link href="/organisers">Organisers</Link>
            </div>
          </details>
          <Link href="/livestream">Livestream</Link>
          <Link href="/reservations">RSVP</Link>
        </div>
      </nav>

      <section className="hero hero-kinetic" id="hero">
        <motion.div className="hero-copy-layer" style={{ y: heroDepth, scale: heroScale }}>
          <p className="welcome-text">An elevated wedding portal for invited guests</p>
          <h1 className="couple">MK'26</h1>
          <p className="hero-copy">
            Enter a premium celebration experience designed for the Olowojares. Explore the couple,
            family lineage, organisers, reservations, and livestream from within the app.
          </p>

          <div className="hero-buttons">
            <Link href="/meet-the-couple" className="btn-secondary">
              Start the Journey
            </Link>
            <Link href="/livestream" className="btn-primary">
              Livestream
            </Link>
            <Link href="/reservations" className="btn-secondary">
              Reserve Seat
            </Link>
          </div>
        </motion.div>

        <motion.div className="hero-3d-stage" aria-hidden="true" style={{ y: heroStageMove, rotate: heroStageTilt }}>
          <div className="kinetic-ring ring-a" />
          <div className="kinetic-ring ring-b" />
          <div className="kinetic-core">
          </div>
        </motion.div>
      </section>

      <section className="section" id="schedule" style={{ paddingTop: '0', paddingBottom: '80px' }}>
        <div className="journey-grid">
          {pageLinks.map((item, index) => (
            <motion.div
              key={item.href}
              className="journey-card-wrap"
              initial={{ opacity: 0, y: 22, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <Link href={item.href} className="journey-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {showSplash && (
        <div className="splash-screen">
          <div className="splash-panel">
            <p className="splash-eyebrow">The Olowojare's</p>
            <h1 className="splash-title">Muhammed &amp; Kaothar</h1>
            <p className="splash-copy">
              With great joy and anticipation, we welcome you to our wedding website. 
              As we step into this new chapter of our lives, 
              we are reminded of how lucky we are to be surrounded by the love of our favorite people. 
              May this space be a glimpse into our love story and the festivities to come
            </p>
            <div className="splash-actions">
              <Link href="/meet-the-couple" className="btn-primary">
                Start the Journey
              </Link>
              <button type="button" className="btn-secondary" onClick={() => setShowSplash(false)}>
                Explore Home
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

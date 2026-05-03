'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [showRsvpButton, setShowRsvpButton] = useState(false);
  const endOfTimelineRef = useRef<HTMLDivElement>(null);

  // Background Carousel Images for Hero
  const heroImages = [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&q=80'
  ];
  const [currentHero, setCurrentHero] = useState(0);

  // Auto-fade Splash Screen after 1 Minute (60000ms) to give ample reading time
  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 60000);
    return () => clearTimeout(splashTimer);
  }, []);

  // Carousel Timer
  useEffect(() => {
    if (showSplash) return;
    const heroTimer = setInterval(() => setCurrentHero(prev => (prev + 1) % heroImages.length), 6000);
    return () => clearInterval(heroTimer);
  }, [showSplash, heroImages.length]);

  // Intersection Observer to reveal RSVP button after scrolling past timeline
  useEffect(() => {
    if (showSplash) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowRsvpButton(true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (endOfTimelineRef.current) observer.observe(endOfTimelineRef.current);
    return () => observer.disconnect();
  }, [showSplash]);

  // --- THE ROYAL SPLASH SCREEN ---
  if (showSplash) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#06140F', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');`}</style>
        
        <div style={{ animation: 'fadeInDown 1.5s ease-out' }}>
          {/* FIXED: Broken into two lines for perfect mobile fitting, with adjusted line-height */}
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 8vw, 3.5rem)', color: '#E5D08F', letterSpacing: '6px', margin: '0 0 20px 0', fontWeight: '400', lineHeight: '1.3' }}>
            THE <br/> OLOWOJARE'S
          </h1>
          <div style={{ height: '1px', width: '60px', background: '#E5D08F', margin: '0 auto 30px' }}></div>
        </div>

        <p style={{ fontFamily: '"Montserrat", sans-serif', color: '#FDFBF7', fontSize: '0.95rem', lineHeight: '2', letterSpacing: '1px', fontWeight: '300', maxWidth: '400px', animation: 'fadeInUp 1.5s ease-out 0.5s both' }}>
          It brings us immeasurable joy to welcome you. Your presence and prayers mean the world to our family as we step into this beautiful new chapter.<br/><br/>
          Thank you for gracing us with your time and love. Please proceed to secure your VIP Reservation.
        </p>

        {/* KEPT YOUR ORIGINAL BUTTON */}
        <button onClick={() => setShowSplash(false)} style={{ marginTop: '50px', padding: '15px 35px', background: 'transparent', border: '1px solid #E5D08F', color: '#E5D08F', borderRadius: '30px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: '"Montserrat", sans-serif', animation: 'fadeIn 2s ease-out 2s both' }}>
          Enter The Gala
        </button>

        <style>{`
          @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    );
  }

  // --- THE GALA HOMEPAGE (EMERALD HEIRLOOM) ---
  return (
    <div style={{ backgroundColor: '#06140F', minHeight: '100vh', color: '#FDFBF7', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');
        
        .emerald-glass {
          background: rgba(10, 35, 24, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(229, 208, 143, 0.15);
          border-radius: 16px;
          padding: 35px 25px;
          margin-bottom: 25px;
        }

        .gold-text { color: #E5D08F; }
        .ivory-text { color: #FDFBF7; }
        
        .timeline-item { position: relative; padding-left: 35px; margin-bottom: 35px; border-left: 1px solid rgba(229, 208, 143, 0.2); }
        .timeline-item::before { content: ''; position: absolute; left: -6px; top: 8px; width: 11px; height: 11px; border-radius: 50%; background: #E5D08F; box-shadow: 0 0 10px rgba(229, 208, 143, 0.5); }
        
        .btn-champagne {
          display: inline-block;
          width: 100%;
          padding: 22px;
          background: linear-gradient(145deg, #E5D08F, #C7A951);
          color: #06140F;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 1rem;
          box-shadow: 0 10px 30px rgba(229, 208, 143, 0.25);
          transition: all 0.4s ease;
        }

        /* Smooth slide up for the RSVP button */
        .rsvp-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .rsvp-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* HERO SECTION */}
      <section style={{ position: 'relative', width: '100%', height: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '10vh' }}>
        {heroImages.map((src, index) => (
          <div key={index} style={{ position: 'absolute', inset: 0, opacity: index === currentHero ? 0.6 : 0, transition: 'opacity 3s ease-in-out', backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,20,15,0.2) 0%, rgba(6,20,15,0.8) 70%, #06140F 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', padding: '0 20px' }}>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.8rem', letterSpacing: '6px', color: '#E5D08F', textTransform: 'uppercase', marginBottom: '15px' }}>
            You are cordially invited to
          </p>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 12vw, 4rem)', color: '#FDFBF7', margin: '0 0 10px 0', fontWeight: '400', lineHeight: '1.1' }}>
            The Olowojare <br/><span style={{ color: '#E5D08F', fontStyle: 'italic', fontSize: 'clamp(2rem, 10vw, 4rem)' }}>Gala</span>
          </h1>
          <div style={{ height: '1px', width: '80px', background: 'rgba(229, 208, 143, 0.5)', margin: '20px auto' }}></div>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '1rem', letterSpacing: '4px', color: '#FDFBF7', textTransform: 'uppercase' }}>
            Muhammedul'Awwal <span className="gold-text">&</span> Kaothar
          </p>
        </div>
      </section>

      {/* CONTENT FLOW */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 60px', position: 'relative', zIndex: 10 }}>
        
        {/* HOST SECTION */}
        <div className="emerald-glass" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#E5D08F', marginBottom: '15px' }}>Chief Host</p>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#FDFBF7', margin: '0 0 10px 0', fontWeight: '400' }}>Alh. Hakeem Olademeji Lawal</h3>
          <p style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '300', lineHeight: '1.6' }}>
            B.Hons, CAN, Economics Awards Degrees<br/>
            <span style={{ fontStyle: 'italic' }}>CEO/MD/Founder of Awilya Foundation</span>
          </p>
        </div>

        {/* TIMELINE SECTION */}
        <div style={{ padding: '20px 0 40px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#E5D08F', textAlign: 'center', marginBottom: '40px', fontWeight: '400' }}>The Itinerary</h2>
          
          <div className="timeline-item">
            <p style={{ color: '#E5D08F', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Thursday, 25 June</p>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#FDFBF7', margin: '0 0 10px 0', fontWeight: '400' }}>Wedding Eve & Sisa</h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 5px 0', fontWeight: '300', lineHeight: '1.5' }}>Olowojare Comp, Adeta, Ilorin.</p>
            <p style={{ color: '#E5D08F', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>9:00 PM - 11:00 PM</p>
          </div>

          <div className="timeline-item">
            <p style={{ color: '#E5D08F', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Friday, 26 June</p>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#FDFBF7', margin: '0 0 10px 0', fontWeight: '400' }}>Walimatul-Quran & Nikkah</h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 5px 0', fontWeight: '300', lineHeight: '1.5' }}>Akala Mosque & Sarumi Mosque.</p>
            <p style={{ color: '#E5D08F', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>9:00 AM Prompt</p>
          </div>

          <div className="timeline-item" style={{ borderLeftColor: 'transparent', paddingBottom: 0 }}>
            <p style={{ color: '#E5D08F', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Saturday, 27 June</p>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#FDFBF7', margin: '0 0 10px 0', fontWeight: '400' }}>The Royal Reception</h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 5px 0', fontWeight: '300', lineHeight: '1.5' }}>Al-Kareem Event Center.</p>
            <p style={{ color: '#E5D08F', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>12:00 Noon</p>
          </div>
        </div>

        {/* INVISIBLE MARKER FOR SCROLL SPY */}
        <div ref={endOfTimelineRef} style={{ height: '20px' }}></div>

        {/* THE RSVP HOOK (Smooth Slide-up Reveal) */}
        <div className={`rsvp-reveal ${showRsvpButton ? 'visible' : ''}`} style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FDFBF7', fontSize: '1.4rem', fontStyle: 'italic', marginBottom: '25px' }}>
            We eagerly await your presence.
          </p>
          {/* Next.js Link handles instant, seamless routing to /reserve */}
          <Link href="/reserve" className="btn-champagne">
            Secure VIP Pass
          </Link>
        </div>

      </div>
    </div>
  );
}
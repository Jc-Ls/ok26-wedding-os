'use client';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const RSVP_NUMBERS = [
    '+234 800 000 0001', '+234 800 000 0002', '+234 800 000 0003',
    '+234 800 000 0004', '+234 800 000 0005', '+234 800 000 0006'
  ];

  useEffect(() => {
    setIsMounted(true);
    // Countdown targets the start of the first event (Thursday Night)
    const targetDate = new Date('2026-06-25T21:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return <div style={{ backgroundColor: '#4A0E1B', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@300;400;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .itinerary-card { position: relative; padding-bottom: 50px; }
        .itinerary-card:last-child { padding-bottom: 0; }
        .nav-link { color: #D4AF37; font-size: 0.8rem; text-decoration: underline; margin-top: 10px; display: inline-block; letter-spacing: 1px; }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section style={{ position: 'relative', width: '100%', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url(/images/hero1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(74,14,27,0.3) 0%, rgba(5,5,5,1) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '20px', animation: 'fadeIn 2s ease-out' }}>
          <h2 style={{ fontSize: '0.8rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '20px' }}>Kwara 2026</h2>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '5.5rem', color: '#D4AF37', margin: 0, lineHeight: 0.8 }}>O<span style={{ fontSize: '2.5rem', color: '#fff', verticalAlign: 'middle', margin: '0 10px' }}>&</span>K</h1>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#fff', fontStyle: 'italic', marginTop: '10px' }}>Olowojare & Kaothar</h3>
        </div>
      </section>

      {/* --- COUNTDOWN --- */}
      <section style={{ padding: '0 20px', marginTop: '-50px', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(74,14,27,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '15px', padding: '25px', display: 'flex', justifyContent: 'space-around', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
          {[ 
            { label: 'DAYS', value: timeLeft.days }, 
            { label: 'HOURS', value: timeLeft.hours }, 
            { label: 'MINS', value: timeLeft.minutes }, 
            { label: 'SECS', value: timeLeft.seconds } 
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#D4AF37' }}>{item.value}</div>
              <div style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '1px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3-DAY ITINERARY --- */}
      <section style={{ padding: '80px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.8rem', color: '#D4AF37', textAlign: 'center', marginBottom: '50px' }}>The Royal Itinerary</h2>
        
        <div style={{ position: 'relative', paddingLeft: '35px', borderLeft: '1px solid rgba(212,175,55,0.2)' }}>
          
          {/* DAY 1 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-42px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#D4AF37', boxShadow: '0 0 15px #D4AF37' }} />
            <h5 style={{ color: '#D4AF37', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Thursday 25 June</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#fff', margin: 0 }}>Wolimah-eve / Sisa</h4>
            <p style={{ color: '#bbb', fontSize: '0.9rem', margin: '10px 0' }}>Venue: Olowojare Comp Adeta, Ilorin<br/>Time: 9:00 PM — 11:00 PM</p>
            <a href="https://maps.google.com/?q=Adeta+Ilorin+Nigeria" target="_blank" rel="noreferrer" className="nav-link">NAVIGATE TO VENUE →</a>
          </div>

          {/* DAY 2 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-42px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
            <h5 style={{ color: '#D4AF37', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Friday 26 June</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#fff', margin: 0 }}>Walimatul-qur'an & Nikkah</h4>
            <p style={{ color: '#bbb', fontSize: '0.9rem', margin: '10px 0' }}>Venue: Sarumi Mosque, Ode Alfa Nda, Ilorin</p>
            <a href="https://maps.google.com/?q=Sarumi+Mosque+Ilorin" target="_blank" rel="noreferrer" className="nav-link">NAVIGATE TO VENUE →</a>
          </div>

          {/* DAY 3 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-42px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
            <h5 style={{ color: '#D4AF37', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Saturday 27 June</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#fff', margin: 0 }}>The Grand Reception</h4>
            <p style={{ color: '#bbb', fontSize: '0.9rem', margin: '10px 0' }}>Venue: Ilorin, Kwara State<br/>(Access via physical Invitation Card code only)</p>
            <a href="https://maps.google.com/?q=Ilorin+Kwara+State" target="_blank" rel="noreferrer" className="nav-link">NAVIGATE TO VENUE →</a>
          </div>

        </div>
      </section>

      {/* --- RSVP SECTION --- */}
      <section style={{ padding: '40px 20px 80px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#D4AF37', marginBottom: '30px' }}>RSVP & Enquiries</h2>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>Kindly reach out to secure your physical IV.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {RSVP_NUMBERS.map((num, i) => (
            <a key={i} href={`tel:${num}`} style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '1px' }}>
              {num}
            </a>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #1a1a1a' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Seamlessly Engineered by<br/><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Jare's Choice Labs</span>
        </p>
      </footer>
    </div>
  );
}

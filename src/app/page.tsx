'use client'; 

import { useState, useEffect } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeViewers, setActiveViewers] = useState(12);
  const [viewerLocation, setViewerLocation] = useState('Ilorin');
  const [scrollY, setScrollY] = useState(0);
  
  // RSVP State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // Scanner Modal State
  const [showScannerModal, setShowScannerModal] = useState(false);

  const slides = [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ];

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => { if (data.city) setViewerLocation(data.city); })
      .catch(() => console.log('Location fetch blocked, using default.'));

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const slideTimer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    const viewerTimer = setInterval(() => {
      setActiveViewers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; 
        return prev + change > 3 ? prev + change : 4; 
      });
    }, 8000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(slideTimer);
      clearInterval(viewerTimer);
    };
  }, []);

  const handleReservation = (e: any) => {
    e.preventDefault();
    const VALID_CODE = 'OK26';

    if (inviteCode.toUpperCase() !== VALID_CODE) {
      setErrorMsg(true);
      return;
    }

    setErrorMsg(false);
    setIsAuthenticating(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setPin(`OK26-${randomNum}`);
      setIsSubmitted(true);
      setIsAuthenticating(false);
      
      setTimeout(() => document.getElementById('pass-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 1200);
  };

  const parallaxStyle = {
    transform: `scale(${Math.max(0.6, 1 - scrollY / 1000)}) translateY(${scrollY * 0.3}px)`,
    opacity: Math.max(0, 1 - scrollY / 500),
    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
  };

  return (
    <>
      {/* Background Carousel */}
      <div id="carousel-container">
        {slides.map((url, index) => (
          <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url('${url}')` }}></div>
        ))}
      </div>
      <div className="overlay"></div>

      <nav>
        <a href="/" className="logo">O'K26</a>
        <div className="live-counter">
          <span className="pulse-dot"></span>
          <span>{activeViewers}</span> &nbsp;Viewing from {viewerLocation}
        </div>
      </nav>

      <div className="hero">
        <div className="welcome-text">
          The Families of<br />
          <b>Alhaji Sulyman Olowojare & Alhaji Faruq Sarumi</b><br />
          Invite you to celebrate the union of
        </div>
        
        {/* PARALLAX COUPLE NAMES (Updated Formatting) */}
        <div className="couple name-shimmer" style={parallaxStyle}>
           <span style={{ display: 'block', fontSize: 'clamp(2.5rem, 10vw, 3.5rem)' }}>
              Muhammed <br style={{ display: 'none' }} className="mobile-break" />
              <i style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', color: 'var(--pink-accent)' }}>(Omokayode)</i>
            </span>
            <span style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(1.5rem, 6vw, 2rem)', display: 'block', margin: '10px 0' }}>&</span>
            <span style={{ display: 'block', fontSize: 'clamp(2.5rem, 10vw, 3.5rem)' }}>
              Kaothar <br style={{ display: 'none' }} className="mobile-break" />
              <i style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', color: 'var(--pink-accent)' }}>(Oyindamola)</i>
            </span>
        </div>

        {/* RECEPTION MENU BUTTON */}
        <button 
          onClick={() => setShowScannerModal(true)}
          style={{ marginTop: '10px', backgroundColor: 'transparent', border: '1px solid var(--gold-base)', color: 'var(--gold-bright)', padding: '12px 24px', borderRadius: '30px', fontFamily: '"Cinzel", serif', fontSize: '0.9rem', letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase', backdropFilter: 'blur(5px)' }}
        >
          🍽️ Open Reception Menu
        </button>
      </div>

      {/* ITINERARY */}
      <div className="itinerary-container">
        <div className="day-card">
          <div className="day-header">
            <span className="day-title">Friday, June 26</span>
            <span className="access-badge access-public">Open Access</span>
          </div>
          <div className="event-row">
            <div className="event-time">9:00 AM</div>
            <div className="event-name">Wolimat Ceremony</div>
            <div className="event-loc">Akala Mosque, Adeta, Ilorin</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=Akala+Mosque,+Adeta,+Ilorin" target="_blank" rel="noopener noreferrer" className="btn-map">📍 Open in Maps</a>
          </div>
          <div className="event-row" style={{ marginTop: '25px' }}>
            <div className="event-time">Immediately Following</div>
            <div className="event-name">Nikkah Ceremony</div>
            <div className="event-loc">Sarumi Mosq., Ode Alfa Nda, Ilorin</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=Ode+Alfa+Nda,+Ilorin" target="_blank" rel="noopener noreferrer" className="btn-map">📍 Open in Maps</a>
          </div>
        </div>

        <div className="day-card" style={{ borderLeftColor: 'var(--pink-accent)' }}>
          <div className="day-header">
            <span className="day-title">Saturday, June 27</span>
            <span className="access-badge access-private">Reservation Required</span>
          </div>
          <div className="event-row">
            <div className="event-time">12:00 NOON</div>
            <div className="event-name">Reception & Dinner</div>
            <div className="event-loc">Al-Kareem Event Hall, Opp Air-force, Oloje, Ilorin</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=Al-Kareem+Event+Hall,+Oloje,+Ilorin" target="_blank" rel="noopener noreferrer" className="btn-map">📍 Open in Maps</a>
          </div>
        </div>
      </div>

      {/* RSVP FORM */}
      <div className="rsvp-container" id="pass-section">
        {!isSubmitted ? (
          <div id="rsvp-form-container">
            <h2 className="rsvp-header">Secure Reservation</h2>
            <p className="rsvp-desc">Access to the reception requires a verified reservation. Enter your details and the code from your invitation.</p>
            
            <form onSubmit={handleReservation}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., John Doe" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080..." required />
              </div>
              <div className="form-group">
                <label style={{ color: 'var(--pink-accent)' }}>Invitation Code</label>
                <input type="text" className="security-input" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Enter code printed on card" required />
                {errorMsg && <div style={{ display: 'block', color: 'var(--pink-accent)', fontSize: '0.8rem', marginTop: '5px' }}>Invalid invitation code.</div>}
              </div>
              <button type="submit" className="btn-submit" disabled={isAuthenticating}>
                {isAuthenticating ? 'Verifying Data...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        ) : (
          <div id="success-state" style={{ display: 'block', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✔️</div>
            <h2 className="rsvp-header" style={{ fontSize: '1.5rem' }}>Reservation Confirmed</h2>
            <p className="rsvp-desc">Your information is secured in our system. Please screenshot or save your unique Reservation ID.</p>
            <div className="pin-box">
              <div className="pin-code">{pin}</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#d1d5db' }}>Present this ID at the Al-Kareem Event Hall entrance on Saturday.</p>
          </div>
        )}
      </div>

      <footer className="site-footer">
        © 2026 Elegantly crafted <span className="rose-icon">🌹</span> by<br />
        <a href="https://jclabs-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">JARE'S CHOICE LABS</a>
      </footer>

      {/* SCANNER MODAL */}
      {showScannerModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--navy-bg)', border: '1px solid var(--gold-base)', borderRadius: '16px', padding: '30px 20px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📷</div>
            <h2 style={{ fontFamily: '"Cinzel", serif', color: 'var(--gold-bright)', fontSize: '1.4rem', marginBottom: '15px' }}>Scan Your Table</h2>
            <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
              To order your meal, simply open your phone's normal camera and point it at the barcode on your table! No app required.
            </p>
            <button 
              onClick={() => setShowScannerModal(false)}
              style={{ backgroundColor: 'var(--gold-base)', color: '#000', border: 'none', padding: '14px 30px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', width: '100%', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}

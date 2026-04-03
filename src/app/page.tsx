'use client'; 

import { useState, useEffect } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [guestCount, setGuestCount] = useState(142);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const slides = [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Notice the 'e: any' fix we added earlier to pass the Vercel build
  const handleReservation = (e) => {
    e.preventDefault();
    
    // UPDATED INVITATION CODE
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
      setGuestCount((prev) => prev + 1);
      setIsAuthenticating(false);
      
      setTimeout(() => {
        document.getElementById('pass-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1200);
  };

  return (
    <>
      <div id="carousel-container">
        {slides.map((url, index) => (
          <div 
            key={index} 
            className={`slide ${index === currentSlide ? 'active' : ''}`} 
            style={{ backgroundImage: `url('${url}')` }}
          ></div>
        ))}
      </div>
      <div className="overlay"></div>

      <nav>
        <div className="logo">O'K26</div>
        <div className="live-counter">
          <span className="pulse-dot"></span>
          <span>{guestCount}</span> &nbsp;Reservations
        </div>
      </nav>

      <div className="hero">
        <div className="welcome-text">
          The Families of<br />
          <b>Alhaji Sulyman Olowojare & Alhaji Faruq Sarumi</b><br />
          Invite you to celebrate the union of
        </div>
        <div className="couple">
          Muhammed <span className="ampersand">&</span> Kaothar
        </div>
      </div>

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
            <a href="#" className="btn-map">📍 Open in Maps</a>
          </div>
          <div className="event-row" style={{ marginTop: '25px' }}>
            <div className="event-time">Immediately Following</div>
            <div className="event-name">Nikkah Ceremony</div>
            <div className="event-loc">Sarumi Mosq., Ode Alfa Nda, Ilorin</div>
            <a href="#" className="btn-map">📍 Open in Maps</a>
          </div>
        </div>

        <div className="day-card" style={{ borderLeftColor: 'var(--gold-bright)' }}>
          <div className="day-header">
            <span className="day-title">Saturday, June 27</span>
            <span className="access-badge access-private">Reservation Required</span>
          </div>
          <div className="event-row">
            <div className="event-time">12:00 NOON</div>
            <div className="event-name">Reception & Dinner</div>
            <div className="event-loc">Al-Kareem Event Hall, Opp Air-force, Oloje, Ilorin</div>
            <a href="#" className="btn-map">📍 Open in Maps</a>
          </div>
        </div>
      </div>

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
                <label style={{ color: '#ff6464' }}>Invitation Code</label>
                <input type="text" className="security-input" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Enter code printed on card" required />
                {errorMsg && <div id="error-msg" style={{ display: 'block', color: '#ff6464', fontSize: '0.8rem', marginTop: '5px' }}>Invalid invitation code.</div>}
              </div>
              <button type="submit" className="btn-submit" disabled={isAuthenticating}>
                {isAuthenticating ? 'Verifying Data...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        ) : (
          <div id="success-state" style={{ display: 'block' }}>
            <div className="success-icon">✔️</div>
            <h2 className="rsvp-header" style={{ fontSize: '1.5rem' }}>Reservation Confirmed</h2>
            <p className="rsvp-desc">Your information is secured in our system. Please screenshot or save your unique Reservation ID.</p>
            <div className="pin-box">
              <div className="pin-code">{pin}</div>
            </div>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Present this ID at the Al-Kareem Event Hall entrance on Saturday.</p>
          </div>
        )}
      </div>
    </>
  );
}

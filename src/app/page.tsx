'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // ==========================================
  // 🔐 SECURITY DESK: CHANGE THIS EVERY 3 DAYS
  // ==========================================
  const SECRET_PASSCODE = "OK26-VIP";

  // Form State
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '', passcode: '' });
  const [formStatus, setFormStatus] = useState('');

  const RSVP_CONTACTS = [
    { name: 'BOY', phone: '+2348033586121', wa: '2348033586121' },
    { name: 'ABU', phone: '+2348034920928', wa: '2348034920928' },
    { name: 'OLA', phone: '+2348033903412', wa: '2348033903412' },
    { name: 'FAUSAT', phone: '+2348061213142', wa: '2348061213142' },
    { name: 'DURO', phone: '+2348034588717', wa: '2348034588717' },
    { name: 'GBENGA', phone: '+2348034311434', wa: '2348034311434' }
  ];

  useEffect(() => {
    setIsMounted(true);
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

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.passcode !== SECRET_PASSCODE) {
      setFormStatus('error');
      return;
    }
    setFormStatus('success');
    setForm({ name: '', phone: '', email: '', location: '', passcode: '' });
  };

  if (!isMounted) return <div style={{ backgroundColor: '#050403', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: '#050403', minHeight: '100vh', color: '#fff', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@300;400;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ticker { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
        
        .lux-bg { background-image: radial-gradient(circle at center, #1A1612 0%, #050403 100%); position: absolute; inset: 0; z-index: 0; }
        
        .ticker-wrap { width: 100%; overflow: hidden; background: rgba(229,193,88,0.05); border-top: 1px solid rgba(229,193,88,0.2); border-bottom: 1px solid rgba(229,193,88,0.2); padding: 8px 0; position: relative; z-index: 20; }
        .ticker { display: inline-block; white-space: nowrap; padding-left: 100%; animation: ticker 30s linear infinite; color: #E5C158; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; }
        
        .itinerary-card { position: relative; padding-bottom: 40px; }
        .itinerary-card:last-child { padding-bottom: 0; }
        .venue-link { color: #00FA9A; font-size: 0.9rem; text-decoration: underline; margin: 5px 0; display: inline-block; letter-spacing: 0.5px; }
        .time-text { color: #ADFF2F; font-size: 0.85rem; margin-top: 2px; }
        
        .input-field { width: 100%; padding: 15px; margin-bottom: 15px; background: rgba(255,255,255,0.05); border: 1px solid rgba(229,193,88,0.3); border-radius: 8px; color: #fff; font-family: "Montserrat", sans-serif; outline: none; }
        .input-field:focus { border-color: #E5C158; }
        .submit-btn { width: 100%; padding: 15px; background: #E5C158; color: #050403; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; }
        .submit-btn:hover { background: #d4af37; }
      `}</style>

      {/* --- GRAND HERO SECTION --- */}
      <section style={{ position: 'relative', width: '100%', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <div className="lux-bg" />
        
        <div style={{ position: 'relative', zIndex: 10, animation: 'fadeIn 2s ease-out', width: '100%' }}>
          
          <div style={{ marginBottom: '30px' }}>
            <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.65rem', color: '#E5C158', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>THE FAMILIES:</p>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#fff', fontStyle: 'italic', margin: '0 0 10px 0' }}>Alhaji Sulyman Olowojare & Alhaji Faruq Sarumi</h3>
            <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.65rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>CORDIALLY INVITE YOU TO:</p>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#fff', fontStyle: 'italic', marginTop: '10px' }}>The Wedding Of</h2>
          </div>

          <h2 style={{ fontSize: '1rem', letterSpacing: '4px', color: '#E5C158', marginBottom: '20px', fontWeight: 'bold' }}>OK"26</h2>
          
          <div style={{ fontFamily: '"Amiri", serif', fontSize: 'clamp(2rem, 8vw, 3.5rem)', color: '#E5C158', marginBottom: '-5px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            محمد الأول <span style={{ fontSize: '1.5rem', margin: '0 10px', color: '#fff' }}>&</span> الكوثر
          </div>
          
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 8vw, 4.5rem)', color: '#fff', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
            MUHAMMEDUL'AWWAL <br/>
            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: '#E5C158' }}>&</span> KAOTHAR
          </h1>
        </div>
      </section>

      {/* --- VIP SCROLLING RIBBON --- */}
      <div className="ticker-wrap">
        <div className="ticker">
          ✦ SPECIAL GUEST OF HONOR: HIS EXCELLENCY, MALL. ABDULRAHMAN ABDULRAZAK (EXECUTIVE GOVERNOR OF KWARA STATE) ✦ DISTINGUISHED DIGNITARIES: MALL. SALMAN ISHOWO (EXECUTIVE SECRETARY APC) ✦ ALH. HAKEEM OLADEMEJI LAWAL (CEO AWILYA FOUNDATION) ✦ HON. GAFAR AHMED (THECUTEABIOLA) ✦
        </div>
      </div>

      {/* --- COUNTDOWN --- */}
      <section style={{ padding: '40px 20px 0', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(26,22,18,0.9)', border: '1px solid rgba(229,193,88,0.3)', borderRadius: '15px', padding: '20px', display: 'flex', justifyContent: 'space-around' }}>
          {[ 
            { label: 'DAYS', value: timeLeft.days }, 
            { label: 'HOURS', value: timeLeft.hours }, 
            { label: 'MINS', value: timeLeft.minutes }, 
            { label: 'SECS', value: timeLeft.seconds } 
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#E5C158' }}>{item.value}</div>
              <div style={{ fontSize: '0.55rem', color: '#aaa', letterSpacing: '1px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3-DAY ITINERARY --- */}
      <section style={{ padding: '60px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#E5C158', textAlign: 'center', marginBottom: '40px' }}>Venue & Event</h2>
        
        <div style={{ position: 'relative', paddingLeft: '35px', borderLeft: '1px solid rgba(229,193,88,0.3)' }}>
          
          {/* DAY 1 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-41px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E5C158' }} />
            <h5 style={{ color: '#E5C158', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>THUR 25 JUNE</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#fff', margin: 0 }}>WEDDING-EVE & SISA</h4>
            <a href="https://maps.google.com/?q=Adeta+Ilorin+Nigeria" target="_blank" rel="noreferrer" className="venue-link">Venue:- Olowojare comp, adeta, Ilorin.</a>
            <p className="time-text">Time:- 9-11pm</p>
            <Link href="/traditions" style={{ color: '#E5C158', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid #E5C158', marginTop: '12px', display: 'inline-block', letterSpacing: '1px' }}>
              ▶ WATCH: DISCOVER THE TRADITION
            </Link>
          </div>

          {/* DAY 2 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-41px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E5C158' }} />
            <h5 style={{ color: '#E5C158', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>FRIDAY 26 JUNE</h5>
            
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#fff', margin: 0 }}>WALIMATUL-QURAN</h4>
              <a href="https://maps.google.com/?q=Sarumi+Mosque+Ilorin" target="_blank" rel="noreferrer" className="venue-link">Venue:- Akala Mosq, Adeta, Ilorin.</a>
              <p className="time-text">Time:- 9:am Prompt</p>
            </div>

            <div>
              <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#fff', margin: 0 }}>NIKKAH</h4>
              <a href="https://maps.google.com/?q=Ilorin+Kwara+State" target="_blank" rel="noreferrer" className="venue-link">Venue:- Sarumi Mosq, ode alfa nda, Ilorin.</a>
              <p className="time-text">Time:- Immediately after wolimat ceremony</p>
            </div>
            <Link href="/traditions" style={{ color: '#E5C158', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid #E5C158', marginTop: '12px', display: 'inline-block', letterSpacing: '1px' }}>
              ▶ WATCH: DISCOVER THE TRADITION
            </Link>
          </div>

          {/* DAY 3 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-41px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E5C158' }} />
            <h5 style={{ color: '#E5C158', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>SATURDAY 27 JUNE</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#fff', margin: 0 }}>RECEPTION/DINNER</h4>
            <a href="https://maps.google.com/?q=" target="_blank" rel="noreferrer" className="venue-link">Venue:- Al-kareem Event Center, opp Air-force, Oloje Estate, Ilorin.</a>
            <p className="time-text">Time:- 12:noon.</p>
          </div>

        </div>
      </section>

      {/* --- SECURE RESERVATION DESK --- */}
      <section style={{ padding: '40px 24px', backgroundColor: '#0A0806', borderTop: '1px solid rgba(229,193,88,0.2)' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#E5C158', textAlign: 'center', marginBottom: '10px' }}>Secure Your Seat</h2>
          <p style={{ color: '#aaa', fontSize: '0.85rem', textAlign: 'center', marginBottom: '30px' }}>Please enter your details and the VIP Passcode provided to you.</p>
          
          {formStatus === 'success' ? (
            <div style={{ padding: '20px', backgroundColor: 'rgba(0, 250, 154, 0.1)', border: '1px solid #00FA9A', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ color: '#00FA9A', marginBottom: '10px' }}>Reservation Confirmed!</h3>
              <p style={{ color: '#fff', fontSize: '0.9rem' }}>We look forward to celebrating with you.</p>
            </div>
          ) : (
            <form onSubmit={handleReservation}>
              <input type="text" placeholder="Full Name (Required)" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Phone Number (Optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              <input type="email" placeholder="Email Address (Optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
              <input type="text" placeholder="Your City/Location (Optional)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
              
              <div style={{ position: 'relative' }}>
                <input type="password" placeholder="Enter VIP Passcode (Required)" required value={form.passcode} onChange={(e) => setForm({ ...form, passcode: e.target.value })} className="input-field" style={{ borderColor: formStatus === 'error' ? '#ff4444' : 'rgba(229,193,88,0.3)' }} />
                {formStatus === 'error' && <p style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '-10px', marginBottom: '15px' }}>Incorrect Passcode. Please contact the family.</p>}
              </div>

              <button type="submit" className="submit-btn">Submit Reservation</button>
            </form>
          )}
        </div>
      </section>

      {/* --- QUOTE & RSVP FOOTER --- */}
      <section style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: '#050403' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#ccc', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto 30px', lineHeight: '1.6' }}>
          "We really appreciate your love, support, and prayers as we start this journey together. With hope and dreams, we look to the future, knowing your kindness will guide and inspire us."
        </p>
        
        <h4 style={{ color: '#E5C158', letterSpacing: '2px', fontSize: '1.2rem', marginBottom: '20px' }}>R.S.V.P</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', maxWidth: '600px', margin: '0 auto', paddingBottom: '30px' }}>
          {RSVP_CONTACTS.map((contact, i) => (
            <a key={i} href={`tel:${contact.phone}`} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', padding: '5px 10px', borderBottom: '1px solid rgba(229,193,88,0.3)' }}>
              {contact.phone.replace('+234', '0')}
            </a>
          ))}
        </div>
      </section>

      {/* --- DEVELOPER SIGNATURE --- */}
      <footer style={{ padding: '30px 20px', textAlign: 'center', backgroundColor: '#050403', borderTop: '1px solid rgba(229,193,88,0.2)' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
          Seamlessly Engineered by<br/>
          <span style={{ color: '#E5C158', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '5px', display: 'inline-block' }}>Jare's Choice Labs</span>
        </p>
      </footer>
      
    </div>
  );
}

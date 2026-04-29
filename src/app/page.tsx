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

  // Form & DB Simulation State
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '', passcode: '' });
  const [formStatus, setFormStatus] = useState('');
  const [reservationId, setReservationId] = useState('');

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

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.passcode !== SECRET_PASSCODE) {
      setFormStatus('error');
      return;
    }

    // Simulate DB Save & ID Generation (To be replaced with real API next)
    const generatedId = `OK26-${Math.floor(1000 + Math.random() * 9000)}`;
    setReservationId(generatedId);
    setFormStatus('success');
    setForm({ name: '', phone: '', email: '', location: '', passcode: '' });
  };

  if (!isMounted) return <div style={{ backgroundColor: '#050403', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: '#050403', minHeight: '100vh', color: '#fff', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@300;400;600&display=swap');

        /* Elite Animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Grid Layout System */
        .app-container { max-width: 600px; margin: 0 auto; padding: 20px; }
        
        .grid-card { 
          background: rgba(26,22,18,0.6); 
          border: 1px solid rgba(229,193,88,0.2); 
          border-radius: 12px; 
          padding: 24px; 
          margin-bottom: 20px; 
          animation: slideUp 0.8s ease-out both;
        }

        .gold-card {
          background: linear-gradient(145deg, #d4af37, #E5C158);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          color: #050403;
          text-align: center;
          box-shadow: 0 4px 15px rgba(229,193,88,0.15);
        }

        /* Image Placeholder Block */
        .hero-image-block {
          width: 100%;
          height: 250px;
          border-radius: 12px;
          background-image: url('/images/placeholder-couple.jpg');
          background-color: #1a1612; /* Fallback color */
          background-size: cover;
          background-position: center;
          border: 1px solid rgba(229,193,88,0.4);
          margin-bottom: 20px;
          position: relative;
        }
        
        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #050403 0%, transparent 100%);
          border-radius: 12px;
        }

        /* Block Countdown */
        .countdown-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .countdown-block { 
          background: #0a0806; 
          border: 1px solid rgba(229,193,88,0.3); 
          border-radius: 8px; 
          padding: 15px 5px; 
          text-align: center; 
        }

        /* Static Ribbons */
        .static-ribbon { 
          background: #0a0806; 
          border: 1px dashed rgba(229,193,88,0.5); 
          border-radius: 8px; 
          padding: 12px; 
          margin-bottom: 12px;
          text-align: center; 
          font-size: 0.8rem; 
          color: #E5C158; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
        }

        /* Forms & Inputs */
        .input-field { 
          width: 100%; padding: 15px; margin-bottom: 15px; 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(229,193,88,0.3); 
          border-radius: 8px; color: #fff; font-family: "Montserrat", sans-serif; 
          outline: none; transition: 0.3s; 
        }
        .input-field:focus { border-color: #E5C158; background: rgba(255,255,255,0.08); }
        .submit-btn { 
          width: 100%; padding: 15px; background: #E5C158; color: #050403; 
          font-weight: bold; border: none; border-radius: 8px; cursor: pointer; 
          text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; 
        }
        .submit-btn:hover { background: #d4af37; transform: translateY(-2px); }

        /* Itinerary Timeline */
        .timeline-item { position: relative; padding-left: 25px; margin-bottom: 25px; border-left: 1px solid rgba(229,193,88,0.3); }
        .timeline-item::before {
          content: ''; position: absolute; left: -5px; top: 5px;
          width: 9px; height: 9px; border-radius: 50%; background: #E5C158;
        }
        .venue-link { color: #00FA9A; font-size: 0.85rem; text-decoration: underline; display: block; margin-top: 5px; }
      `}</style>

      <div className="app-container">
        
        {/* --- COUPLE IMAGE BLOCK --- */}
        <div className="hero-image-block">
            <div className="hero-image-overlay"></div>
        </div>

        {/* --- INVITATION HEADER CARD --- */}
        <div className="grid-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div style={{ fontFamily: '"Amiri", serif', fontSize: '1.6rem', color: '#E5C158', marginBottom: '20px', textDecoration: 'underline', textUnderlineOffset: '8px' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          
          <h2 style={{ fontSize: '1.2rem', letterSpacing: '6px', color: '#E5C158', marginBottom: '15px', fontWeight: 'bold' }}>
            OK"26
          </h2>
          
          <div style={{ fontFamily: '"Amiri", serif', fontSize: '2.5rem', color: '#E5C158', marginBottom: '10px' }}>
            محمد الأول <span style={{ fontSize: '1.2rem', margin: '0 5px', color: '#fff' }}>&</span> الكوثر
          </div>
          
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#fff', margin: 0, lineHeight: 1.2 }}>
            MUHAMMEDUL'AWWAL <br/>
            <span style={{ fontSize: '1.5rem', color: '#E5C158' }}>&</span> KAOTHAR
          </h1>
        </div>

        {/* --- COUNTDOWN CARD --- */}
        <div className="grid-card">
          <div style={{ textAlign: 'center', marginBottom: '15px', color: '#E5C158', fontSize: '1.2rem' }}>
            🕒 The Royal Countdown
          </div>
          <div className="countdown-grid">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINS', value: timeLeft.minutes },
              { label: 'SECS', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="countdown-block">
                <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#E5C158', lineHeight: '1' }}>{item.value}</div>
                <div style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '1px', marginTop: '5px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- HOST & VIP BLOCKS --- */}
        <div className="gold-card">
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>HOST</p>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', margin: '0 0 5px 0', fontWeight: 'bold' }}>Alh. Hakeem Olademeji Lawal</h3>
          <p style={{ fontSize: '0.75rem', margin: '0' }}>(B.hons, CAN, economics awards degrees)</p>
          <p style={{ fontSize: '0.75rem', margin: '0', fontStyle: 'italic' }}>(CEO/MD/Founder of Awilya Foundation)</p>
        </div>

        <div className="gold-card">
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Special Invitees / Invited Guests</p>
          <div style={{ fontSize: '0.85rem', lineHeight: '1.6', fontFamily: '"Montserrat", sans-serif', fontWeight: '600' }}>
            Kwara Governor Mall. Abdulrahman Abdulrazak<br/>
            APC Exec Sec Mall. Salman Ishowo<br/>
            Hon. Gafar Ahmed (Thecuteabiola)<br/>
            Engr. Femi Sanni ARABA (FNSN, FRNC)
          </div>
        </div>

        {/* --- STATIC RIBBONS --- */}
        <div className="static-ribbon">
          ⚠️ CATERING MENU (Waiters, Please Take Note!)
        </div>
        <div className="static-ribbon">
          🛒 VIP SYSTEM ACTIVE & SECURED
        </div>

        {/* --- VENUE & EVENT TIMELINE CARD --- */}
        <div className="grid-card">
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#E5C158', textAlign: 'center', marginBottom: '25px' }}>Venue & Event</h2>
          
          <div className="timeline-item">
            <h5 style={{ color: '#E5C158', fontSize: '0.85rem', letterSpacing: '1px', margin: '0 0 5px 0' }}>THUR 25 JUNE</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', margin: '0 0 5px 0' }}>WEDDING-EVE & SISA</h4>
            <a href="https://maps.google.com/?q=Adeta+Ilorin+Nigeria" target="_blank" rel="noreferrer" className="venue-link">Venue:- Olowojare comp, adeta, Ilorin.</a>
            <p style={{ color: '#ADFF2F', fontSize: '0.85rem', margin: '5px 0 10px 0' }}>🕒 Time:- 9-11pm</p>
            <Link href="/traditions" style={{ color: '#E5C158', fontSize: '0.75rem', textDecoration: 'underline' }}>▶ WATCH: DISCOVER THE TRADITION</Link>
          </div>

          <div className="timeline-item">
            <h5 style={{ color: '#E5C158', fontSize: '0.85rem', letterSpacing: '1px', margin: '0 0 5px 0' }}>FRIDAY 26 JUNE</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', margin: '0 0 5px 0' }}>WALIMATUL-QURAN</h4>
            <a href="https://maps.google.com/?q=Sarumi+Mosque+Ilorin" target="_blank" rel="noreferrer" className="venue-link">Venue:- Akala Mosq, Adeta, Ilorin.</a>
            <p style={{ color: '#ADFF2F', fontSize: '0.85rem', margin: '5px 0 15px 0' }}>🕒 Time:- 9:am Prompt</p>

            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', margin: '0 0 5px 0' }}>NIKKAH</h4>
            <a href="https://maps.google.com/?q=Ilorin+Kwara+State" target="_blank" rel="noreferrer" className="venue-link">Venue:- Sarumi Mosq, ode alfa nda, Ilorin.</a>
            <p style={{ color: '#ADFF2F', fontSize: '0.85rem', margin: '5px 0 10px 0' }}>🕒 Time:- Immediately after wolimat ceremony</p>
            <Link href="/traditions" style={{ color: '#E5C158', fontSize: '0.75rem', textDecoration: 'underline' }}>▶ WATCH: DISCOVER THE TRADITION</Link>
          </div>

          <div className="timeline-item" style={{ marginBottom: 0 }}>
            <h5 style={{ color: '#E5C158', fontSize: '0.85rem', letterSpacing: '1px', margin: '0 0 5px 0' }}>SATURDAY 27 JUNE</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', margin: '0 0 5px 0' }}>RECEPTION/DINNER</h4>
            <a href="https://maps.google.com/?q=" target="_blank" rel="noreferrer" className="venue-link">Venue:- Al-kareem Event Center, opp Air-force, Oloje Estate, Ilorin.</a>
            <p style={{ color: '#ADFF2F', fontSize: '0.85rem', margin: '5px 0 10px 0' }}>🕒 Time:- 12:noon.</p>
            <Link href="/traditions" style={{ color: '#E5C158', fontSize: '0.75rem', textDecoration: 'underline' }}>▶ WATCH: DISCOVER THE TRADITION</Link>
          </div>
        </div>

        {/* --- RSVP FORM CARD --- */}
        <div className="grid-card">
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#E5C158', textAlign: 'center', margin: '0 0 10px 0' }}>Secure Your Seat</h2>
          <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center', marginBottom: '25px', lineHeight: '1.5' }}>
            Please enter your details and the VIP Passcode. Your unique Reservation ID will be generated and emailed to you for verification at the event.
          </p>

          {formStatus === 'success' ? (
            <div style={{ padding: '30px 20px', backgroundColor: 'rgba(0, 250, 154, 0.05)', border: '1px solid #00FA9A', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
              <h3 style={{ color: '#00FA9A', marginBottom: '15px', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem' }}>Reservation Confirmed</h3>
              <p style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '20px' }}>Your details have been securely logged.</p>
              <div style={{ backgroundColor: '#000', padding: '15px', borderRadius: '8px', border: '1px dashed #E5C158', marginBottom: '20px' }}>
                <p style={{ color: '#aaa', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 5px 0' }}>Your Unique ID</p>
                <h2 style={{ color: '#E5C158', letterSpacing: '4px', margin: 0 }}>{reservationId}</h2>
              </div>
              <p style={{ color: '#aaa', fontSize: '0.75rem', fontStyle: 'italic' }}>*An automated email with this code is being dispatched to your inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleReservation}>
              <input type="text" placeholder="Full Name (Required)" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Phone Number (Optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              <input type="email" placeholder="Email Address (Required for Auto-Response)" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
              <input type="text" placeholder="Your City/Location (Optional)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
              <div style={{ position: 'relative' }}>
                <input type="password" placeholder="Enter VIP Passcode (Required)" required value={form.passcode} onChange={(e) => setForm({ ...form, passcode: e.target.value })} className="input-field" style={{ borderColor: formStatus === 'error' ? '#ff4444' : 'rgba(229,193,88,0.3)' }} />
                {formStatus === 'error' && <p style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '-10px', marginBottom: '15px' }}>Incorrect Passcode. Please contact the family.</p>}
              </div>
              <button type="submit" className="submit-btn">Generate Reservation ID</button>
            </form>
          )}
        </div>

        {/* --- FOOTER CARD --- */}
        <div style={{ textAlign: 'center', padding: '20px 10px', marginTop: '20px' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#ccc', fontStyle: 'italic', marginBottom: '25px', lineHeight: '1.6' }}>
            "We really appreciate your love, support, and prayers as we start this journey together. With hope and dreams, we look to the future, knowing your kindness will guide and inspire us."
          </p>
          <h4 style={{ color: '#E5C158', letterSpacing: '2px', fontSize: '1rem', marginBottom: '15px' }}>R.S.V.P</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
            {RSVP_CONTACTS.map((contact, i) => (
              <a key={i} href={`tel:${contact.phone}`} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.85rem', borderBottom: '1px solid rgba(229,193,88,0.3)', paddingBottom: '3px' }}>{contact.phone.replace('+234', '0')}</a>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
            Seamlessly Engineered by<br/><span style={{ color: '#E5C158', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '5px', display: 'inline-block' }}>Jare's Choice Labs</span>
          </p>
        </div>

      </div>
    </div>
  );
        }

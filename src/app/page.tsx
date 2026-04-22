'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  if (!isMounted) return <div style={{ backgroundColor: '#1A1A1A', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#fff', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@300;400;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .lux-bg { background-image: radial-gradient(circle at center, #2a2a2a 0%, #050505 100%); position: absolute; inset: 0; z-index: 0; opacity: 0.8; }
        .itinerary-card { position: relative; padding-bottom: 50px; }
        .itinerary-card:last-child { padding-bottom: 0; }
        .action-btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; text-decoration: none; transition: 0.3s; }
        .btn-call { background-color: rgba(212,175,55,0.1); color: #D4AF37; border: 1px solid #D4AF37; }
        .btn-wa { background-color: #25D366; color: #fff; border: 1px solid #25D366; }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section style={{ position: 'relative', width: '100%', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' }}>
        <div className="lux-bg" />
        {/* Placeholder for the exact IV card background texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/iv-texture.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3, mixBlendMode: 'overlay', zIndex: 1 }} />
        
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '20px', animation: 'fadeIn 2s ease-out' }}>
          <h2 style={{ fontSize: '0.8rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '20px' }}>Kwara 2026</h2>
          
          <div style={{ fontFamily: '"Amiri", serif', fontSize: '3rem', color: '#D4AF37', marginBottom: '-10px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            محمد الأول <span style={{ fontSize: '2rem', margin: '0 15px', color: '#fff' }}>&</span> الكوثر
          </div>
          
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3.5rem', color: '#fff', margin: 0, lineHeight: 1.1 }}>
            MUHAMMEDUL'AWWAL <br/>
            <span style={{ fontSize: '2.5rem', color: '#D4AF37' }}>&</span> KAOTHAR
          </h1>
        </div>
      </section>

      {/* --- COUNTDOWN --- */}
      <section style={{ padding: '0 20px', marginTop: '-40px', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '15px', padding: '20px', display: 'flex', justifyContent: 'space-around', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
          {[ 
            { label: 'DAYS', value: timeLeft.days }, 
            { label: 'HOURS', value: timeLeft.hours }, 
            { label: 'MINS', value: timeLeft.minutes }, 
            { label: 'SECS', value: timeLeft.seconds } 
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#D4AF37' }}>{item.value}</div>
              <div style={{ fontSize: '0.55rem', color: '#aaa', letterSpacing: '1px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- VANGUARD OF HONOR (VIPs) --- */}
      <section style={{ padding: '60px 24px', marginTop: '40px', backgroundColor: 'rgba(212,175,55,0.03)', borderTop: '1px solid rgba(212,175,55,0.2)', borderBottom: '1px solid rgba(212,175,55,0.2)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#D4AF37', marginBottom: '30px' }}>Vanguard of Honor</h2>
        
        <h3 style={{ color: '#fff', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>Special Guest of Honor</h3>
        <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#D4AF37', margin: '0 0 5px 0' }}>His Excellency,<br/>Mall. Abdulrahman Abdulrazak</h4>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '50px', fontStyle: 'italic' }}>Executive Governor of Kwara State</p>

        <h3 style={{ color: '#fff', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>Distinguished Dignitaries</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#fff', margin: '0 0 5px 0' }}>Mall. Salman Ishowo</h4>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Executive Secretary of the APC</p>
          </div>
          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#fff', margin: '0 0 5px 0' }}>Alh. Hakeem Olademeji Lawal</h4>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>CEO/Founder of Awilya Foundation</p>
          </div>
          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#fff', margin: '0 0 5px 0' }}>Hon. Gafar Ahmed</h4>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>TheCuteAbiola</p>
          </div>
        </div>
      </section>

      {/* --- 3-DAY ITINERARY --- */}
      <section style={{ padding: '80px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.8rem', color: '#D4AF37', textAlign: 'center', marginBottom: '50px' }}>The Royal Itinerary</h2>
        
        <div style={{ position: 'relative', paddingLeft: '35px', borderLeft: '1px solid rgba(212,175,55,0.3)' }}>
          
          {/* DAY 1 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-42px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#D4AF37', boxShadow: '0 0 15px #D4AF37' }} />
            <h5 style={{ color: '#D4AF37', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Thursday 25 June</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#fff', margin: 0 }}>Wolimah-eve / Sisa</h4>
            <p style={{ color: '#bbb', fontSize: '0.9rem', margin: '10px 0' }}>Venue: Olowojare Comp Adeta, Ilorin<br/>Time: 9:00 PM — 11:00 PM</p>
            <Link href="/traditions" style={{ color: '#D4AF37', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid #D4AF37', paddingBottom: '2px', marginTop: '10px', display: 'inline-block' }}>
              ▶ Watch: Discover the Tradition
            </Link>
          </div>

          {/* DAY 2 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-42px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
            <h5 style={{ color: '#D4AF37', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Friday 26 June</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#fff', margin: 0 }}>Walimatul-qur'an & Nikkah</h4>
            <p style={{ color: '#bbb', fontSize: '0.9rem', margin: '10px 0' }}>Venue: Sarumi Mosque, Ode Alfa Nda, Ilorin</p>
            <Link href="/traditions" style={{ color: '#D4AF37', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid #D4AF37', paddingBottom: '2px', marginTop: '10px', display: 'inline-block' }}>
              ▶ Watch: Discover the Tradition
            </Link>
          </div>

          {/* DAY 3 */}
          <div className="itinerary-card">
            <div style={{ position: 'absolute', left: '-42px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
            <h5 style={{ color: '#D4AF37', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Saturday 27 June</h5>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#fff', margin: 0 }}>The Grand Reception</h4>
            <p style={{ color: '#bbb', fontSize: '0.9rem', margin: '10px 0' }}>Venue: Ilorin, Kwara State<br/>(Access strictly via Physical Invitation Code)</p>
          </div>

        </div>
      </section>

      {/* --- CONCIERGE RSVP GRID --- */}
      <section style={{ padding: '40px 24px 80px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#D4AF37', marginBottom: '15px' }}>Concierge & RSVP</h2>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '40px' }}>Reach out to our designated coordinators to secure your physical IV.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          {RSVP_CONTACTS.map((contact, i) => (
            <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '20px 15px' }}>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '15px' }}>{contact.name}</h4>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <a href={`tel:${contact.phone}`} className="action-btn btn-call" style={{ flex: 1 }}>📞 Call</a>
                <a href={`https://wa.me/${contact.wa}`} target="_blank" rel="noreferrer" className="action-btn btn-wa" style={{ flex: 1 }}>💬 Chat</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#050505', borderTop: '1px solid #1a1a1a' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Architected with precision by<br/><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Jare's Choice Labs</span>
        </p>
      </footer>
    </div>
  );
}

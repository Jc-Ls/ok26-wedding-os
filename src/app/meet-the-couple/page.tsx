'use client';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';

const couple = [
  {
    role: 'The Groom',
    name: 'Muhammed Lawal Olowojare',
    headline: 'A visionary mind and a steadfast, accommodating heart.',
    biography:
      'Hailing from the esteemed Olowojare family of Adeta, Ilorin, Muhammed is a dynamic force of intellect and faith. True to his Aries nature, he brings a passionate, bold leadership to everything he pursues—whether architecting flawless digital experiences as an expert Full Stack Developer or advancing his academic frontiers through his Master\'s studies. Yet, beneath this driven exterior lies a deeply religious, easy-going, and immensely accommodating spirit. He is a trustworthy anchor for his loved ones, ensuring this union is built on unshakeable faith, warmth, and a legacy of premium hospitality.',
  },
  {
    role: 'The Bride',
    name: 'Kaothar Abdulfatai',
    headline: 'A gentle soul of profound grace and visionary understanding.',
    biography:
      'Proudly representing the Sarumi family of Ode Alfa Nda, Ilorin, Kaothar is the serene heartbeat of this premium celebration. Embodying the finest traits of an Aquarius, she possesses a uniquely creative and forward-thinking spirit, effortlessly blending modern elegance with deeply rooted traditions. Her famously easy-going and deeply understanding nature makes everyone around her feel instantly cherished and at home. With a remarkably gentle soul and an inspiring vision, Kaothar curates an atmosphere of pure love, grace, and unforgettable warmth for family and guests alike.',
  },
];


export default function MeetTheCouplePage() {
  return (
    <main className="modern-page" style={{ backgroundImage: 'linear-gradient(135deg, rgba(10,20,47,0.85) 0%, rgba(20,35,70,0.9) 50%, rgba(10,20,47,0.85) 100%)', backgroundAttachment: 'fixed' }}>
      <div className="modern-inner">
        <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
          The Couple
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, marginBottom: '24px' }}>Muhammed &amp; Kaothar</h1>
        <p style={{ maxWidth: 760, lineHeight: 1.8, color: '#D9D2C1', fontSize: '1rem', marginBottom: '42px' }}>
          Discover the story of the Olowojares: a premium union of heritage, warmth, and exquisite celebration. This page introduces the two remarkable individuals at the heart of this gala with premium elegance and poetic presence.
        </p>

        <div className="edge-grid">
          {couple.map((person) => (
            <TiltCard key={person.name}>
              <span style={{ display: 'inline-block', color: '#F9A8D4', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem', marginBottom: '14px' }}>
                {person.role}
              </span>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', margin: '0 0 16px 0', color: '#fff' }}>{person.name}</h2>
              <p style={{ color: '#E5D8BA', fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>{person.headline}</p>
              <p style={{ color: '#CBC1AF', lineHeight: 1.85, fontSize: '0.98rem' }}>{person.biography}</p>
            </TiltCard>
          ))}
        </div>

        {/* Heritage Locations Map */}
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <p style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
            Our Heritage
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1, marginBottom: '24px', color: '#fff' }}>
            Rooted in Ilorin
          </h2>
          <p style={{ maxWidth: 760, lineHeight: 1.8, color: '#D9D2C1', fontSize: '1rem', marginBottom: '32px' }}>
            The Olowojare family of Adeta and the Sarumi family of Ode Alfa Nda—both pillars of Ilorin's rich heritage. This map honors our ancestral roots and the cultural essence that shapes this celebration.
          </p>
          
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(212, 175, 55, 0.2)', marginBottom: '32px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0395519396976!2d8.4916!3d8.4961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104a0532d2b2b2b1%3A0x8b2b2b2b2b2b2b2b!2sIlorin%2C%20Kwara%20State!5e0!3m2!1sen!2sng!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ilorin Heritage Map"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

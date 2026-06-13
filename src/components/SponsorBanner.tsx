'use client';
import { useState, useEffect } from 'react';
import ContactModal from './ContactModal';

interface Sponsor {
  name: string;
  description: string;
  website: string;
  ctaText: string;
  ceoName?: string;
  phone?: string;
  email?: string;
  locations?: string;
  type: 'external' | 'contact';
}

const sponsors: Sponsor[] = [
  {
    name: 'BABA-K TICKETHUB',
    description: 'Premium booking and celebration support powered across the entire wedding experience.',
    website: 'https://baba-k.vercel.app/',
    ctaText: 'Discover the BABA-K Experience',
    type: 'external'
  },
  {
    name: "ZADDYS CREAMERY",
    description: 'One of the most amazing artisanal ice cream shops in the world. Delectable ice cream and frozen delights to sweeten your celebration moments.',
    website: '#',
    ctaText: "Discover Zaddys Creamery",
    type: 'contact',
    ceoName: 'Salman Idris',
    phone: '+234 906 699 2773',
    email: 'SALMANIDRISOLAMILEKAN@GMAIL.COM',
    locations: 'Ilorin, Abuja, Lagos - Nigeria'
  },
  {
    name: "AY'SMART INVESTMENT LTD",
    description: 'Expert investment solutions and real estate services. Specializing in buying, selling, building and developing premium properties.',
    website: '#',
    ctaText: "Discover Ay'smart Investment",
    type: 'contact',
    ceoName: 'Ogunyemi Ayomide Waliyi',
    phone: '+234 813 627 2360',
    email: 'Ayomideogunyemi82@gmail.com',
    locations: 'Malete, Ilorin, Ibadan - Kwara State'
  }
];

export default function SponsorBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const currentSponsor = sponsors[activeIndex];

  const handleSponsorClick = () => {
    if (currentSponsor.type === 'external') {
      window.location.href = currentSponsor.website;
    } else {
      setSelectedSponsor(currentSponsor);
    }
  };

  return (
    <>
      <section className="sponsor-banner">
        <style>{`
          @keyframes sponsorPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.98; transform: scale(1.01); }
          }

          @keyframes sponsorFadeInOut {
            0% { opacity: 0; transform: translateY(8px); }
            8%, 92% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-8px); }
          }

          .sponsor-banner {
            width: 100%;
            padding: 32px;
            background: transparent;
          }

          .sponsor-card {
            border: 1px solid rgba(229, 192, 123, 0.3);
            border-radius: 12px;
            padding: 40px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(229, 192, 123, 0.05));
            transition: all 0.6s ease;
            animation: sponsorFadeInOut 5.5s ease-in-out;
          }

          .sponsor-card.active {
            border-color: rgba(229, 192, 123, 0.8);
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(229, 192, 123, 0.15));
            box-shadow: 0 0 30px rgba(229, 192, 123, 0.3), inset 0 0 20px rgba(229, 192, 123, 0.1);
            animation: sponsorPulse 5.5s ease-in-out infinite;
          }

          .sponsor-card div {
            margin-bottom: 20px;
          }

          .sponsor-card .eyebrow {
            font-family: 'Cinzel', serif;
            font-size: 12px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #D4AF37;
            opacity: 0.9;
            display: block;
            margin-bottom: 12px;
          }

          .sponsor-card h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(28px, 4vw, 42px);
            color: #E5C07B;
            margin: 0 0 12px 0;
            transition: color 0.6s ease;
            line-height: 1.2;
          }

          .sponsor-card p {
            font-family: 'Montserrat', sans-serif;
            color: rgba(224, 224, 224, 0.85);
            font-size: 15px;
            line-height: 1.6;
            margin: 0;
            transition: color 0.6s ease;
          }

          .sponsor-cta-btn {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 32px;
            border-radius: 999px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(229, 192, 123, 0.6);
            color: #E5C07B;
            font-family: 'Cinzel', serif;
            font-size: 13px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .sponsor-cta-btn:hover {
            background: rgba(229, 192, 123, 0.15);
            border-color: #E5C07B;
            box-shadow: 0 8px 24px rgba(229, 192, 123, 0.2);
            transform: translateY(-2px);
          }

          .sponsor-indicators {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 24px;
          }

          .indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(229, 192, 123, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid rgba(229, 192, 123, 0.4);
          }

          .indicator.active {
            background: #E5C07B;
            box-shadow: 0 0 12px rgba(229, 192, 123, 0.6);
            transform: scale(1.3);
          }

          @media (max-width: 768px) {
            .sponsor-banner {
              padding: 24px 16px;
            }

            .sponsor-card {
              padding: 28px;
            }

            .sponsor-card h2 {
              font-size: clamp(22px, 5vw, 32px);
            }

            .sponsor-card p {
              font-size: 14px;
            }
          }

          @media (max-width: 480px) {
            .sponsor-banner {
              padding: 16px 12px;
            }

            .sponsor-card {
              padding: 20px;
            }

            .sponsor-card h2 {
              font-size: clamp(18px, 5vw, 26px);
            }

            .sponsor-card .eyebrow {
              font-size: 11px;
            }

            .sponsor-card p {
              font-size: 13px;
              line-height: 1.5;
            }

            .sponsor-cta-btn {
              font-size: 12px;
              padding: 10px 24px;
            }
          }
        `}</style>

        <div className={`sponsor-card active`}>
          <div>
            <span className="eyebrow">Sponsor Spotlight</span>
            <h2>{currentSponsor.name}</h2>
            <p>{currentSponsor.description}</p>
          </div>
          <button
            className="sponsor-cta-btn"
            onClick={handleSponsorClick}
          >
            {currentSponsor.ctaText}
          </button>
        </div>

        <div className="sponsor-indicators">
          {sponsors.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to sponsor ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <ContactModal
        isOpen={selectedSponsor !== null}
        onClose={() => setSelectedSponsor(null)}
        sponsor={(selectedSponsor as any) || {
          name: '',
          description: '',
          ceoName: '',
          phone: '',
          email: '',
          locations: ''
        }}
      />
    </>
  );
}


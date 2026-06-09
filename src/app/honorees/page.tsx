'use client';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';


const hosts = [
  {
    role: 'The Host',
    name: 'Engr. Hammed Olowojare',
    subtitle: 'CEO / MD Malad Global Concept FCT',
  },
  {
    role: 'The Father of the Day',
    name: 'Alhaji. Hakeem Olademeji Lawal',
    subtitle: 'CEO / Founder Awilya Foundation',
  },
  {
    role: 'Mother of the Day',
    name: 'Alhaja. Binta A Logun',
    subtitle: 'Proprietress Five-ways Int’l School Ilorin',
  },
];
export default function HonoreesPage() {
  return (
    <main className="page-shell">
      <nav aria-label="Primary navigation">
        <Link href="/" className="logo">
          THE OLOWOJARE&apos;S
        </Link>
        <div className="nav-actions">
          <Link href="/itinerary">Schedule</Link>
          <Link href="/meet-the-couple">Couple</Link>
          <Link href="/honorees">Honorees</Link>
          <Link href="#footer">Support</Link>
        </div>
      </nav>
      
      <section className="section about-section" id="assistant">
        <div className="section-heading">
          <span>Hosts & Parents</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.3rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '18px', color: '#fff' }}>
            Honoured Guests Behind the Ceremony
          </h2>
          <p style={{ maxWidth: 760, lineHeight: 1.8, color: '#D9D2C1', fontSize: '1rem', marginBottom: '36px' }}>
            After introducing the groom and bride, we honour the host and the parents of the day who play a central role in welcoming guests and guiding the celebration.
          </p>
        </div>

        <div className="edge-grid compact">
          {hosts.map((person) => (
            <TiltCard key={person.name} className="compact-card">
              <span style={{ display: 'inline-block', color: '#F9A8D4', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem', marginBottom: '14px' }}>
                {person.role}
              </span>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', margin: '0 0 14px 0', color: '#fff' }}>{person.name}</h3>
              <p style={{ color: '#D9D2C1', fontSize: '0.98rem', lineHeight: 1.75, margin: 0 }}>{person.subtitle}</p>
            </TiltCard>
          ))}
        </div>

        <div className="guest-list">
          <h3 style={{ marginBottom: '15px' }}>Special Invitees</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
            <li>
              <strong>Mall. Abdulrahman Abdulrazak (CON)</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
                The Executive Governor of Kwara State
              </span>
            </li>
            <li>
              <strong>Mall. Mustapha M Ishowo</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
                Executive Secretary Kwara State APC
              </span>
            </li>
            <li>
              <strong>Engr. Femi Sanni Araba</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
                CEO / Founder, Flow F.M station 90.7fm Araba Radio
              </span>
            </li>
            <li>
              <strong>Prof. Abdulkadri Laaro</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
                Dean Faculty of Education Kwasu
              </span>
            </li>
            <li>
              <strong>Mr. Alabi Amuda Zeriki</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>Rtd. Perm/sec LGSC</span>
            </li>
            <li>
              <strong>Mr Habeeb Bolaji</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>NULGE Chairman ILR.South</span>
            </li>
            <li>
              <strong>Mr Lanre Gambari</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>Dangote Group of Company</span>
            </li>
            <li>
              <strong>Alhaji Olaitan Jimoh</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>Frm. NNPC Manager</span>
            </li>
            <li>
              <strong>Alhaji Abdul Kareem Lambe</strong>
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.7 }}>Frm. Commissioner 1 LGSC</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

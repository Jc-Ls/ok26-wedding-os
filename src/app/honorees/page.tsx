'use client';
import Link from 'next/link';

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
          <span>About the Celebration</span>
          <h2>Hosts, tradition, and distinguished guests</h2>
        </div>
        <div className="about-grid">
          <article className="about-card">
            <p className="eyebrow">The Host</p>
            <h3>Engr. Hammed Olowojare</h3>
            <p>CEO/MD Malad Global Concept FCT</p>
          </article>
          <article className="about-card">
            <p className="eyebrow">Father of the Day</p>
            <h3>Alhaji Hakeem Olademeji Lawal</h3>
            <p>CEO / Founder Awilya Foundation</p>
          </article>
          <article className="about-card">
            <p className="eyebrow">Mother of the Day</p>
            <h3>Alhaja Binta A. Logun</h3>
            <p>Proprietress Five-Ways International School, Ilorin</p>
          </article>
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

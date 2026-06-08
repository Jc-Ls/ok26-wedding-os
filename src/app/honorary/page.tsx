'use client';

import Link from 'next/link';

export default function HonoraryPage() {
  return (
    <main
      style={{
        backgroundColor: '#06140F',
        minHeight: '100vh',
        color: '#FDFBF7',
        fontFamily: '"Montserrat", sans-serif',
        padding: '60px 20px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');

        .honorary-container {
          max-width: 800px;
          margin: 0 auto;
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section-title {
          font-family: "Cormorant Garamond", serif;
          font-size: 2.5rem;
          color: #E5D08F;
          text-align: center;
          margin-bottom: 50px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .honoree-card {
          background: rgba(229, 208, 143, 0.05);
          border: 1px solid rgba(229, 208, 143, 0.2);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          text-align: center;
        }

        .honoree-label {
          font-size: 0.75rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #E5D08F;
          margin-bottom: 10px;
        }

        .honoree-name {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.8rem;
          color: #FDFBF7;
          margin: 0;
          font-weight: 400;
        }

        .honoree-role {
          font-size: 0.9rem;
          color: #aaa;
          margin-top: 8px;
          font-style: italic;
        }

        .divider {
          height: 1px;
          background: rgba(229, 208, 143, 0.2);
          margin: 50px 0;
        }

        .about-section {
          text-align: center;
          margin: 50px 0;
          padding: 30px;
          background: rgba(229, 208, 143, 0.03);
          border-radius: 12px;
          border-left: 4px solid #E5D08F;
        }

        .about-title {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.8rem;
          color: #E5D08F;
          margin-bottom: 20px;
        }

        .about-text {
          font-size: 1rem;
          line-height: 1.8;
          color: #FDFBF7;
          letter-spacing: 0.5px;
        }

        .read-more-btn {
          display: inline-block;
          margin-top: 50px;
          padding: 16px 50px;
          background: linear-gradient(145deg, #E5D08F, #C7A951);
          color: #06140F;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: none;
          transition: 0.3s;
          box-shadow: 0 10px 30px rgba(229, 208, 143, 0.2);
        }

        .read-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(229, 208, 143, 0.3);
        }

        .footer {
          text-align: center;
          margin-top: 80px;
          padding-top: 30px;
          border-top: 1px solid rgba(229, 208, 143, 0.2);
          font-size: 0.85rem;
          color: #888;
        }

        .nav-link {
          color: #E5D08F;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
          transition: 0.3s;
        }

        .nav-link:hover {
          color: #D4AF37;
        }
      `}</style>

      <div className="honorary-container">
        <h1 className="section-title">About the Celebration</h1>

        <div className="honoree-card">
          <p className="honoree-label">The Host</p>
          <h3 className="honoree-name">Engr. Hammed Olowojare</h3>
          <p className="honoree-role">CEO/MD Malad Global Concept FCT</p>
        </div>

        <div className="honoree-card">
          <p className="honoree-label">Father of the Day</p>
          <h3 className="honoree-name">Alhaji Hakeem Olademeji Lawal</h3>
          <p className="honoree-role">CEO / Founder Awilya Foundation</p>
        </div>

        <div className="honoree-card">
          <p className="honoree-label">Mother of the Day</p>
          <h3 className="honoree-name">Alhaja Binta A. Logun</h3>
          <p className="honoree-role">Proprietress Five-Ways International School, Ilorin</p>
        </div>

        <div className="divider" />

        <div className="about-section">
          <h2 className="about-title">Invited Guests</h2>
          <p className="about-text" style={{ textAlign: 'left' }}>
            <strong style={{ color: '#E5D08F' }}>Special Invitees Include:</strong>
            <br /><br />
            • Mall. Abdulrahman Abdulrazaq (CON) – The Executive Governor of Kwara State<br />
            • Mall. Mustapha M. Ishowo – Executive Secretary, Kwara State APC<br />
            • Engr. Femi Sanni Araba – CEO / Founder, Flow FM Station 90.7FM<br />
            • Prof. Abdulkadri Laaro – Dean, Faculty of Education KWASU<br />
            • Mr. Alabi Amuda Zeriki – Retired Perm. Sec., LGSC<br />
            • Mr. Habeeb Bolaji – NULGE Chairman Ilorin South<br />
            • Mr. Lanre Gambari – Dangote Group of Companies<br />
            • Alhaji Olaitan Jimoh – Former NNPC Manager<br />
            • Alhaji Abdul Kareem Lambe – Former Commissioner 1, LGSC
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/vault" className="read-more-btn">
            Continue to Blessings →
          </Link>
        </div>

        <div className="footer">
          <Link href="/" className="nav-link">← Back Home</Link>
        </div>
      </div>
    </main>
  );
}

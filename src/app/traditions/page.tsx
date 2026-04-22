'use client';
import Link from 'next/link';

export default function TraditionsHub() {
  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#fff', fontFamily: '"Montserrat", sans-serif', paddingBottom: '80px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@300;400;600&display=swap');
        .video-wrapper { width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid rgba(212,175,55,0.3); margin-bottom: 20px; background-color: #000; }
        video { width: 100%; display: block; }
      `}</style>

      {/* Header */}
      <header style={{ padding: '30px 24px', borderBottom: '1px solid rgba(212,175,55,0.2)', position: 'sticky', top: 0, backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>←</span> Back to Itinerary
        </Link>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3rem', color: '#D4AF37', textAlign: 'center', marginBottom: '10px' }}>Our Heritage</h1>
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '60px' }}>
          Immerse yourself in the rich Islamic and indigenous traditions of Ilorin as we celebrate the union of two great families.
        </p>

        {/* Tradition Block: Sisa */}
        <article style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#fff', marginBottom: '20px' }}>Sisa & Wolimah-eve</h2>
          <div className="video-wrapper">
            <video controls poster="/images/sisa-placeholder.jpg">
              <source src="/videos/sisa-explainer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p style={{ color: '#bbb', fontSize: '0.95rem', lineHeight: '1.8' }}>
            A deeply rooted Ilorin tradition honoring the groom's heritage and family ties. This event serves as the spiritual and communal gateway into the wedding festivities, marked by familial prayers and the gathering of the community.
          </p>
        </article>

        {/* Tradition Block: Walimatul-Quran */}
        <article style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#fff', marginBottom: '20px' }}>Walimatul-qur'an & Nikkah</h2>
          <div className="video-wrapper">
            <video controls poster="/images/nikkah-placeholder.jpg">
              <source src="/videos/nikkah-explainer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p style={{ color: '#bbb', fontSize: '0.95rem', lineHeight: '1.8' }}>
            The spiritual core of our union. The Walimatul-qur'an celebrates the recitation of the Holy Text, followed immediately by the Nikkah, where the vows are solemnized under Islamic law at the Sarumi Mosque.
          </p>
        </article>
      </main>
    </div>
  );
}

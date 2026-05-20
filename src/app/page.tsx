'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [step, setStep] = useState(0); 
  const [showArabic, setShowArabic] = useState(false);
  const [showEnglishTitles, setShowEnglishTitles] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);

  const heroImages = [
    'https://res.cloudinary.com/din74ljlu/image/upload/v1779078967/SAVE_20260518_242717_kylnnd.jpg',
    'https://res.cloudinary.com/din74ljlu/image/upload/v1779079235/SAVE_20260518_242642_vyqfjk.jpg',
    'https://res.cloudinary.com/din74ljlu/image/upload/v1779080144/SAVE_20260518_242650_wgqxex.jpg'
  ];

  useEffect(() => {
    if (step === 0) return;
    const timer = setInterval(() => setCurrentHero(p => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, [step, heroImages.length]);

  const enterGala = () => {
    setStep(1);
    setShowArabic(true);
    setTimeout(() => { setShowArabic(false); setShowEnglishTitles(true); }, 4500);
  };

  return (
    <div style={{ backgroundColor: '#06140F', minHeight: '100vh', color: '#FDFBF7', overflow: 'hidden', fontFamily: '"Montserrat", sans-serif', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');
        .arabic-pop { font-family: 'Amiri', serif; color: #E5D08F; font-size: clamp(3rem, 10vw, 5rem); opacity: 0; animation: popInOut 4.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; text-align: center; line-height: 1.2; }
        @keyframes popInOut { 0% { opacity: 0; transform: scale(0.8) translateY(20px); filter: blur(10px); } 20% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); } 80% { opacity: 1; transform: scale(1.05) translateY(0); filter: blur(0px); } 100% { opacity: 0; transform: scale(1.1) translateY(-20px); filter: blur(10px); } }
        @keyframes subtleFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .english-titles { animation: subtleFadeIn 2s ease-out forwards; text-align: center; }
        .btn-champagne { display: inline-block; padding: 18px 40px; background: linear-gradient(145deg, #E5D08F, #C7A951); color: #06140F; font-weight: 600; border: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; cursor: pointer; box-shadow: 0 10px 30px rgba(229, 208, 143, 0.2); transition: 0.3s; text-decoration: none; }
        .btn-minimal { background: transparent; color: #E5D08F; border: 1px solid rgba(229, 208, 143, 0.5); padding: 12px 30px; border-radius: 30px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; cursor: pointer; transition: 0.3s; }
        .booklet-page { animation: subtleFadeIn 1s ease-out forwards; width: 100%; max-width: 500px; margin: 0 auto; padding: 20px; text-align: center; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: step === 0 ? 0 : 1, transition: 'opacity 2s ease-in-out' }}>
        {heroImages.map((src, index) => (
          <div key={index} style={{ position: 'absolute', inset: 0, opacity: index === currentHero ? 0.6 : 0, transition: 'opacity 2.5s ease-in-out', backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,20,15,0.4) 0%, rgba(6,20,15,0.9) 100%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {step === 0 && (
          <div className="booklet-page" style={{ maxWidth: '600px' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#E5D08F', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 20px 0' }}>The M'K26 Gala</h1>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '20px' }}>✨</span>
            <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '1rem', lineHeight: '2', letterSpacing: '2px', color: '#FDFBF7', marginBottom: '40px' }}>
              It brings us immeasurable joy to welcome you to the celebration of our love. Your presence is the greatest gift.
            </p>
            <button onClick={enterGala} className="btn-champagne">Enter The Gala</button>
          </div>
        )}

        {step === 1 && (
          <div style={{ width: '100%' }}>
            {showArabic && <div className="arabic-pop">محمد <br/> و <br/> كوثر</div>}
            {showEnglishTitles && (
              <div className="english-titles">
                <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.8rem', letterSpacing: '6px', color: '#E5D08F', textTransform: 'uppercase', marginBottom: '15px' }}>The M'K26 Gala</p>
                <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 10vw, 4rem)', color: '#FDFBF7', margin: '0 0 20px 0', fontWeight: '400' }}>Muhammed <br/><span style={{ color: '#E5D08F', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 8vw, 3rem)' }}>&</span> Kaothar</h1>
                <div style={{ height: '1px', width: '60px', background: 'rgba(229, 208, 143, 0.5)', margin: '30px auto' }}></div>
                <button onClick={() => setStep(2)} className="btn-minimal">Read More</button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="booklet-page">
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#E5D08F', marginBottom: '40px', fontWeight: '400', fontStyle: 'italic' }}>The Honorees</h2>
            
            <div style={{ marginBottom: '30px' }}><p style={{ fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(253,251,247,0.5)', marginBottom: '8px' }}>The Host</p><h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#FDFBF7', margin: 0, fontWeight: '400' }}>Engr. Hammed Olowojare</h3></div>
            
            <div style={{ marginBottom: '30px' }}><p style={{ fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#E5D08F', marginBottom: '8px' }}>Mother of the Day</p><h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#FDFBF7', margin: 0, fontWeight: '400' }}>[Insert Mother's Name]</h3></div>
            
            <div style={{ marginBottom: '30px' }}><p style={{ fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(253,251,247,0.5)', marginBottom: '8px' }}>Guest of Honour</p><h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#FDFBF7', margin: 0, fontWeight: '400' }}>Alh. Hakeem Olademeji Lawal</h3></div>
            
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'rgba(229, 208, 143, 0.05)', borderRadius: '12px', border: '1px solid rgba(229, 208, 143, 0.2)' }}>
              <p style={{ fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#E5D08F', marginBottom: '15px' }}>Special Invited Guests</p>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#FDFBF7', margin: '0 0 10px 0', fontWeight: '400' }}>Alh. M. Salman <span style={{ fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic' }}>(Exec. Sec, APC)</span></h3>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#FDFBF7', margin: '0 0 10px 0', fontWeight: '400' }}>[Insert Special Guest 2]</h3>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#FDFBF7', margin: '0 0 10px 0', fontWeight: '400' }}>[Insert Special Guest 3]</h3>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#FDFBF7', margin: 0, fontWeight: '400' }}>[Insert Special Guest 4]</h3>
            </div>

            <button onClick={() => setStep(3)} className="btn-minimal">View Itinerary</button>
          </div>
        )}

        {step === 3 && (
          <div className="booklet-page">
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#E5D08F', marginBottom: '30px', fontWeight: '400', fontStyle: 'italic' }}>The Itinerary</h2>
            <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid rgba(229, 208, 143, 0.2)' }}><p style={{ color: '#E5D08F', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Thursday</p><h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#FDFBF7', margin: 0, fontWeight: '400' }}>Wedding Eve</h4></div>
            <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid rgba(229, 208, 143, 0.2)' }}><p style={{ color: '#E5D08F', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Friday</p><h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#FDFBF7', margin: 0, fontWeight: '400' }}>Nikkah Ceremony</h4></div>
            <div style={{ marginBottom: '40px' }}><p style={{ color: '#E5D08F', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Saturday</p><h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#FDFBF7', margin: 0, fontWeight: '400' }}>The Royal Reception</h4></div>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FDFBF7', fontSize: '1.4rem', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '40px' }}>"May Allah bless for you, and may He bless on you, and combine both of you in good."</p>
            <Link href="/reserve" className="btn-champagne" style={{ display: 'block', width: '100%', marginBottom: '40px', textDecoration: 'none' }}>Secure VIP Pass</Link>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type MenuItem = { id: string; name: string; category: string; imageUrl: string; isAvailable: boolean; };

function MenuContent() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table') || 'Unknown';
  
  const [showSplash, setShowSplash] = useState(true);
  const [form, setForm] = useState({ guestName: '', ticketId: '', mealName: '', drinkName: '', withSalad: false });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('/api/menu').then(res => res.json()).then(data => {
      if(Array.isArray(data)) { setMenuItems(data.filter((item: MenuItem) => item.isAvailable)); }
      setLoadingMenu(false);
    }).catch(() => setLoadingMenu(false));
  }, []);

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName || !form.mealName) return alert("Please enter your name and select a meal.");
    setStatus('submitting');
    try {
      await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, tableNumber }) });
      setStatus('success');
    } catch (err) { setStatus('idle'); }
  };

  const shareCard = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const cardElement = document.getElementById('blessing-card');
      if (!cardElement) return;

      const canvas = await html2canvas(cardElement, { scale: 2, backgroundColor: '#06140F', useCORS: true });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'MK26_Gala_Blessing.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'M\'K26 Gala', text: 'Celebrating Muhammed & Kaothar! ✨' });
        } else {
          const link = document.createElement('a'); link.download = 'MK26_Gala_Blessing.png'; link.href = URL.createObjectURL(blob); link.click();
        }
      });
    } catch (error) {
      alert("Oops! Failed to generate your shareable card. Please try again.");
    }
  };

  const meals = menuItems.filter(i => i.category === 'MEAL');
  const drinks = menuItems.filter(i => i.category === 'DRINK');

  if (showSplash) {
    return (
      <div style={{ backgroundColor: '#06140F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
          .mk-splash { font-family: '"Cormorant Garamond", serif'; color: #E5D08F; font-size: 5rem; letter-spacing: 6px; animation: pulseFade 3s ease-in-out forwards; }
          @keyframes pulseFade { 0% { opacity: 0; transform: scale(0.9); filter: blur(5px); } 30% { opacity: 1; transform: scale(1); filter: blur(0px); } 80% { opacity: 1; transform: scale(1.05); filter: blur(0px); } 100% { opacity: 0; transform: scale(1.1); filter: blur(5px); } }
        `}</style>
        <h1 className="mk-splash">M'K26</h1>
      </div>
    );
  }

  return (
    <div style={{ backgroundImage: 'linear-gradient(to bottom, rgba(6,20,15,0.7), rgba(6,20,15,0.98)), url("https://res.cloudinary.com/din74ljlu/image/upload/v1779080657/SAVE_20260518_242659_ftuf3e.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', padding: '20px', fontFamily: '"Montserrat", sans-serif', color: '#FDFBF7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .glass-panel { background: rgba(10, 35, 24, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(229, 208, 143, 0.2); border-radius: 16px; padding: 30px 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: fadeIn 1s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .input-emerald { width: 100%; padding: 16px; margin-bottom: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(229, 208, 143, 0.5); border-radius: 8px; color: #FDFBF7; font-family: "Montserrat", sans-serif; font-size: 1.1rem; outline: none; text-align: center; }
        .input-emerald::placeholder { color: rgba(253, 251, 247, 0.4); font-weight: 300; }
        .btn-champagne { width: 100%; padding: 20px; background: linear-gradient(145deg, #E5D08F, #C7A951); color: #06140F; font-weight: 600; border: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; cursor: pointer; transition: transform 0.2s; }
        .btn-champagne:active { transform: scale(0.98); }
        
        /* NEW GRID STYLES */
        .menu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px; }
        .grid-card { border: 1px solid rgba(229, 208, 143, 0.2); border-radius: 12px; padding: 15px 10px; cursor: pointer; transition: 0.3s; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .grid-card.selected { border-color: #E5D08F; background: rgba(229, 208, 143, 0.15); box-shadow: inset 0 0 15px rgba(229, 208, 143, 0.1); transform: scale(0.98); }
        .food-image { width: 70px; height: 70px; border-radius: 50%; background-size: cover; background-position: center; border: 2px solid rgba(229, 208, 143, 0.3); margin-bottom: 10px; }
        .drink-image { width: 50px; height: 50px; border-radius: 50%; background-size: cover; background-position: center; border: 2px solid rgba(229, 208, 143, 0.3); margin-bottom: 10px; }
      `}</style>
      
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2.5rem', margin: '5px 0' }}>Table {tableNumber}</h1>
        <div style={{ height: '1px', width: '40px', background: '#E5D08F', margin: '15px auto' }}></div>
      </div>
      
      <div className="glass-panel">
        {status === 'success' ? (
          <div>
            <div id="blessing-card" style={{ padding: '40px 20px', background: '#06140F', border: '2px solid #E5D08F', borderRadius: '16px', margin: '10px 0 30px 0', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'url("https://res.cloudinary.com/din74ljlu/image/upload/v1779080657/SAVE_20260518_242659_ftuf3e.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '15px' }}>✨</span>
                <p style={{ color: '#E5D08F', fontFamily: '"Montserrat", sans-serif', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>VIP Guest</p>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FDFBF7', fontSize: '2.2rem', margin: '0 0 5px 0', fontWeight: '400' }}>{form.guestName}</h2>
                {form.ticketId && <p style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '0.9rem', margin: '0 0 20px 0', letterSpacing: '2px' }}>{form.ticketId}</p>}
                
                <p style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '1.4rem', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '30px', padding: '0 10px', marginTop: form.ticketId ? '0' : '20px' }}>
                  "May Allah bless for you, and may He bless on you, and combine both of you in good."
                </p>
                <div style={{ borderTop: '1px solid rgba(229, 208, 143, 0.3)', paddingTop: '20px' }}>
                  <p style={{ color: '#aaa', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>M'K26 Gala</p>
                  <p style={{ color: '#E5D08F', fontSize: '0.9rem', margin: '5px 0 0 0' }}>Muhammed & Kaothar</p>
                </div>
              </div>
            </div>
            <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>Your selection has been sent to the Royal Kitchen. Waiters will serve you shortly.</p>
            <button onClick={shareCard} className="btn-champagne" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>📸</span> Share to Status
            </button>
          </div>
        ) : loadingMenu ? (
          <p style={{ textAlign: 'center', color: '#E5D08F' }}>Fetching today's selections...</p>
        ) : (
          <form onSubmit={submitOrder}>
            {/* GRID LAYOUT FOR FOOD */}
            <p style={{ fontSize: '0.85rem', color: '#E5D08F', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', textAlign: 'center' }}>1. Culinary Selection</p>
            <div className="menu-grid">
              {meals.map(meal => (
                <div key={meal.id} className={`grid-card ${form.mealName === meal.name ? 'selected' : ''}`} onClick={() => setForm({...form, mealName: meal.name})}>
                  {meal.imageUrl ? <div className="food-image" style={{ backgroundImage: `url(${meal.imageUrl})` }} /> : <div className="food-image" style={{ backgroundColor: '#222' }} />}
                  <h4 style={{ margin: 0, color: form.mealName === meal.name ? '#E5D08F' : '#fff', fontWeight: '500', fontSize: '1rem' }}>{meal.name}</h4>
                </div>
              ))}
            </div>

            {/* GRID LAYOUT FOR DRINKS */}
            <p style={{ fontSize: '0.85rem', color: '#E5D08F', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', textAlign: 'center' }}>2. Beverage</p>
            <div className="menu-grid">
              {drinks.map(drink => (
                <div key={drink.id} className={`grid-card ${form.drinkName === drink.name ? 'selected' : ''}`} onClick={() => setForm({...form, drinkName: drink.name})}>
                  {drink.imageUrl ? <div className="drink-image" style={{ backgroundImage: `url(${drink.imageUrl})` }} /> : <div className="drink-image" style={{ backgroundColor: '#222' }} />}
                  <h4 style={{ margin: 0, color: form.drinkName === drink.name ? '#E5D08F' : '#fff', fontWeight: '500', fontSize: '0.9rem' }}>{drink.name}</h4>
                </div>
              ))}
            </div>

            {/* GUEST SIGNATURE & TICKET ID */}
            <div style={{ borderTop: '1px solid rgba(229, 208, 143, 0.2)', paddingTop: '25px', marginTop: '10px' }}>
              <p style={{ fontSize: '0.85rem', color: '#E5D08F', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', textAlign: 'center' }}>3. Guest Details</p>
              
              <input type="text" placeholder="Full Name *" className="input-emerald" value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} required />
              
              <input type="text" placeholder="Ticket ID (Optional)" className="input-emerald" value={form.ticketId} onChange={e => setForm({...form, ticketId: e.target.value.toUpperCase()})} style={{ letterSpacing: '2px' }} />
            </div>
            
            <button type="submit" disabled={status === 'submitting'} className="btn-champagne">{status === 'submitting' ? 'Sending to Kitchen...' : 'Place Order'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function GuestMenuPage() {
  return <Suspense fallback={<div style={{ backgroundColor: '#06140F', minHeight: '100vh' }}>Loading...</div>}><MenuContent /></Suspense>;
}

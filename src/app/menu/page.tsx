'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type MenuItem = { id: string; name: string; category: string; imageUrl: string; isAvailable: boolean; };

function MenuContent() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table') || 'Unknown';
  const [form, setForm] = useState({ guestName: '', mealName: '', drinkName: '', withSalad: false });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

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

  const meals = menuItems.filter(i => i.category === 'MEAL');
  const drinks = menuItems.filter(i => i.category === 'DRINK');

  return (
    <div style={{ backgroundImage: 'linear-gradient(to bottom, rgba(6,20,15,0.7), rgba(6,20,15,0.98)), url("https://res.cloudinary.com/din74ljlu/image/upload/v1779080657/SAVE_20260518_242659_ftuf3e.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', padding: '20px', fontFamily: '"Montserrat", sans-serif', color: '#FDFBF7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .glass-panel { background: rgba(10, 35, 24, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(229, 208, 143, 0.2); border-radius: 16px; padding: 30px 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .input-emerald { width: 100%; padding: 16px; margin-bottom: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(229, 208, 143, 0.3); border-radius: 8px; color: #FDFBF7; font-family: "Montserrat", sans-serif; font-size: 1rem; outline: none; }
        .btn-champagne { width: 100%; padding: 20px; background: linear-gradient(145deg, #E5D08F, #C7A951); color: #06140F; font-weight: 600; border: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; cursor: pointer; }
        .item-card { border: 1px solid rgba(229, 208, 143, 0.2); border-radius: 8px; padding: 15px; margin-bottom: 10px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 15px; }
        .item-card.selected { border-color: #E5D08F; background: rgba(229, 208, 143, 0.1); }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2.5rem', margin: '5px 0' }}>Table {tableNumber}</h1>
        <div style={{ height: '1px', width: '40px', background: '#E5D08F', margin: '15px auto' }}></div>
      </div>
      <div className="glass-panel">
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}><span style={{ fontSize: '3rem' }}>🛎️</span><h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2rem' }}>Order Received</h2><p style={{ color: '#aaa' }}>Waiters will bring it shortly.</p></div>
        ) : loadingMenu ? (
          <p style={{ textAlign: 'center', color: '#E5D08F' }}>Fetching today's selections...</p>
        ) : (
          <form onSubmit={submitOrder}>
            <p style={{ fontSize: '0.85rem', color: '#E5D08F', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>1. Your Name</p>
            <input type="text" placeholder="Enter your name" className="input-emerald" value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} required />
            
            <p style={{ fontSize: '0.85rem', color: '#E5D08F', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>2. Culinary Selection</p>
            <div style={{ marginBottom: '20px' }}>
              {meals.map(meal => (
                <div key={meal.id} className={`item-card ${form.mealName === meal.name ? 'selected' : ''}`} onClick={() => setForm({...form, mealName: meal.name})}>
                  {meal.imageUrl && <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundImage: `url(${meal.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                  <div style={{ flex: 1 }}><h4 style={{ margin: 0, color: form.mealName === meal.name ? '#E5D08F' : '#fff' }}>{meal.name}</h4></div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.85rem', color: '#E5D08F', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>3. Beverage</p>
            <div style={{ marginBottom: '20px' }}>
              {drinks.map(drink => (
                <div key={drink.id} className={`item-card ${form.drinkName === drink.name ? 'selected' : ''}`} onClick={() => setForm({...form, drinkName: drink.name})}>
                  {drink.imageUrl && <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundImage: `url(${drink.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                  <div style={{ flex: 1 }}><h4 style={{ margin: 0, color: form.drinkName === drink.name ? '#E5D08F' : '#fff', fontSize: '0.95rem' }}>{drink.name}</h4></div>
                </div>
              ))}
            </div>
            
            <button type="submit" disabled={status === 'submitting'} className="btn-champagne">{status === 'submitting' ? 'Sending...' : 'Place Order'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function GuestMenuPage() {
  return <Suspense fallback={<div style={{ backgroundColor: '#06140F', minHeight: '100vh' }}>Loading...</div>}><MenuContent /></Suspense>;
}

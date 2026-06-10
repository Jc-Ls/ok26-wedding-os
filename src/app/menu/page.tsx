'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

type MenuItem = { id: string; name: string; category: string; imageUrl: string; isAvailable: boolean; };
type OrderResponse = { id?: string; status?: string } | null;

const fallbackMenu: MenuItem[] = [
  { id: '1', name: 'Royal Jollof Rice & Spicy Beef', category: 'MEAL', imageUrl: 'https://images.unsplash.com/photo-1662481028751-bb3d5eb9231f?q=80&w=200&auto=format&fit=crop', isAvailable: true },
  { id: '2', name: 'Amala, Ewedu & Assorted Meat', category: 'MEAL', imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=200&auto=format&fit=crop', isAvailable: true },
  { id: '4', name: 'Chilled Zobo Drink', category: 'DRINK', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=200&auto=format&fit=crop', isAvailable: true }
];

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // 🔥 FAST ROUTER INJECTED
  const tableNumber = searchParams.get('table') || 'VIP';
  
  const [step, setStep] = useState(0); 
  const [form, setForm] = useState({ guestName: '', ticketId: '', mealName: '', drinkName: '', withSalad: false, souvenirNudge: false });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [trackingStatus, setTrackingStatus] = useState('Pending');
  const [blessing, setBlessing] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
  const [activities, setActivities] = useState<string[]>([]);

  const throwbackImages = [
    'https://res.cloudinary.com/din74ljlu/image/upload/v1779078967/SAVE_20260518_242717_kylnnd.jpg',
    'https://res.cloudinary.com/din74ljlu/image/upload/v1779079235/SAVE_20260518_242642_vyqfjk.jpg',
    'https://res.cloudinary.com/din74ljlu/image/upload/v1779080144/SAVE_20260518_242650_wgqxex.jpg'
  ];

  const restoreOrder = useCallback(async () => {
    const savedOrderId = localStorage.getItem('mk26_active_order');
    if (!savedOrderId) return false;

    setActiveOrderId(savedOrderId);
    try {
      const res = await fetch(`/api/orders/${savedOrderId}`);
      const data = (await res.json()) as OrderResponse;
      if (data?.status === 'Completed') {
        setStep(6);
        return true;
      }
      setStep(5);
      setTrackingStatus(data?.status || 'Pending');
    } catch {
      setStep(5);
    }
    return true;
  }, []);

  // 🔥 MEMORY RESTORE (Now checks if order was already completed!)
  useEffect(() => {
    if (localStorage.getItem('mk26_active_order')) {
      queueMicrotask(() => {
        void restoreOrder();
      });
      return;
    }

    const timer = setTimeout(() => setStep(1), 3500);
    return () => clearTimeout(timer);
  }, [restoreOrder]);

  // LIVE DATABASE POLLING
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activities');
        if (res.ok) setActivities(await res.json());
      } catch {}
    };
    
    fetchActivities();
    const activityInterval = setInterval(fetchActivities, 2500);

    let orderInterval: NodeJS.Timeout;
    if (activeOrderId && step === 5) {
      orderInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/orders/${activeOrderId}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.status) {
              if (data.status === 'On the Way' && trackingStatus !== 'On the Way') {
                if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
              }
              setTrackingStatus(data.status);
            }
          }
        } catch {}
      }, 3000);
    }

    return () => {
      clearInterval(activityInterval);
      if (orderInterval) clearInterval(orderInterval);
    };
  }, [activeOrderId, step, trackingStatus]);

  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setMenuItems(data.filter((item: MenuItem) => item.isAvailable));
      else setMenuItems(fallbackMenu);
      setLoadingMenu(false);
    } catch {
      setMenuItems(fallbackMenu);
      setLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchMenu();
    });
  }, [fetchMenu]);

  const handleFoodSelection = (mealName: string) => {
    setForm({ ...form, mealName });
    if (/rice|jollof|fried/i.test(mealName)) setStep(2); else setStep(3);
  };

  const submitRoyalOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName) return alert("Please enter your name.");
    
    try {
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, tableNumber }) });
      const data = await res.json();
      if (data.id) {
        localStorage.setItem('mk26_active_order', data.id);
        setActiveOrderId(data.id);
        setTrackingStatus('Pending');
        setStep(5);
      }
    } catch { alert("Failed to connect to Kitchen. Please try again."); }
  };

  const cancelOrder = async () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      if (activeOrderId) await fetch(`/api/orders/${activeOrderId}`, { method: 'DELETE' });
      localStorage.removeItem('mk26_active_order');
      setActiveOrderId(null);
      setForm({ ...form, mealName: '', drinkName: '' });
      setStep(1);
    }
  };

  const confirmDelivery = async () => {
    if (activeOrderId) await fetch(`/api/orders/${activeOrderId}`, { method: 'PATCH' });
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#D4AF37', '#10b981', '#FFFFFF'] });
    setStep(6);
  };

  const handleSelfieCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelfieUrl(URL.createObjectURL(e.target.files[0]));
  };

  const shareToWhatsApp = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const cardElement = document.getElementById('viral-card');
      if (!cardElement) return;
      const canvas = await html2canvas(cardElement, { scale: 2, backgroundColor: '#06140F', useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'MK26_Gala.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'M\'K26 Gala', text: 'Celebrating Muhammed & Kaothar! ✨' });
        } else {
          const link = document.createElement('a'); link.download = 'MK26_Gala.png'; link.href = URL.createObjectURL(blob); link.click();
        }
      });
    } catch { alert("Failed to generate your shareable card."); }
  };

  const resetFlow = () => {
    localStorage.removeItem('mk26_active_order');
    setActiveOrderId(null);
    setForm({ guestName: '', ticketId: '', mealName: '', drinkName: '', withSalad: false, souvenirNudge: false });
    setBlessing(''); setSelfieUrl(''); setStep(1);
  };

  // 🔥 FAST NAVIGATION TO HOME
  const goHome = () => {
    localStorage.removeItem('mk26_active_order');
    router.push('/'); 
  };

  const meals = menuItems.filter(i => i.category === 'MEAL');
  const drinks = menuItems.filter(i => i.category === 'DRINK');

  if (step === 0) {
    return (
      <div className="page-shell menu-page menu-intro">
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '5rem', letterSpacing: '6px', animation: 'pulseFade 3s ease-in-out forwards' }}>M&apos;K26</h1>
        <style>{`@keyframes pulseFade { 0% { opacity: 0; transform: scale(0.9); filter: blur(5px); } 30% { opacity: 1; transform: scale(1); filter: blur(0px); } 80% { opacity: 1; transform: scale(1.05); filter: blur(0px); } 100% { opacity: 0; transform: scale(1.1); filter: blur(5px); } }`}</style>
      </div>
    );
  }

  return (
    <div className="page-shell menu-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .ticker-wrap { width: 100%; overflow: hidden; background: rgba(10, 35, 24, 0.85); border-bottom: 1px solid rgba(229, 208, 143, 0.4); padding: 10px 0; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        .ticker-move { display: inline-block; white-space: nowrap; animation: ticker 25s linear infinite; }
        @keyframes ticker { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .ticker-item { color: #E5D08F; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; margin-right: 50px; font-weight: 500; }
        .glass-panel { background: rgba(10, 35, 24, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(229, 208, 143, 0.3); border-radius: 20px; padding: 30px 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: floatUp 0.5s ease-out forwards; }
        @keyframes floatUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .premium-card { display: flex; align-items: center; background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(0,0,0,0.3)); border: 1px solid rgba(229, 208, 143, 0.2); border-radius: 16px; padding: 15px; margin-bottom: 15px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; }
        .premium-card:active { transform: scale(0.96); border-color: #E5D08F; background: rgba(229, 208, 143, 0.15); }
        .card-img { width: 85px; height: 85px; border-radius: 12px; background-size: cover; background-position: center; border: 2px solid rgba(229, 208, 143, 0.4); flex-shrink: 0; }
        .glow-badge { position: absolute; top: -1px; right: -1px; background: linear-gradient(90deg, #D4AF37, #FDFBF7); color: #000; font-size: 0.65rem; font-weight: bold; padding: 5px 12px; border-bottom-left-radius: 12px; border-top-right-radius: 16px; box-shadow: 0 0 10px rgba(212, 175, 55, 0.5); }
        .input-emerald { width: 100%; padding: 16px; margin-bottom: 15px; background: rgba(0,0,0,0.5); border: 1px solid rgba(229, 208, 143, 0.4); border-radius: 8px; color: #FDFBF7; font-family: "Montserrat", sans-serif; font-size: 1rem; outline: none; transition: 0.3s; }
        .btn-champagne { width: 100%; padding: 18px; background: linear-gradient(145deg, #E5D08F, #C7A951); color: #06140F; font-weight: 600; border: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; cursor: pointer; }
        .btn-outline { width: 100%; padding: 18px; background: rgba(0,0,0,0.5); color: #E5D08F; border: 1px solid #E5D08F; border-radius: 8px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; cursor: pointer; display: block; text-align: center; }
        .carousel-container { display: flex; overflow-x: auto; gap: 15px; padding-bottom: 10px; scroll-snap-type: x mandatory; scrollbar-width: none; }
        .carousel-container::-webkit-scrollbar { display: none; }
        .carousel-img { width: 220px; height: 280px; flex-shrink: 0; border-radius: 12px; background-size: cover; background-position: center; scroll-snap-align: center; border: 2px solid rgba(229, 208, 143, 0.3); }
      `}</style>
      
      {activities.length > 0 && (
        <div className="ticker-wrap">
          <div className="ticker-move">
            {activities.map((act, i) => <span key={i} className="ticker-item">{act} &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp;</span>)}
          </div>
        </div>
      )}
      
      <div style={{ padding: '20px' }}>
        {step > 0 && step < 6 && (
          <div style={{ textAlign: 'center', marginBottom: '20px', paddingTop: '10px' }}>
            <p style={{ color: '#E5D08F', letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>The M&apos;K26 Gala</p>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FDFBF7', fontSize: '2.2rem', margin: 0 }}>Table {tableNumber}</h1>
          </div>
        )}
        
        <div className="glass-panel">
          
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '1.8rem', margin: '0 0 20px 0', textAlign: 'center' }}>The Royal Main Course</h2>
              {loadingMenu ? <p style={{ textAlign: 'center', color: '#E5D08F' }}>Curating Menu...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  {meals.map(meal => (
                    <div key={meal.id} className="premium-card" onClick={() => handleFoodSelection(meal.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', padding: '12px', borderRadius: '12px', border: '1px solid rgba(229,208,143,0.2)', backgroundColor: 'rgba(255,255,255,0.03)', transition: '0.2s', margin: 0 }}>
                      <div className="card-img" style={{ backgroundImage: `url(${meal.imageUrl || 'https://via.placeholder.com/100'})`, width: '100%', height: '100px', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '10px' }} />
                      <h4 style={{ margin: '0 0 5px 0', color: '#FDFBF7', fontSize: '0.95rem', fontWeight: '500' }}>{meal.name}</h4>
                      <p style={{ margin: 0, color: '#E5D08F', fontSize: '0.7rem', textTransform: 'uppercase' }}>Tap to Select</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '4rem', display: 'block', marginBottom: '15px' }}>🥗</span>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2rem', margin: '0 0 15px 0' }}>Add a Side?</h2>
              <p style={{ color: '#FDFBF7', fontSize: '1.1rem', marginBottom: '35px', lineHeight: '1.5' }}>Would you like to add Coleslaw or Side Salad to your Rice dish?</p>
              <button onClick={() => { setForm({...form, withSalad: true}); setStep(3); }} className="btn-champagne" style={{ marginBottom: '15px' }}>Yes, Add Salad</button>
              <button onClick={() => { setForm({...form, withSalad: false}); setStep(3); }} className="btn-outline">No, Thank You</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '1.8rem', margin: '0 0 20px 0', textAlign: 'center' }}>Royal Beverages</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                {drinks.map(drink => {
                  const isRecommended = drink.name.toLowerCase().includes('zobo');
                  return (
                    <div key={drink.id} className="premium-card" onClick={() => { setForm({...form, drinkName: drink.name}); setStep(4); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', padding: '12px', borderRadius: '12px', border: '1px solid rgba(229,208,143,0.2)', backgroundColor: 'rgba(255,255,255,0.03)', transition: '0.2s', position: 'relative', margin: 0 }}>
                      {isRecommended && <div className="glow-badge" style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.7rem' }}>✨ Chef&apos;s Pairing</div>}
                      <div className="card-img" style={{ backgroundImage: `url(${drink.imageUrl || 'https://via.placeholder.com/100'})`, width: '100%', height: '100px', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginBottom: '10px' }} />
                      <h4 style={{ margin: '0 0 5px 0', color: '#FDFBF7', fontSize: '0.95rem', fontWeight: '500' }}>{drink.name}</h4>
                      <p style={{ margin: 0, color: '#E5D08F', fontSize: '0.7rem', textTransform: 'uppercase' }}>Tap to Select</p>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#aaa', width: '100%', padding: '15px', marginTop: '10px', textDecoration: 'underline' }}>← Restart Selection</button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '2rem', margin: '0 0 5px 0', textAlign: 'center' }}>Final Details</h2>
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.85rem', marginBottom: '30px' }}>So our Royal Waiters can address you properly.</p>
              <form onSubmit={submitRoyalOrder}>
                <input type="text" placeholder="Your Full Name *" className="input-emerald" value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} required />
                <input type="text" placeholder="Ticket ID / VIP Code (Optional)" className="input-emerald" value={form.ticketId} onChange={e => setForm({...form, ticketId: e.target.value})} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', background: 'rgba(229, 208, 143, 0.1)', borderRadius: '12px', border: '1px solid rgba(229, 208, 143, 0.4)', marginBottom: '30px' }}>
                  <input type="checkbox" checked={form.souvenirNudge} onChange={e => setForm({...form, souvenirNudge: e.target.checked})} style={{ width: '25px', height: '25px', accentColor: '#D4AF37' }} />
                  <span style={{ color: '#FDFBF7', fontSize: '0.9rem', lineHeight: '1.4' }}>Request event souvenir/gift package with this delivery?</span>
                </label>
                <button type="submit" className="btn-champagne">Place Royal Order</button>
              </form>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.6)', padding: '25px', borderRadius: '16px', marginBottom: '25px', border: '1px solid rgba(229, 208, 143, 0.3)' }}>
                <p style={{ color: '#E5D08F', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 10px 0' }}>Order Status</p>
                <h2 style={{ color: trackingStatus === 'On the Way' ? '#10b981' : '#E5D08F', margin: '0 0 10px 0', fontSize: '2.2rem', fontFamily: '"Cormorant Garamond", serif', transition: 'color 0.5s' }}>{trackingStatus}</h2>
                <p style={{ color: '#FDFBF7', fontSize: '0.9rem', margin: 0 }}>
                  {trackingStatus === 'SENT' || trackingStatus === 'Pending' ? "Your order is in the kitchen queue." : ""}
                  {trackingStatus === 'Preparing' ? "The Chef is prioritizing your meal." : ""}
                  {trackingStatus === 'Ready' ? "Awaiting a Royal Waiter to claim your tray." : ""}
                  {trackingStatus === 'On the Way' ? "Look up! Your food is approaching. ✨" : ""}
                </p>
              </div>

              {(trackingStatus === 'SENT' || trackingStatus === 'Pending') && (
                <button onClick={cancelOrder} style={{ width: '100%', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', marginBottom: '20px' }}>Cancel Order</button>
              )}

              <button onClick={() => alert("🛎️ VIP Bell Rung! The Kitchen has been notified.")} className="btn-outline" style={{ marginBottom: '40px' }}><span style={{ fontSize: '1.3rem', marginRight: '8px' }}>🛎️</span> Ring VIP Service Bell</button>

              <div style={{ textAlign: 'left', borderTop: '1px solid rgba(229, 208, 143, 0.2)', paddingTop: '30px', marginBottom: '40px' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FDFBF7', fontSize: '1.8rem', margin: '0 0 20px 0', fontStyle: 'italic' }}>The Moment Before Wedding...</h3>
                <div className="carousel-container">
                  {throwbackImages.map((src, i) => <div key={i} className="carousel-img" style={{ backgroundImage: `url(${src})` }} />)}
                </div>
              </div>

              {trackingStatus === 'On the Way' && (
                <button onClick={confirmDelivery} className="btn-champagne" style={{ animation: 'floatUp 0.5s ease-out' }}>I Received My Order ✓</button>
              )}
            </div>
          )}

          {step === 6 && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🎉</span>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#10b981', fontSize: '2rem', margin: '0 0 25px 0' }}>Enjoy Your Meal!</h2>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(229, 208, 143, 0.3)', marginBottom: '30px' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '1.5rem', margin: '0 0 15px 0' }}>The Blessing Vault</h3>
                <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '20px' }}>Leave a heartfelt wish for Muhammed & Kaothar. It will be saved forever.</p>
                
                <textarea placeholder="Write your prayer or wish here..." value={blessing} onChange={e => setBlessing(e.target.value)} className="input-emerald" style={{ minHeight: '100px', resize: 'none' }}></textarea>
                
                {!selfieUrl ? (
                  <label className="btn-outline" style={{ cursor: 'pointer', marginBottom: '15px' }}>
                    📸 Tap to Add a Photo
                    {/* 🔥 CAMERA FIX: Removed capture="user" to prevent Android from aggressively killing Chrome */}
                    <input type="file" accept="image/*" onChange={handleSelfieCapture} style={{ display: 'none' }} />
                  </label>
                ) : (
                  <div style={{ width: '100px', height: '100px', margin: '0 auto 20px', borderRadius: '50%', backgroundImage: `url(${selfieUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '3px solid #E5D08F' }} />
                )}
              </div>

              {blessing && (
                <button onClick={shareToWhatsApp} className="btn-champagne" style={{ background: '#25D366', color: '#fff', marginBottom: '15px' }}>
                  Share Blessing to WhatsApp 💚
                </button>
              )}

              {/* 🔥 HOME & RESET BUTTONS */}
              <button onClick={goHome} className="btn-champagne" style={{ background: 'transparent', color: '#E5D08F', border: '1px solid #E5D08F', marginBottom: '15px' }}>
                Return to Homepage 🏠
              </button>

              <button onClick={resetFlow} style={{ background: 'none', border: 'none', color: '#aaa', textDecoration: 'underline', padding: '15px', cursor: 'pointer' }}>
                Order for someone else? (Start Over)
              </button>

              <div style={{ position: 'absolute', left: '-9999px' }}>
                <div id="viral-card" style={{ width: '400px', padding: '40px', background: '#06140F', border: '4px solid #E5D08F', textAlign: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'url("https://res.cloudinary.com/din74ljlu/image/upload/v1779080657/SAVE_20260518_242659_ftuf3e.jpg")', backgroundSize: 'cover' }} />
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <p style={{ color: '#E5D08F', fontFamily: '"Montserrat", sans-serif', fontSize: '1rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}>VIP Blessing</p>
                    {selfieUrl && <div style={{ width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '50%', backgroundImage: `url(${selfieUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '4px solid #E5D08F' }} />}
                    <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FDFBF7', fontSize: '2.5rem', margin: '0 0 20px 0' }}>{form.guestName || "VIP Guest"}</h2>
                    <p style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5D08F', fontSize: '1.8rem', fontStyle: 'italic', lineHeight: '1.5', padding: '0 20px' }}>&quot;{blessing}&quot;</p>
                    <div style={{ borderTop: '2px solid rgba(229, 208, 143, 0.4)', marginTop: '30px', paddingTop: '20px' }}>
                      <p style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>The M&apos;K26 Gala</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function GuestMenuPage() {
  return <Suspense fallback={<div className="page-shell menu-page">Loading...</div>}><MenuContent /></Suspense>;
}

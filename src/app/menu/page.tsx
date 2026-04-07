'use client';
import { useState, useEffect } from 'react';

const MENU_ITEMS = [
  { id: 'm1', name: 'Pounded Yam + Egusi', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=300&q=80' },
  { id: 'r1', name: 'Party Jollof Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80' },
  { id: 'd1', name: 'Chilled Coca-Cola', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' }
];

export default function MenuPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  
  const [wizardStep, setWizardStep] = useState(1); 
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showSaladModal, setShowSaladModal] = useState(false);
  const [includeSalad, setIncludeSalad] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>(["✨ Welcome to O'K26!"]);

  // VIP CONCIERGE & SOUVENIR STATES
  const [showConcierge, setShowConcierge] = useState(false);
  const [blessingText, setBlessingText] = useState('');
  const [showSouvenir, setShowSouvenir] = useState(false);

  const heroImages = ['/images/hero1.jpg', '/images/hero2.jpg', '/images/hero3.jpg'];
  const galleryImages = ['/images/hero1.jpg', '/images/hero2.jpg', '/images/hero3.jpg'];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    setTableNumber(new URLSearchParams(window.location.search).get('table'));
    const timer = setTimeout(() => setShowSplash(false), 1500);
    const heroTimer = setInterval(() => setCurrentHero(prev => (prev + 1) % heroImages.length), 4000);
    return () => { clearTimeout(timer); clearInterval(heroTimer); };
  }, []);

  useEffect(() => {
    if (showSplash) return;
    const fetchUpdates = async () => {
      try {
        const res = await fetch('/api/orders');
        const orders = await res.json();
        if (orders.length > 0) {
          const activities = orders.slice(0, 5).map((o: any) => {
            const fName = o.guestName ? o.guestName.split(' ')[0].toUpperCase() : 'A GUEST';
            if (o.status === 'DELIVERED') return `[ O'K26 ] ${fName} at Table ${o.tableNumber} received their meal!`;
            if (o.status === 'DISPATCHED') return `[ O'K26 ] ${fName}'s order is arriving at Table ${o.tableNumber}!`;
            return `[ O'K26 ] ${fName} at Table ${o.tableNumber} just placed an order.`;
          });
          setRecentActivity(activities);
        }
        if (orderId && orderStatus !== 'DELIVERED') {
          const myOrder = orders.find((o: any) => o.id === orderId);
          if (myOrder && myOrder.status !== orderStatus) setOrderStatus(myOrder.status);
        }
      } catch (err) {}
    };
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 8000);
    return () => clearInterval(interval);
  }, [orderId, orderStatus, showSplash]);

  const handleMealSelect = (item: any) => {
    setSelectedMeal(item.id);
    if (item.category === 'Rice') setShowSaladModal(true);
    else setTimeout(() => setWizardStep(2), 400);
  };

  const handleSaladChoice = (choice: boolean) => {
    setIncludeSalad(choice);
    setShowSaladModal(false);
    setTimeout(() => setWizardStep(2), 400);
  };

  const handleDrinkSelect = (id: string) => {
    setSelectedDrink(id);
    setTimeout(() => setWizardStep(3), 400);
  };

  const handleConfirmOrder = async () => {
    if (!guestName.trim()) return alert("Please enter your name!");
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, guestName, mealName: MENU_ITEMS.find(i => i.id === selectedMeal)?.name || 'None', drinkName: MENU_ITEMS.find(i => i.id === selectedDrink)?.name || 'None', withSalad: includeSalad })
      });
      const data = await res.json();
      if (data.success) { setOrderId(data.orderId); setOrderStatus('SENT'); setWizardStep(4); }
    } catch (e) {}
    setIsSubmitting(false);
  };

  const handleMarkDelivered = async () => {
    try {
      await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status: 'DELIVERED' }) });
      setOrderStatus('DELIVERED'); setWizardStep(5);
    } catch (e) {}
  };

  // VIP CONCIERGE CALL
  const callConcierge = async (type: string) => {
    try {
      await fetch('/api/concierge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, guestName, requestType: type })
      });
      alert(`VIP Request sent! Our waiter is bringing ${type.toLowerCase()} to Table ${tableNumber}.`);
      setShowConcierge(false);
    } catch (e) { alert("Failed to connect to concierge."); }
  };

  if (showSplash) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#4A0E1B', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '4rem', color: '#D4AF37', letterSpacing: '4px', animation: 'pulse 1.5s ease-in-out' }}>O'K26</h1>
        <style>{`@keyframes pulse { 0% { opacity: 0; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    );
  }

  if (!tableNumber) return <div style={{ backgroundColor: '#4A0E1B', minHeight: '100vh', color: '#D4AF37', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Missing Table Code.</div>;

  return (
    <div style={{ backgroundColor: '#4A0E1B', minHeight: '100vh', color: '#fff', paddingBottom: '100px', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@400;600&display=swap');
        @keyframes slowScroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-150%); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .lux-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; }
        .lux-card.selected { border-color: #D4AF37; background: rgba(212, 175, 55, 0.15); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2); }
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* TICKER */}
      {wizardStep >= 4 && (
        <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'inline-block', animation: 'slowScroll 40s linear infinite', color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '1px' }}>
            {recentActivity.join('   ✦   ')}   ✦   {recentActivity.join('   ✦   ')}
          </div>
        </div>
      )}

      {/* HERO SLIDER */}
      {wizardStep < 4 && (
        <div style={{ width: '100%', height: '250px', position: 'relative', overflow: 'hidden', borderBottom: '2px solid #D4AF37' }}>
          {heroImages.map((img, idx) => (
            <div key={idx} style={{ position: 'absolute', inset: 0, opacity: currentHero === idx ? 1 : 0, transition: 'opacity 1.5s ease-in-out', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#3a0913' }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(74,14,27,0) 0%, rgba(74,14,27,1) 100%)' }} />
        </div>
      )}

      <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto', marginTop: wizardStep < 4 ? '-60px' : '0', position: 'relative', zIndex: 10 }}>
        
        {wizardStep < 4 && (
          <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'slideUp 0.6s' }}>
            <p style={{ fontSize: '0.75rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '10px' }}>Table {tableNumber}</p>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#fff', fontSize: '2.2rem', lineHeight: '1.2', marginBottom: '15px' }}>
              Welcome to the Wedding Reception of<br/><span style={{ color: '#D4AF37', fontSize: '2.4rem' }}>Olowojare & Kaothar</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: '1.6', opacity: 0.9 }}>
              Experience seamless dining. Simply select your meal below, and our waiters will deliver it to your table within 5 minutes—no waving, no waiting.
            </p>
          </div>
        )}

        {/* --- STEP 1: FOOD --- */}
        {wizardStep === 1 && (
          <div style={{ animation: 'slideUp 0.5s', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {MENU_ITEMS.filter(i => i.category === 'Swallows' || i.category === 'Rice').map((item) => (
              <div key={item.id} onClick={() => handleMealSelect(item)} className={`lux-card ${selectedMeal === item.id ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
                <div style={{ margin: '0 15px', width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedMeal === item.id ? '#D4AF37' : 'rgba(255,255,255,0.3)'}`, backgroundColor: selectedMeal === item.id ? '#D4AF37' : 'transparent' }}></div>
                <div style={{ flex: 1 }}><span style={{ fontWeight: '600', fontSize: '1rem' }}>{item.name}</span></div>
              </div>
            ))}
          </div>
        )}

        {/* --- SALAD MODAL --- */}
        {showSaladModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#4A0E1B', border: '1px solid #D4AF37', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'slideUp 0.3s' }}>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '1.8rem', marginBottom: '15px' }}>Add a side?</h3>
              <p style={{ color: '#fff', marginBottom: '25px', fontSize: '0.9rem' }}>Would you like Coleslaw or Salad included with your rice?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => handleSaladChoice(true)} style={{ padding: '15px', backgroundColor: '#D4AF37', color: '#4A0E1B', fontWeight: 'bold', borderRadius: '8px', border: 'none' }}>Yes, include Salad</button>
                <button onClick={() => handleSaladChoice(false)} style={{ padding: '15px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}>No, just Rice</button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: DRINK --- */}
        {wizardStep === 2 && (
          <div style={{ animation: 'slideUp 0.5s' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center' }}>Select a Drink</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div onClick={() => handleDrinkSelect('none')} className="lux-card" style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                <div style={{ margin: '0 15px', width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }}></div>
                <span style={{ fontWeight: '600' }}>Just Food, No Drink</span>
              </div>
              {MENU_ITEMS.filter(i => i.category === 'Drinks').map((item) => (
                <div key={item.id} onClick={() => handleDrinkSelect(item.id)} className={`lux-card ${selectedDrink === item.id ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
                  <div style={{ margin: '0 15px', width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedDrink === item.id ? '#D4AF37' : 'rgba(255,255,255,0.3)'}`, backgroundColor: selectedDrink === item.id ? '#D4AF37' : 'transparent' }}></div>
                  <div style={{ flex: 1 }}><span style={{ fontWeight: '600' }}>{item.name}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- STEP 3: IDENTITY --- */}
        {wizardStep === 3 && (
          <div style={{ animation: 'slideUp 0.5s', textAlign: 'center' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '1.8rem', marginBottom: '10px' }}>Final Step</h3>
            <p style={{ color: '#e5e7eb', fontSize: '0.9rem', marginBottom: '25px' }}>Who are we serving at Table {tableNumber}?</p>
            <input type="text" placeholder="Your First Name (e.g. Ahmed)" value={guestName} onChange={e => setGuestName(e.target.value)} style={{ width: '100%', padding: '18px', marginBottom: '20px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid #D4AF37', color: '#fff', fontSize: '1rem', outline: 'none' }} />
            <button onClick={handleConfirmOrder} disabled={isSubmitting} style={{ width: '100%', padding: '18px', backgroundColor: '#D4AF37', color: '#4A0E1B', fontWeight: 'bold', fontSize: '1.1rem', borderRadius: '8px', border: 'none', textTransform: 'uppercase' }}>
              {isSubmitting ? 'Sending to Kitchen...' : 'Place Order'}
            </button>
          </div>
        )}

        {/* --- STEP 4: TRACKING & PRE-WEDDING GALLERY --- */}
        {wizardStep === 4 && (
          <div style={{ animation: 'slideUp 0.5s', textAlign: 'center', padding: '20px 0' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '2.2rem', marginBottom: '30px' }}>Tracking Order</h2>
            
            <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto', textAlign: 'left', paddingLeft: '40px' }}>
              <div style={{ position: 'absolute', left: '14px', top: '20px', bottom: '20px', width: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ position: 'absolute', left: '14px', top: '20px', height: orderStatus === 'SENT' ? '0%' : orderStatus === 'PLATING' ? '50%' : '100%', width: '2px', backgroundColor: '#D4AF37', transition: 'height 0.5s ease' }}></div>
              <div style={{ position: 'relative', paddingBottom: '40px' }}><div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#D4AF37', boxShadow: '0 0 10px #D4AF37' }}></div><h4 style={{ margin: 0 }}>Ticket Sent</h4></div>
              <div style={{ position: 'relative', paddingBottom: '40px', opacity: orderStatus === 'SENT' ? 0.4 : 1 }}><div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: orderStatus === 'SENT' ? 'rgba(255,255,255,0.2)' : '#D4AF37' }}></div><h4 style={{ margin: 0 }}>Chef is Plating</h4></div>
              <div style={{ position: 'relative', opacity: orderStatus === 'DISPATCHED' ? 1 : 0.4 }}><div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: orderStatus === 'DISPATCHED' ? '#D4AF37' : 'rgba(255,255,255,0.2)' }}></div><h4 style={{ margin: 0 }}>On the Way!</h4></div>
            </div>

            {orderStatus === 'DISPATCHED' ? (
              <div style={{ marginTop: '20px', animation: 'slideUp 0.5s' }}>
                <button onClick={handleMarkDelivered} style={{ width: '100%', padding: '20px', backgroundColor: '#D4AF37', color: '#4A0E1B', fontWeight: 'bold', fontSize: '1.1rem', borderRadius: '8px', border: 'none', boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)', textTransform: 'uppercase' }}>Confirm Received</button>
              </div>
            ) : (
              <div style={{ marginTop: '40px', animation: 'slideUp 0.5s 0.3s both' }}>
                <p style={{ color: '#D4AF37', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '10px' }}>✨ Moments Before Forever...</p>
                <div className="hide-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px' }}>
                  {galleryImages.map((img, i) => (
                    <div key={i} style={{ minWidth: '200px', height: '250px', borderRadius: '12px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(212,175,55,0.3)' }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- STEP 5: SUCCESS & ROYAL REGISTRY --- */}
        {wizardStep === 5 && (
          <div style={{ animation: 'slideUp 0.6s', textAlign: 'center', paddingTop: '20px' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3.5rem', color: '#D4AF37', margin: '0 0 10px 0' }}>O'K26</h1>
            <h2 style={{ fontFamily: '"Montserrat", sans-serif', color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>Order Delivered!</h2>
            <p style={{ color: '#e5e7eb', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '30px' }}>Enjoy your meal, {guestName}. Thank you for celebrating with us.</p>
            
            {/* SOUVENIR GENERATOR */}
            {!showSouvenir ? (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', marginBottom: '30px' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '1.5rem', marginBottom: '10px' }}>The Royal Registry</h3>
                <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '15px' }}>Leave a digital blessing for the couple and get your personalized WhatsApp Souvenir.</p>
                <textarea value={blessingText} onChange={(e) => setBlessingText(e.target.value)} placeholder="Wishing you a happy married life..." style={{ width: '100%', padding: '15px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', outline: 'none', height: '80px', marginBottom: '15px' }} />
                <button onClick={() => setShowSouvenir(true)} style={{ width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#4A0E1B', fontWeight: 'bold', borderRadius: '8px', border: 'none' }}>Generate Digital Souvenir</button>
              </div>
            ) : (
              <div style={{ animation: 'slideUp 0.5s', marginBottom: '30px' }}>
                <div style={{ position: 'relative', width: '100%', padding: '30px', borderRadius: '12px', backgroundImage: 'url(/images/hero1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(74,14,27,0.85)', borderRadius: '10px' }}></div>
                  <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '2rem', margin: '0 0 10px 0' }}>O'K26</h2>
                    <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '20px' }}>"{blessingText || 'Wishing you endless joy and love!'}"</p>
                    <p style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>— {guestName} (Table {tableNumber})</p>
                  </div>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '15px' }}>📸 Take a screenshot to share on your WhatsApp Status!</p>
              </div>
            )}

            <button onClick={() => { setWizardStep(1); setSelectedMeal(null); setSelectedDrink(null); setOrderId(null); setOrderStatus(null); }} style={{ padding: '15px 30px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}>Order Something Else</button>
          </div>
        )}

      </div>

      {/* --- VIP CONCIERGE BELL (Only visible in Step 5 after delivery) --- */}
      {wizardStep === 5 && (
        <>
          <button onClick={() => setShowConcierge(true)} style={{ position: 'fixed', bottom: '80px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#D4AF37', color: '#4A0E1B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: 'none', boxShadow: '0 5px 20px rgba(212,175,55,0.5)', zIndex: 50, animation: 'pulse 2s infinite' }}>🔔</button>
          
          {showConcierge && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ backgroundColor: '#4A0E1B', border: '1px solid #D4AF37', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'slideUp 0.3s' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '1.8rem', marginBottom: '10px' }}>VIP Concierge</h3>
                <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '0.9rem' }}>Silent service. What can we bring to Table {tableNumber}?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={() => callConcierge('BOTTLED WATER')} style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #D4AF37', borderRadius: '8px' }}>🧊 Bottled Water</button>
                  <button onClick={() => callConcierge('FRESH CUTLERY')} style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #D4AF37', borderRadius: '8px' }}>🍽️ Fresh Cutlery / Napkins</button>
                  <button onClick={() => callConcierge('CLEAR TABLE')} style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #D4AF37', borderRadius: '8px' }}>🧹 Clear My Table</button>
                </div>
                <button onClick={() => setShowConcierge(false)} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'transparent', color: '#aaa', border: 'none' }}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- DEVELOPER FOOTER --- */}
      <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Seamlessly Engineered by <br/><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Jare's Choice Labs</span>
        </p>
      </div>

    </div>
  );
}

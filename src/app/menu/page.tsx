'use client';
import { useState, useEffect } from 'react';

const MENU_ITEMS = [
  { id: 'm1', name: 'Pounded Yam + Egusi', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=300&q=80' },
  { id: 'm2', name: 'Amala + Ewedu', category: 'Swallows', img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=300&q=80' },
  { id: 'r1', name: 'Party Jollof Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80' },
  { id: 'r2', name: 'Fried Rice + Chicken', category: 'Rice', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80' },
  { id: 'd1', name: 'Chilled Coca-Cola', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' },
  { id: 'd2', name: 'Pulpy Orange', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' },
  { id: 'd3', name: 'Premium Red Wine', category: 'Wine', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=300&q=80' }
];

export default function MenuPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  
  // WIZARD STATES
  const [wizardStep, setWizardStep] = useState(1); // 1:Food, 2:Drink, 3:Identity, 4:Tracker, 5:Success
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  
  // TRACKING & TICKER STATES
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>([
    "✨ Welcome to the O'K26 Celebration!",
    "🔥 Kitchen is actively preparing orders..."
  ]);

  useEffect(() => {
    setTableNumber(new URLSearchParams(window.location.search).get('table'));
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // TICKER & TRACKER POLLING
  useEffect(() => {
    if (showSplash) return;
    const fetchUpdates = async () => {
      try {
        const res = await fetch('/api/orders');
        const orders = await res.json();
        
        if (orders.length > 0) {
          const activities = orders.slice(0, 5).map((o: any) => {
            const fName = o.guestName ? o.guestName.split(' ')[0].toUpperCase() : 'A GUEST';
            if (o.status === 'DELIVERED') return `[ O'K26 ] ${fName} at Table ${o.tableNumber} just received their meal!`;
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

  // LIQUID UI: Auto-Advance Logic
  const handleMealSelect = (id: string) => {
    setSelectedMeal(id);
    setTimeout(() => setWizardStep(2), 400); // Smooth 0.4s auto-advance
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
        body: JSON.stringify({ 
          tableNumber, guestName, 
          mealName: MENU_ITEMS.find(i => i.id === selectedMeal)?.name || 'None', 
          drinkName: MENU_ITEMS.find(i => i.id === selectedDrink)?.name || 'None', 
          withSalad: false 
        })
      });
      const data = await res.json();
      if (data.success) { setOrderId(data.orderId); setOrderStatus('SENT'); setWizardStep(4); }
    } catch (e) { alert("Error sending order."); }
    setIsSubmitting(false);
  };

  const handleMarkDelivered = async () => {
    try {
      await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status: 'DELIVERED' }) });
      setOrderStatus('DELIVERED');
      setWizardStep(5);
    } catch (e) {}
  };

  // --- LUXURY SPLASH SCREEN ---
  if (showSplash) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#4A0E1B', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '4rem', color: '#D4AF37', letterSpacing: '4px', animation: 'pulse 1.5s ease-in-out' }}>O'K26</h1>
        <style>{`@keyframes pulse { 0% { opacity: 0; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    );
  }

  if (!tableNumber) return <div style={{ backgroundColor: '#4A0E1B', minHeight: '100vh', color: '#D4AF37', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Montserrat", sans-serif' }}>Missing Table Code. Please scan the QR code on your table.</div>;

  return (
    <div style={{ backgroundColor: '#4A0E1B', minHeight: '100vh', color: '#fff', paddingBottom: '100px', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif' }}>
      
      {/* CSS FOR KEN BURNS & LUXURY STYLING */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@400;600&display=swap');
        @keyframes slowScroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-150%); } }
        @keyframes kenBurns { 0% { transform: scale(1) translateX(0); } 100% { transform: scale(1.15) translateX(-5px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .lux-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; overflow: hidden; transition: all 0.3s ease; }
        .lux-card.selected { border-color: #D4AF37; background: rgba(212, 175, 55, 0.1); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2); }
        .lux-img { width: 80px; height: 80px; overflow: hidden; border-radius: 8px; }
        .lux-img img { width: 100%; height: 100%; object-fit: cover; animation: kenBurns 15s infinite alternate ease-in-out; }
      `}</style>

      {/* LUXURY TICKER */}
      <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'slowScroll 40s linear infinite', color: '#D4AF37', fontFamily: '"Montserrat", sans-serif', fontSize: '0.8rem', letterSpacing: '1px' }}>
          {recentActivity.join('   ✦   ')}   ✦   {recentActivity.join('   ✦   ')}
        </div>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* DYNAMIC HEADER */}
        {wizardStep < 5 && (
          <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'slideUp 0.6s' }}>
            <p style={{ fontSize: '0.75rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '10px' }}>Table {tableNumber}</p>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#fff', fontSize: '2rem', lineHeight: '1.2', marginBottom: '15px' }}>
              Welcome to the Wedding Reception of<br/>
              <span style={{ color: '#D4AF37', fontSize: '2.2rem' }}>Olowojare & Kaothar</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: '1.6', opacity: 0.9 }}>
              Experience seamless dining. Simply select your meal below, and our waiters will deliver it to your table within 5 minutes—no waving, no waiting.
            </p>
          </div>
        )}

        {/* --- WIZARD STEP 1: FOOD --- */}
        {wizardStep === 1 && (
          <div style={{ animation: 'slideUp 0.5s' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {MENU_ITEMS.filter(i => i.category === 'Swallows' || i.category === 'Rice').map((item) => (
                <label key={item.id} className={`lux-card ${selectedMeal === item.id ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', padding: '12px', cursor: 'pointer' }}>
                  <input type="radio" name="meal" checked={selectedMeal === item.id} onChange={() => handleMealSelect(item.id)} style={{ margin: '0 15px', accentColor: '#D4AF37', transform: 'scale(1.2)' }}/>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: '600', fontFamily: '"Montserrat", sans-serif', fontSize: '0.95rem' }}>{item.name}</span>
                  </div>
                  <div className="lux-img"><img src={item.img} alt={item.name} /></div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* --- WIZARD STEP 2: DRINK --- */}
        {wizardStep === 2 && (
          <div style={{ animation: 'slideUp 0.5s' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center' }}>Select a Drink</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label className="lux-card" style={{ display: 'flex', alignItems: 'center', padding: '20px', cursor: 'pointer' }}>
                <input type="radio" name="drink" onChange={() => handleDrinkSelect('none')} style={{ margin: '0 15px', accentColor: '#D4AF37', transform: 'scale(1.2)' }}/>
                <span style={{ fontWeight: '600' }}>Just Food, No Drink</span>
              </label>
              {MENU_ITEMS.filter(i => i.category === 'Drinks' || i.category === 'Wine').map((item) => (
                <label key={item.id} className={`lux-card ${selectedDrink === item.id ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', padding: '12px', cursor: 'pointer' }}>
                  <input type="radio" name="drink" checked={selectedDrink === item.id} onChange={() => handleDrinkSelect(item.id)} style={{ margin: '0 15px', accentColor: '#D4AF37', transform: 'scale(1.2)' }}/>
                  <div style={{ flex: 1 }}><span style={{ fontWeight: '600' }}>{item.name}</span></div>
                  <div className="lux-img"><img src={item.img} alt={item.name} /></div>
                </label>
              ))}
            </div>
            <button onClick={() => setWizardStep(1)} style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}>Back to Meals</button>
          </div>
        )}

        {/* --- WIZARD STEP 3: IDENTITY --- */}
        {wizardStep === 3 && (
          <div style={{ animation: 'slideUp 0.5s', textAlign: 'center' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '1.8rem', marginBottom: '10px' }}>Final Step</h3>
            <p style={{ color: '#e5e7eb', fontSize: '0.9rem', marginBottom: '25px' }}>Who are we serving at Table {tableNumber}?</p>
            
            <input type="text" placeholder="Your First Name (e.g. Ahmed)" value={guestName} onChange={e => setGuestName(e.target.value)} style={{ width: '100%', padding: '18px', marginBottom: '20px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid #D4AF37', color: '#fff', fontSize: '1rem', fontFamily: '"Montserrat", sans-serif', outline: 'none' }} />
            
            <button onClick={handleConfirmOrder} disabled={isSubmitting} style={{ width: '100%', padding: '18px', backgroundColor: '#D4AF37', color: '#4A0E1B', fontWeight: 'bold', fontSize: '1.1rem', borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isSubmitting ? 'Sending to Kitchen...' : 'Place Order'}
            </button>
            <button onClick={() => setWizardStep(2)} style={{ width: '100%', padding: '15px', marginTop: '15px', backgroundColor: 'transparent', color: '#fff', border: 'none' }}>Go Back</button>
          </div>
        )}

        {/* --- WIZARD STEP 4: TRACKING CHAIN --- */}
        {wizardStep === 4 && (
          <div style={{ animation: 'slideUp 0.5s', textAlign: 'center', padding: '20px 0' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '2.2rem', marginBottom: '30px' }}>Tracking Order</h2>
            
            {/* THE TIGHT TRACKING CHAIN */}
            <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto', textAlign: 'left', paddingLeft: '40px' }}>
              <div style={{ position: 'absolute', left: '14px', top: '20px', bottom: '20px', width: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ position: 'absolute', left: '14px', top: '20px', height: orderStatus === 'SENT' ? '0%' : orderStatus === 'PLATING' ? '50%' : '100%', width: '2px', backgroundColor: '#D4AF37', transition: 'height 0.5s ease' }}></div>

              <div style={{ position: 'relative', paddingBottom: '40px' }}>
                <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#D4AF37', boxShadow: '0 0 10px #D4AF37' }}></div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>Ticket Sent</h4>
                <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Kitchen received your request.</p>
              </div>

              <div style={{ position: 'relative', paddingBottom: '40px', opacity: orderStatus === 'SENT' ? 0.4 : 1 }}>
                <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: orderStatus === 'SENT' ? 'rgba(255,255,255,0.2)' : '#D4AF37', boxShadow: orderStatus !== 'SENT' ? '0 0 10px #D4AF37' : 'none' }}></div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>Chef is Plating</h4>
                <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Freshly preparing your meal.</p>
              </div>

              <div style={{ position: 'relative', opacity: orderStatus === 'DISPATCHED' ? 1 : 0.4 }}>
                <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: orderStatus === 'DISPATCHED' ? '#D4AF37' : 'rgba(255,255,255,0.2)', boxShadow: orderStatus === 'DISPATCHED' ? '0 0 10px #D4AF37' : 'none' }}></div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>On the Way!</h4>
                <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Waiter is heading to Table {tableNumber}.</p>
              </div>
            </div>

            {orderStatus === 'DISPATCHED' ? (
              <div style={{ marginTop: '40px', animation: 'slideUp 0.5s' }}>
                <button onClick={handleMarkDelivered} style={{ width: '100%', padding: '20px', backgroundColor: '#D4AF37', color: '#4A0E1B', fontWeight: 'bold', fontSize: '1.1rem', borderRadius: '8px', border: 'none', boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)', textTransform: 'uppercase' }}>
                  Confirm Received
                </button>
              </div>
            ) : (
              <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '40px', fontStyle: 'italic' }}>Please leave this screen open.</p>
            )}
          </div>
        )}

        {/* --- WIZARD STEP 5: SUCCESS --- */}
        {wizardStep === 5 && (
          <div style={{ animation: 'slideUp 0.6s', textAlign: 'center', paddingTop: '40px' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3.5rem', color: '#D4AF37', margin: '0 0 20px 0' }}>O'K26</h1>
            <h2 style={{ fontFamily: '"Montserrat", sans-serif', color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Order Confirmed & Delivered!</h2>
            <p style={{ color: '#e5e7eb', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '40px' }}>
              Your meal has been served, {guestName}. Sit back, enjoy the celebration, and thank you for being a part of our special day.
            </p>
            <button onClick={() => { setWizardStep(1); setSelectedMeal(null); setSelectedDrink(null); setOrderId(null); setOrderStatus(null); }} style={{ padding: '16px 30px', backgroundColor: 'transparent', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
              Order Something Else
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

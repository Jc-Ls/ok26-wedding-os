'use client';
import { useState, useEffect } from 'react';

// ADMIN NOTE: This array is perfectly structured for your future Database fetch. 
// Just replace these img paths with your Cloudinary/Upload URLs later. The grid will auto-format them.
const MENU_ITEMS = [
  { id: 'm1', name: 'Pounded Yam + Egusi', category: 'Swallows', img: '/images/hero1.jpg' },
  { id: 'm2', name: 'Pounded Yam + Efo-riro', category: 'Swallows', img: '/images/hero2.jpg' },
  { id: 'm3', name: 'Amala + Ewedu', category: 'Swallows', img: '/images/hero3.jpg' },
  { id: 'r1', name: 'Party Jollof Rice', category: 'Rice', img: '/images/hero1.jpg' },
  { id: 'r2', name: 'Fried Rice + Chicken', category: 'Rice', img: '/images/hero2.jpg' },
  { id: 'd1', name: 'Chilled Coca-Cola', category: 'Drinks', img: '/images/hero3.jpg' },
  { id: 'd2', name: 'Pepsi', category: 'Drinks', img: '/images/hero1.jpg' },
  { id: 'd3', name: '7Up', category: 'Drinks', img: '/images/hero2.jpg' },
  { id: 'd4', name: 'Bigi Apple / Cola', category: 'Drinks', img: '/images/hero3.jpg' },
  { id: 'w1', name: 'Premium Red Wine', category: 'Wine', img: '/images/hero1.jpg' }
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

  const [showConcierge, setShowConcierge] = useState(false);
  const [blessingText, setBlessingText] = useState('');
  const [showSouvenir, setShowSouvenir] = useState(false);

  const heroImages = ['/images/hero1.jpg', '/images/hero2.jpg', '/images/hero3.jpg'];
  const galleryImages = ['/images/hero1.jpg', '/images/hero2.jpg', '/images/hero3.jpg'];
  const [currentHero, setCurrentHero] = useState(0);

  // 1. INITIAL LOAD & LOCAL STORAGE CHECK (Logic Untouched)
  useEffect(() => {
    setTableNumber(new URLSearchParams(window.location.search).get('table'));
    const savedOrderId = localStorage.getItem('ok26_orderId');
    const savedStep = localStorage.getItem('ok26_step');
    
    if (savedOrderId && savedStep) {
      setOrderId(savedOrderId);
      setWizardStep(parseInt(savedStep));
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => setShowSplash(false), 2000); // Extended slightly for premium splash animation
      return () => clearTimeout(timer);
    }
    
    const heroTimer = setInterval(() => setCurrentHero(prev => (prev + 1) % heroImages.length), 4000);
    return () => clearInterval(heroTimer);
  }, [heroImages.length]);

  // 2. LIVE POLLING (Logic Untouched)
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
          if (myOrder && myOrder.status === 'CANCELLED') handleReset();
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

  // 3. PLACE ORDER & SAVE TO MEMORY
  const handleConfirmOrder = async () => {
    if (!guestName.trim()) return alert("Please enter your name!");
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, guestName, mealName: MENU_ITEMS.find(i => i.id === selectedMeal)?.name || 'None', drinkName: MENU_ITEMS.find(i => i.id === selectedDrink)?.name || 'None', withSalad: includeSalad })
      });
      const data = await res.json();
      if (data.success) { 
        setOrderId(data.orderId); 
        setOrderStatus('SENT'); 
        setWizardStep(4);
        localStorage.setItem('ok26_orderId', data.orderId);
        localStorage.setItem('ok26_step', '4');
      }
    } catch (e) {}
    setIsSubmitting(false);
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status: 'CANCELLED' }) });
      handleReset();
    } catch (e) { alert("Failed to cancel."); }
  };

  const handleMarkDelivered = async () => {
    try {
      await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status: 'DELIVERED' }) });
      setOrderStatus('DELIVERED'); 
      setWizardStep(5);
      localStorage.setItem('ok26_step', '5');
    } catch (e) {}
  };

  const handleReset = () => {
    setWizardStep(1); setSelectedMeal(null); setSelectedDrink(null); setOrderId(null); setOrderStatus(null);
    localStorage.removeItem('ok26_orderId'); localStorage.removeItem('ok26_step');
  };

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

  const shareToWhatsApp = () => {
    const text = `Celebrating the wedding of Olowojare & Kaothar! ✨🥂\n\n"${blessingText || 'Wishing you endless joy and love!'}"\n\n— ${guestName}\n\nExperience seamless event tech by Jare's Choice Labs.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // --- PREMIUM SPLASH SCREEN ---
  if (showSplash) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#050403', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '4.5rem', color: '#E5C158', letterSpacing: '8px', margin: 0, animation: 'cinematicReveal 2s forwards ease-out' }}>O'K26</h1>
        <p style={{ fontFamily: '"Montserrat", sans-serif', color: '#fff', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '15px', animation: 'fadeInUp 2s forwards ease-out 0.5s', opacity: 0 }}>The Royal Menu</p>
        <style>{`
          @keyframes cinematicReveal { 0% { opacity: 0; filter: blur(10px); transform: scale(0.9); } 100% { opacity: 1; filter: blur(0); transform: scale(1); text-shadow: 0 0 20px rgba(229,193,88,0.4); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  if (!tableNumber) return <div style={{ backgroundColor: '#050403', minHeight: '100vh', color: '#E5C158', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Montserrat", sans-serif' }}>Please scan the QR code on your table to access the menu.</div>;

  return (
    <div style={{ backgroundColor: '#050403', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@400;600&display=swap');
        @keyframes slowScroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-150%); } }
        @keyframes kenBurns { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        /* THE NEW GRID ARCHITECTURE */
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .menu-card { 
          background: rgba(26,22,18,0.7); 
          border: 1px solid rgba(229,193,88,0.2); 
          border-radius: 12px; 
          overflow: hidden; 
          transition: all 0.3s ease; 
          cursor: pointer; 
          display: flex;
          flex-direction: column;
        }
        .menu-card.selected { 
          border-color: #E5C158; 
          background: rgba(229,193,88,0.1); 
          box-shadow: 0 4px 20px rgba(229,193,88,0.15); 
        }
        
        .menu-img-wrap {
          width: 100%;
          padding-top: 85%; /* Image aspect ratio constraint for admin uploads */
          position: relative;
          overflow: hidden;
          background: #111;
          border-bottom: 1px solid rgba(229,193,88,0.1);
        }
        .menu-img-wrap img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }
        .menu-card:hover .menu-img-wrap img { transform: scale(1.05); }

        .menu-content {
          padding: 12px 10px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
        }

        .input-field { width: 100%; padding: 18px; margin-bottom: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(229,193,88,0.3); border-radius: 8px; color: #fff; font-family: "Montserrat", sans-serif; outline: none; transition: 0.3s; font-size: 1rem; }
        .input-field:focus { border-color: #E5C158; background: rgba(255,255,255,0.08); }
        .submit-btn { width: 100%; padding: 18px; background: #E5C158; color: #050403; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; font-size: 1.1rem; }
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* TICKER */}
      {wizardStep >= 4 && (
        <div style={{ backgroundColor: '#0a0806', borderBottom: '1px solid rgba(229, 193, 88, 0.2)', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'inline-block', animation: 'slowScroll 40s linear infinite', color: '#E5C158', fontSize: '0.8rem', letterSpacing: '1px' }}>
            {recentActivity.join('  ✦  ')}  ✦  {recentActivity.join('  ✦  ')}
          </div>
        </div>
      )}

      {/* SEAMLESS HERO SLIDER */}
      {wizardStep < 4 && (
        <div style={{ width: '100%', height: '280px', position: 'relative', overflow: 'hidden' }}>
          {heroImages.map((img, idx) => (
            <div key={idx} style={{ position: 'absolute', inset: 0, opacity: currentHero === idx ? 0.6 : 0, transition: 'opacity 2s ease-in-out', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: currentHero === idx ? 'kenBurns 10s forwards' : 'none' }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,4,3,0) 0%, rgba(5,4,3,1) 100%)' }} />
        </div>
      )}

      <div style={{ padding: '0 20px 40px', maxWidth: '600px', margin: '0 auto', marginTop: wizardStep < 4 ? '-120px' : '20px', position: 'relative', zIndex: 10, flex: 1, width: '100%' }}>
        
        {wizardStep < 4 && (
          <div style={{ textAlign: 'center', marginBottom: '35px', animation: 'slideUp 0.6s' }}>
            <div style={{ display: 'inline-block', padding: '5px 15px', backgroundColor: 'rgba(26,22,18,0.8)', border: '1px solid #E5C158', borderRadius: '20px', fontSize: '0.75rem', color: '#E5C158', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Table {tableNumber}</div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#fff', fontSize: '2.2rem', lineHeight: '1.2', marginBottom: '15px' }}>
              Welcome to the <br/>Royal Reception
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.6' }}>
              Simply select your meal below. Our Quickserve team will deliver it directly to your table.
            </p>
          </div>
        )}

        {/* --- STEP 1: FOOD GRID --- */}
        {wizardStep === 1 && (
          <div style={{ animation: 'slideUp 0.5s' }}>
            <h3 style={{ color: '#E5C158', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid rgba(229,193,88,0.2)', paddingBottom: '10px' }}>Main Courses</h3>
            <div className="menu-grid">
              {MENU_ITEMS.filter(i => i.category === 'Swallows' || i.category === 'Rice').map((item) => (
                <div key={item.id} onClick={() => handleMealSelect(item)} className={`menu-card ${selectedMeal === item.id ? 'selected' : ''}`}>
                  <div className="menu-img-wrap"><img src={item.img} alt={item.name} /></div>
                  <div className="menu-content">
                    <span style={{ fontWeight: '600', fontSize: '0.95rem', color: selectedMeal === item.id ? '#E5C158' : '#fff' }}>{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SALAD MODAL --- */}
        {showSaladModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,4,3,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#0a0806', border: '1px solid #E5C158', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'slideUp 0.3s' }}>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2rem', marginBottom: '15px' }}>Add a side?</h3>
              <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '0.95rem' }}>Would you like Coleslaw or Salad included with your rice?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => handleSaladChoice(true)} className="submit-btn" style={{ fontSize: '0.9rem', padding: '15px' }}>Yes, include Salad</button>
                <button onClick={() => handleSaladChoice(false)} style={{ padding: '15px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(229,193,88,0.3)', borderRadius: '8px' }}>No, just Rice</button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: DRINK GRID --- */}
        {wizardStep === 2 && (
          <div style={{ animation: 'slideUp 0.5s' }}>
            <h3 style={{ color: '#E5C158', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid rgba(229,193,88,0.2)', paddingBottom: '10px' }}>Refreshments</h3>
            
            <div onClick={() => handleDrinkSelect('none')} className={`menu-card ${selectedDrink === 'none' ? 'selected' : ''}`} style={{ marginBottom: '15px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: '600', color: selectedDrink === 'none' ? '#E5C158' : '#fff' }}>No Drink Needed</span>
            </div>

            <div className="menu-grid">
              {MENU_ITEMS.filter(i => i.category === 'Drinks' || i.category === 'Wine').map((item) => (
                <div key={item.id} onClick={() => handleDrinkSelect(item.id)} className={`menu-card ${selectedDrink === item.id ? 'selected' : ''}`}>
                  <div className="menu-img-wrap"><img src={item.img} alt={item.name} /></div>
                  <div className="menu-content">
                    <span style={{ fontWeight: '600', fontSize: '0.95rem', color: selectedDrink === item.id ? '#E5C158' : '#fff' }}>{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setWizardStep(1)} style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: 'transparent', color: '#aaa', border: 'none', letterSpacing: '1px' }}>← Back to Meals</button>
          </div>
        )}

        {/* --- STEP 3: IDENTITY --- */}
        {wizardStep === 3 && (
          <div style={{ animation: 'slideUp 0.5s', textAlign: 'center' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2.2rem', marginBottom: '10px' }}>Final Step</h3>
            <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '30px' }}>Who are we serving at Table {tableNumber}?</p>
            
            <input type="text" placeholder="Your Name (e.g. Guest Ahmed)" value={guestName} onChange={e => setGuestName(e.target.value)} className="input-field" />
            
            <button onClick={handleConfirmOrder} disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Sending to Kitchen...' : 'Place Royal Order'}
            </button>
            <button onClick={() => setWizardStep(2)} style={{ width: '100%', padding: '15px', marginTop: '15px', backgroundColor: 'transparent', color: '#aaa', border: 'none' }}>← Go Back</button>
          </div>
        )}

        {/* --- STEP 4: TRACKING --- */}
        {wizardStep === 4 && (
          <div style={{ animation: 'slideUp 0.5s', textAlign: 'center', padding: '10px 0' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2.2rem', marginBottom: '30px' }}>Order Status</h2>
            
            <div style={{ backgroundColor: 'rgba(26,22,18,0.7)', border: '1px solid rgba(229,193,88,0.2)', borderRadius: '12px', padding: '30px 20px', marginBottom: '30px' }}>
              <div style={{ position: 'relative', maxWidth: '250px', margin: '0 auto', textAlign: 'left', paddingLeft: '40px' }}>
                <div style={{ position: 'absolute', left: '14px', top: '20px', bottom: '20px', width: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ position: 'absolute', left: '14px', top: '20px', height: orderStatus === 'SENT' ? '0%' : orderStatus === 'PLATING' ? '50%' : '100%', width: '2px', backgroundColor: '#E5C158', transition: 'height 0.5s ease' }}></div>
                
                <div style={{ position: 'relative', paddingBottom: '40px' }}>
                  <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#E5C158', boxShadow: '0 0 10px #E5C158' }}></div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Ticket Sent</h4>
                </div>
                <div style={{ position: 'relative', paddingBottom: '40px', opacity: orderStatus === 'SENT' ? 0.4 : 1 }}>
                  <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: orderStatus === 'SENT' ? 'rgba(255,255,255,0.2)' : '#E5C158' }}></div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Chef is Plating</h4>
                </div>
                <div style={{ position: 'relative', opacity: orderStatus === 'DISPATCHED' ? 1 : 0.4 }}>
                  <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: orderStatus === 'DISPATCHED' ? '#E5C158' : 'rgba(255,255,255,0.2)' }}></div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>On the Way!</h4>
                </div>
              </div>
            </div>

            {orderStatus === 'DISPATCHED' ? (
              <div style={{ animation: 'slideUp 0.5s' }}>
                <button onClick={handleMarkDelivered} className="submit-btn" style={{ boxShadow: '0 0 20px rgba(229, 193, 88, 0.3)' }}>Confirm Received</button>
              </div>
            ) : (
              <div style={{ animation: 'slideUp 0.5s 0.3s both' }}>
                <p style={{ color: '#E5C158', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '15px' }}>✨ Moments Before Forever...</p>
                <div className="hide-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px' }}>
                  {galleryImages.map((img, i) => (
                    <div key={i} style={{ minWidth: '180px', height: '220px', borderRadius: '12px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(229,193,88,0.3)' }} />
                  ))}
                </div>
              </div>
            )}

            {orderStatus === 'SENT' && (
              <button onClick={handleCancelOrder} style={{ marginTop: '30px', padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', fontSize: '0.85rem' }}>
                Cancel Order
              </button>
            )}
          </div>
        )}

        {/* --- STEP 5: SUCCESS --- */}
        {wizardStep === 5 && (
          <div style={{ animation: 'slideUp 0.6s', textAlign: 'center', paddingTop: '20px' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3.5rem', color: '#E5C158', margin: '0 0 10px 0' }}>O'K26</h1>
            <h2 style={{ fontFamily: '"Montserrat", sans-serif', color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>Order Delivered!</h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '30px' }}>Enjoy your meal, {guestName}. Thank you for celebrating with us.</p>
            
            {!showSouvenir ? (
              <div style={{ background: 'linear-gradient(145deg, rgba(26,22,18,0.9), rgba(5,4,3,1))', padding: '30px 20px', borderRadius: '12px', border: '1px solid rgba(229,193,88,0.3)', marginBottom: '30px' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '1.8rem', marginBottom: '10px' }}>The Royal Registry</h3>
                <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '20px' }}>Leave a digital blessing for the couple.</p>
                <textarea value={blessingText} onChange={(e) => setBlessingText(e.target.value)} placeholder="Wishing you a happy married life..." style={{ width: '100%', padding: '15px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(229,193,88,0.3)', color: '#fff', outline: 'none', height: '80px', marginBottom: '15px', fontFamily: '"Montserrat", sans-serif' }} />
                <button onClick={() => setShowSouvenir(true)} className="submit-btn" style={{ fontSize: '0.9rem' }}>Generate Digital Souvenir</button>
              </div>
            ) : (
              <div style={{ animation: 'slideUp 0.5s', marginBottom: '30px' }}>
                <div style={{ position: 'relative', width: '100%', padding: '30px', borderRadius: '12px', backgroundImage: 'url(/images/hero1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid #E5C158', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom: '15px' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(5,4,3,0.85)', borderRadius: '10px' }}></div>
                  <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2rem', margin: '0 0 10px 0' }}>O'K26</h2>
                    <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '20px' }}>"{blessingText || 'Wishing you endless joy and love!'}"</p>
                    <p style={{ color: '#E5C158', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>— {guestName} (Table {tableNumber})</p>
                  </div>
                </div>
                <button onClick={shareToWhatsApp} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem', marginBottom: '10px' }}>
                  💬 Share Text to WhatsApp
                </button>
              </div>
            )}

            <button onClick={handleReset} style={{ padding: '15px 30px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}>Order Something Else</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', padding: '30px 20px 20px', width: '100%', textAlign: 'center', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
          Seamlessly Engineered by <br/><span style={{ color: '#E5C158', fontWeight: 'bold', display: 'inline-block', marginTop: '5px' }}>Jare's Choice Labs</span>
        </p>
      </div>

      {/* --- VIP CONCIERGE BELL --- */}
      {wizardStep === 5 && (
        <>
          <button onClick={() => setShowConcierge(true)} style={{ position: 'fixed', bottom: '80px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#E5C158', color: '#050403', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: 'none', boxShadow: '0 5px 20px rgba(229,193,88,0.3)', zIndex: 50, animation: 'pulseFade 2s infinite' }}>🔔</button>
          {showConcierge && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,4,3,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ backgroundColor: '#0a0806', border: '1px solid #E5C158', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'slideUp 0.3s' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2rem', marginBottom: '10px' }}>VIP Concierge</h3>
                <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '0.9rem' }}>Silent service. What can we bring to Table {tableNumber}?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={() => callConcierge('BOTTLED WATER')} className="input-field" style={{ marginBottom: 0, cursor: 'pointer' }}>🧊 Bottled Water</button>
                  <button onClick={() => callConcierge('SERVIETTE / TISSUE')} className="input-field" style={{ marginBottom: 0, cursor: 'pointer' }}>🧻 Serviette / Tissue Paper</button>
                  <button onClick={() => callConcierge('CLEAR TABLE')} className="input-field" style={{ marginBottom: 0, cursor: 'pointer' }}>🧹 Clear My Table</button>
                </div>
                <button onClick={() => setShowConcierge(false)} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
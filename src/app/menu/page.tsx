'use client';
import { useState, useEffect } from 'react';

// ADMIN NOTE: Cloudinary Admin uploads will seamlessly replace these URLs later.
const MENU_ITEMS = [
  { id: 'm1', name: 'Pounded Yam + Egusi', category: 'Swallows', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' },
  { id: 'm2', name: 'Pounded Yam + Efo-riro', category: 'Swallows', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80' },
  { id: 'm3', name: 'Amala + Ewedu', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80' },
  { id: 'r1', name: 'Party Jollof Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80' },
  { id: 'r2', name: 'Fried Rice + Chicken', category: 'Rice', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80' },
  { id: 'd1', name: 'Chilled Coca-Cola', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80' },
  { id: 'd2', name: 'Pepsi', category: 'Drinks', img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&q=80' },
  { id: 'd3', name: '7Up', category: 'Drinks', img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&q=80' },
  { id: 'd4', name: 'Bigi Apple / Cola', category: 'Drinks', img: 'https://images.unsplash.com/photo-1581006124294-f2526e386477?w=500&q=80' },
  { id: 'w1', name: 'Premium Red Wine', category: 'Wine', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&q=80' }
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

  // Background Carousel Images (Will serve as full-page backdrop)
  const heroImages = [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&q=80'
  ];
  const [currentHero, setCurrentHero] = useState(0);

  // --- LOGIC RETAINED EXACTLY AS BEFORE ---
  useEffect(() => {
    setTableNumber(new URLSearchParams(window.location.search).get('table'));
    const savedOrderId = localStorage.getItem('ok26_orderId');
    const savedStep = localStorage.getItem('ok26_step');
    
    if (savedOrderId && savedStep) {
      setOrderId(savedOrderId);
      setWizardStep(parseInt(savedStep));
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => setShowSplash(false), 2200);
      return () => clearTimeout(timer);
    }
    
    const heroTimer = setInterval(() => setCurrentHero(prev => (prev + 1) % heroImages.length), 6000);
    return () => clearInterval(heroTimer);
  }, [heroImages.length]);

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
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Montserrat:wght@300;400;600&display=swap');`}</style>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(229,193,88,0.1) 0%, rgba(5,4,3,1) 60%)' }} />
        <h1 style={{ position: 'relative', fontFamily: '"Cormorant Garamond", serif', fontSize: '4.5rem', color: '#E5C158', letterSpacing: '8px', margin: 0, animation: 'cinematicReveal 2s forwards ease-out' }}>O'K26</h1>
        <p style={{ position: 'relative', fontFamily: '"Montserrat", sans-serif', color: '#fff', fontSize: '0.8rem', letterSpacing: '6px', textTransform: 'uppercase', marginTop: '15px', animation: 'fadeInUp 2s forwards ease-out 0.5s', opacity: 0 }}>The Royal Menu</p>
        <style>{`
          @keyframes cinematicReveal { 0% { opacity: 0; filter: blur(15px); transform: scale(0.85); } 100% { opacity: 1; filter: blur(0); transform: scale(1); text-shadow: 0 0 30px rgba(229,193,88,0.6); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  if (!tableNumber) return <div style={{ backgroundColor: '#050403', minHeight: '100vh', color: '#E5C158', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Montserrat", sans-serif' }}>Please scan the QR code on your table to access the menu.</div>;

  return (
    <div style={{ minHeight: '100vh', color: '#fff', overflowX: 'hidden', fontFamily: '"Montserrat", sans-serif', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Montserrat:wght@300;400;500;600&display=swap');
        
        @keyframes slowScroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-150%); } }
        @keyframes kenBurnsFull { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        /* THE 7-STAR GLASSMORPHISM UPGRADE */
        .glass-panel {
          background: rgba(15, 12, 10, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(229, 193, 88, 0.25);
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 5px;
        }
        
        .menu-card { 
          position: relative;
          border-radius: 16px; 
          overflow: hidden; 
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); 
          cursor: pointer; 
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, rgba(20, 16, 12, 0.6) 0%, rgba(5, 4, 3, 0.8) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(229, 193, 88, 0.15);
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }
        
        .menu-card.selected { 
          border-color: rgba(229, 193, 88, 0.8); 
          background: linear-gradient(135deg, rgba(229, 193, 88, 0.2) 0%, rgba(5, 4, 3, 0.9) 100%); 
          box-shadow: 0 0 30px rgba(229, 193, 88, 0.3), inset 0 0 15px rgba(229, 193, 88, 0.1); 
          transform: translateY(-5px);
        }
        
        .menu-img-wrap {
          width: 100%;
          aspect-ratio: 1 / 1; 
          position: relative;
          overflow: hidden;
        }
        
        .menu-img-wrap img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.8s ease;
          opacity: 0.9;
        }
        .menu-card:hover .menu-img-wrap img, .menu-card.selected .menu-img-wrap img { 
          transform: scale(1.15); 
          opacity: 1;
        }

        .menu-content {
          padding: 16px 10px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          border-top: 1px solid rgba(229, 193, 88, 0.15);
        }

        .input-glass { width: 100%; padding: 20px; margin-bottom: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(229,193,88,0.3); border-radius: 12px; color: #fff; font-family: "Montserrat", sans-serif; outline: none; transition: 0.3s; font-size: 1rem; letter-spacing: 1px; backdrop-filter: blur(8px); }
        .input-glass:focus { border-color: #E5C158; background: rgba(255,255,255,0.1); box-shadow: 0 0 15px rgba(229,193,88,0.2); }
        
        .btn-gold-luxury { width: 100%; padding: 20px; background: linear-gradient(145deg, #E5C158, #B89025); color: #050403; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 2px; font-size: 1rem; transition: 0.3s; box-shadow: 0 10px 25px rgba(229,193,88,0.3); }
        .btn-gold-luxury:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(229,193,88,0.4); }

        .ambient-glow {
          position: fixed;
          top: 30%;
          left: 50%;
          width: 100vw;
          height: 100vw;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(229, 193, 88, 0.08) 0%, rgba(0,0,0,0) 65%);
          z-index: 1;
          pointer-events: none;
        }

        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* --- LAYER 1: FULL SCREEN DYNAMIC COUPLE BACKGROUND --- */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundColor: '#050403' }}>
        {heroImages.map((img, idx) => (
          <div key={idx} style={{ position: 'absolute', inset: 0, opacity: currentHero === idx ? 0.6 : 0, transition: 'opacity 3s ease-in-out', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center 20%', animation: currentHero === idx ? 'kenBurnsFull 15s forwards' : 'none' }} />
        ))}
        {/* Cinematic Vignette Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,4,3,0.3) 0%, rgba(5,4,3,0.85) 40%, rgba(5,4,3,1) 100%)' }} />
      </div>

      {/* --- LAYER 2: AMBIENT LIGHTING --- */}
      <div className="ambient-glow" />

      {/* --- LAYER 3: THE CONTENT --- */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* TOP HEADER: Logo & Location Tracker */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 20px', animation: 'slideUpFade 0.8s' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '4px' }}>
            O'K26
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(26,22,18,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(229,193,88,0.2)', padding: '6px 14px', borderRadius: '20px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E5C158', animation: 'pulseFade 2s infinite' }}></div>
            <span style={{ fontFamily: '"Montserrat", sans-serif', color: '#ccc', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Table {tableNumber}</span>
          </div>
        </header>

        {/* TICKER */}
        {wizardStep >= 4 && (
          <div style={{ background: 'rgba(5,4,3,0.6)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(229, 193, 88, 0.15)', padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ display: 'inline-block', animation: 'slowScroll 40s linear infinite', color: '#E5C158', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {recentActivity.join('  ✦  ')}  ✦  {recentActivity.join('  ✦  ')}
            </div>
          </div>
        )}

        <div style={{ padding: '10px 20px 40px', maxWidth: '600px', margin: '0 auto', flex: 1, width: '100%' }}>
          
          {wizardStep < 4 && (
            <div style={{ textAlign: 'center', marginBottom: '45px', animation: 'slideUpFade 0.8s 0.2s both' }}>
              <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#fff', fontSize: '3rem', lineHeight: '1.1', margin: '0 0 15px 0', fontWeight: '400', textShadow: '0 5px 20px rgba(0,0,0,0.8)' }}>
                The Royal <br/><span style={{ color: '#E5C158', fontStyle: 'italic' }}>Reception</span>
              </h1>
              <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.85rem', color: '#bbb', lineHeight: '1.7', fontWeight: '300', letterSpacing: '0.5px' }}>
                Select your desired course. Our Quickserve team will prepare and present it to your table.
              </p>
            </div>
          )}

          {/* --- STEP 1: FOOD GRID --- */}
          {wizardStep === 1 && (
            <div style={{ animation: 'slideUpFade 0.6s 0.4s both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(229,193,88,0.3))' }}></div>
                <h3 style={{ fontFamily: '"Montserrat", sans-serif', color: '#E5C158', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Main Courses</h3>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(229,193,88,0.3))' }}></div>
              </div>
              
              <div className="menu-grid">
                {MENU_ITEMS.filter(i => i.category === 'Swallows' || i.category === 'Rice').map((item) => (
                  <div key={item.id} onClick={() => handleMealSelect(item)} className={`menu-card ${selectedMeal === item.id ? 'selected' : ''}`}>
                    <div className="menu-img-wrap"><img src={item.img} alt={item.name} /></div>
                    <div className="menu-content">
                      <span style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: '500', fontSize: '0.8rem', color: selectedMeal === item.id ? '#E5C158' : '#fff', lineHeight: '1.5', letterSpacing: '0.5px' }}>{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SALAD MODAL (FROSTED) --- */}
          {showSaladModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,4,3,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="glass-panel" style={{ padding: '40px 25px', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'slideUpFade 0.4s' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '400' }}>Add a side?</h3>
                <p style={{ color: '#ccc', marginBottom: '35px', fontSize: '0.9rem', lineHeight: '1.6' }}>Would you like Coleslaw or Salad included with your rice?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <button onClick={() => handleSaladChoice(true)} className="btn-gold-luxury">Yes, include Salad</button>
                  <button onClick={() => handleSaladChoice(false)} style={{ padding: '18px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid rgba(229,193,88,0.3)', borderRadius: '12px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>No, just Rice</button>
                </div>
              </div>
            </div>
          )}

          {/* --- STEP 2: DRINK GRID --- */}
          {wizardStep === 2 && (
            <div style={{ animation: 'slideUpFade 0.6s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(229,193,88,0.3))' }}></div>
                <h3 style={{ fontFamily: '"Montserrat", sans-serif', color: '#E5C158', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Refreshments</h3>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(229,193,88,0.3))' }}></div>
              </div>
              
              <div onClick={() => handleDrinkSelect('none')} className={`menu-card ${selectedDrink === 'none' ? 'selected' : ''}`} style={{ marginBottom: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: '500', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', color: selectedDrink === 'none' ? '#E5C158' : '#aaa' }}>Skip Drink Selection</span>
              </div>

              <div className="menu-grid">
                {MENU_ITEMS.filter(i => i.category === 'Drinks' || i.category === 'Wine').map((item) => (
                  <div key={item.id} onClick={() => handleDrinkSelect(item.id)} className={`menu-card ${selectedDrink === item.id ? 'selected' : ''}`}>
                    <div className="menu-img-wrap"><img src={item.img} alt={item.name} /></div>
                    <div className="menu-content">
                      <span style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: '500', fontSize: '0.8rem', color: selectedDrink === item.id ? '#E5C158' : '#fff', lineHeight: '1.5', letterSpacing: '0.5px' }}>{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setWizardStep(1)} style={{ width: '100%', padding: '20px', marginTop: '25px', backgroundColor: 'transparent', color: '#aaa', border: 'none', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>← Back to Courses</button>
            </div>
          )}

          {/* --- STEP 3: IDENTITY (FROSTED) --- */}
          {wizardStep === 3 && (
            <div className="glass-panel" style={{ padding: '40px 25px', animation: 'slideUpFade 0.6s', textAlign: 'center', marginTop: '20px' }}>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2.8rem', marginBottom: '15px', fontWeight: '400' }}>Final Step</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '40px', letterSpacing: '0.5px' }}>Who are we serving at Table {tableNumber}?</p>
              
              <input type="text" placeholder="Your Name (e.g. Guest Ahmed)" value={guestName} onChange={e => setGuestName(e.target.value)} className="input-glass" />
              
              <button onClick={handleConfirmOrder} disabled={isSubmitting} className="btn-gold-luxury">
                {isSubmitting ? 'Transmitting...' : 'Place Royal Order'}
              </button>
              <button onClick={() => setWizardStep(2)} style={{ width: '100%', padding: '20px', marginTop: '15px', backgroundColor: 'transparent', color: '#aaa', border: 'none', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>← Go Back</button>
            </div>
          )}

          {/* --- STEP 4: TRACKING --- */}
          {wizardStep === 4 && (
            <div style={{ animation: 'slideUpFade 0.6s', textAlign: 'center', paddingTop: '20px' }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2.8rem', marginBottom: '35px', fontWeight: '400' }}>Order Status</h2>
              
              <div className="glass-panel" style={{ padding: '40px 20px', marginBottom: '40px' }}>
                <div style={{ position: 'relative', maxWidth: '250px', margin: '0 auto', textAlign: 'left', paddingLeft: '45px' }}>
                  {/* Timeline Line */}
                  <div style={{ position: 'absolute', left: '16px', top: '25px', bottom: '25px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                  <div style={{ position: 'absolute', left: '16px', top: '25px', height: orderStatus === 'SENT' ? '0%' : orderStatus === 'PLATING' ? '50%' : '100%', width: '1px', backgroundColor: '#E5C158', transition: 'height 0.8s ease', boxShadow: '0 0 10px #E5C158' }}></div>
                  
                  {/* Nodes */}
                  <div style={{ position: 'relative', paddingBottom: '45px' }}>
                    <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#E5C158', boxShadow: '0 0 15px #E5C158', border: '2px solid #050403' }}></div>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1px', fontWeight: '500' }}>Ticket Sent</h4>
                  </div>
                  <div style={{ position: 'relative', paddingBottom: '45px', opacity: orderStatus === 'SENT' ? 0.3 : 1, transition: 'opacity 0.5s ease' }}>
                    <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: orderStatus === 'SENT' ? 'rgba(255,255,255,0.2)' : '#E5C158', border: '2px solid #050403' }}></div>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1px', fontWeight: '500' }}>Chef is Plating</h4>
                  </div>
                  <div style={{ position: 'relative', opacity: orderStatus === 'DISPATCHED' ? 1 : 0.3, transition: 'opacity 0.5s ease' }}>
                    <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: orderStatus === 'DISPATCHED' ? '#E5C158' : 'rgba(255,255,255,0.2)', border: '2px solid #050403' }}></div>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1px', fontWeight: '500' }}>On the Way!</h4>
                  </div>
                </div>
              </div>

              {orderStatus === 'DISPATCHED' ? (
                <div style={{ animation: 'slideUpFade 0.6s' }}>
                  <button onClick={handleMarkDelivered} className="btn-gold-luxury">Confirm Received</button>
                </div>
              ) : (
                <div style={{ animation: 'slideUpFade 0.6s 0.3s both' }}>
                  <p style={{ color: '#E5C158', fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '20px', letterSpacing: '1px' }}>✨ Moments Before Forever...</p>
                  <div className="hide-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '15px' }}>
                    {heroImages.map((img, i) => (
                      <div key={i} style={{ minWidth: '180px', height: '240px', borderRadius: '16px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(229,193,88,0.2)', boxShadow: '0 5px 20px rgba(0,0,0,0.4)' }} />
                    ))}
                  </div>
                </div>
              )}

              {orderStatus === 'SENT' && (
                <button onClick={handleCancelOrder} style={{ marginTop: '35px', padding: '15px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Cancel Order
                </button>
              )}
            </div>
          )}

          {/* --- STEP 5: SUCCESS --- */}
          {wizardStep === 5 && (
            <div style={{ animation: 'slideUpFade 0.8s', textAlign: 'center', paddingTop: '40px' }}>
              <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '4rem', color: '#E5C158', margin: '0 0 10px 0', fontWeight: '400' }}>O'K26</h1>
              <h2 style={{ fontFamily: '"Montserrat", sans-serif', color: '#fff', fontSize: '1.4rem', marginBottom: '15px', letterSpacing: '2px', fontWeight: '300' }}>ORDER DELIVERED</h2>
              <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '40px' }}>Enjoy your meal, <span style={{ color: '#E5C158' }}>{guestName}</span>.<br/>Thank you for celebrating with us.</p>
              
              {!showSouvenir ? (
                <div className="glass-panel" style={{ padding: '40px 25px', marginBottom: '40px' }}>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2rem', marginBottom: '15px', fontWeight: '400' }}>The Royal Registry</h3>
                  <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '25px', lineHeight: '1.6' }}>Leave a digital blessing for the couple.</p>
                  <textarea value={blessingText} onChange={(e) => setBlessingText(e.target.value)} placeholder="Wishing you a happy married life..." className="input-glass" style={{ height: '100px', resize: 'none' }} />
                  <button onClick={() => setShowSouvenir(true)} className="btn-gold-luxury" style={{ fontSize: '0.85rem' }}>Generate Digital Souvenir</button>
                </div>
              ) : (
                <div style={{ animation: 'slideUpFade 0.6s', marginBottom: '40px' }}>
                  <div style={{ position: 'relative', width: '100%', padding: '40px 30px', borderRadius: '20px', backgroundImage: 'url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid #E5C158', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', marginBottom: '20px' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(5,4,3,0.85)', borderRadius: '18px', backdropFilter: 'blur(4px)' }}></div>
                    <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                      <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2.5rem', margin: '0 0 20px 0', fontWeight: '400' }}>O'K26</h2>
                      <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '1.2rem', marginBottom: '30px', lineHeight: '1.6', fontFamily: '"Cormorant Garamond", serif' }}>"{blessingText || 'Wishing you endless joy and love!'}"</p>
                      <div style={{ height: '1px', width: '40px', background: '#E5C158', margin: '0 auto 15px' }}></div>
                      <p style={{ color: '#E5C158', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', fontFamily: '"Montserrat", sans-serif' }}>{guestName} (Table {tableNumber})</p>
                    </div>
                  </div>
                  <button onClick={shareToWhatsApp} className="btn-gold-luxury" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: '#25D366', color: '#fff' }}>
                    💬 Share to WhatsApp
                  </button>
                </div>
              )}

              <button onClick={handleReset} style={{ padding: '15px 30px', backgroundColor: 'transparent', color: '#aaa', border: 'none', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Order Another Course</button>
            </div>
          )}
        </div>

        <div style={{ padding: '30px 20px', width: '100%', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0, fontFamily: '"Montserrat", sans-serif' }}>
            Engineered by <br/><span style={{ color: 'rgba(229,193,88,0.5)', fontWeight: '600', display: 'inline-block', marginTop: '8px' }}>Jare's Choice Labs</span>
          </p>
        </div>
      </div>

      {/* --- VIP CONCIERGE BELL (FROSTED) --- */}
      {wizardStep === 5 && (
        <>
          <button onClick={() => setShowConcierge(true)} style={{ position: 'fixed', bottom: '40px', right: '20px', width: '65px', height: '65px', borderRadius: '50%', background: 'linear-gradient(145deg, #E5C158, #B89025)', color: '#050403', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', border: 'none', boxShadow: '0 10px 30px rgba(229,193,88,0.4)', zIndex: 50, animation: 'pulseFade 2.5s infinite' }}>🔔</button>
          {showConcierge && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,4,3,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="glass-panel" style={{ padding: '40px 25px', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'slideUpFade 0.4s' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#E5C158', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '400' }}>Concierge</h3>
                <p style={{ color: '#aaa', marginBottom: '35px', fontSize: '0.85rem', letterSpacing: '0.5px' }}>Silent service. What can we bring to Table {tableNumber}?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <button onClick={() => callConcierge('BOTTLED WATER')} className="input-glass" style={{ marginBottom: 0, cursor: 'pointer', textAlign: 'center' }}>🧊 Bottled Water</button>
                  <button onClick={() => callConcierge('SERVIETTE / TISSUE')} className="input-glass" style={{ marginBottom: 0, cursor: 'pointer', textAlign: 'center' }}>🧻 Serviette / Tissue Paper</button>
                  <button onClick={() => callConcierge('CLEAR TABLE')} className="input-glass" style={{ marginBottom: 0, cursor: 'pointer', textAlign: 'center' }}>🧹 Clear My Table</button>
                </div>
                <button onClick={() => setShowConcierge(false)} style={{ marginTop: '25px', padding: '15px', backgroundColor: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
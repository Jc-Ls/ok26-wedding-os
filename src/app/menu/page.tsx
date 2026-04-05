'use client';

import { useState, useMemo, useEffect } from 'react';

const MENU_ITEMS = [
  { id: 'm1', name: 'Pounded Yam + Egusi', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=200&q=80' },
  { id: 'm2', name: 'Pounded Yam + Efo-riro', category: 'Swallows', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80' },
  { id: 'm3', name: 'Amala + Gbegiri', category: 'Swallows', img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=200&q=80' },
  { id: 'm4', name: 'Amala + Ewedu', category: 'Swallows', img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=200&q=80' },
  { id: 'm5', name: 'Amala + Abula', category: 'Swallows', img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=200&q=80' },
  { id: 'm6', name: 'Semo + Ewedu', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=200&q=80' },
  { id: 'r1', name: 'Party Jollof Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80' },
  { id: 'r2', name: 'Fried Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=200&q=80' },
  { id: 'r3', name: 'Jollof + Fried Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80' },
  { id: 'r4', name: 'White Rice + Beans', category: 'Rice', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=200&q=80' },
  { id: 'd1', name: 'Coca-Cola', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 'd2', name: 'Fanta', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 'd3', name: 'Pulpy Orange', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 'd4', name: 'Premium Red Wine', category: 'Wine', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=200&q=80' },
];

export default function MenuPage() {
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [includeSalad, setIncludeSalad] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: POPUP STATE
  const [showIdentityPopup, setShowIdentityPopup] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // REAL DATABASE TRACKER STATE
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTableNumber(params.get('table'));
  }, []);

  useEffect(() => {
    if (!orderId || orderStatus === 'DISPATCHED') return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders?id=${orderId}`);
        const data = await res.json();
        if (data.status && data.status !== orderStatus) setOrderStatus(data.status);
      } catch (err) {
        console.error("Failed to fetch status");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId, orderStatus]);

  const categories = ['All', 'Swallows', 'Rice', 'Drinks', 'Wine'];

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All' || item.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const handleConfirmOrder = async () => {
    if (!guestName.trim()) {
      alert("Please enter your name so the waiter can find you!");
      return;
    }

    setIsSubmitting(true);
    
    const mealName = MENU_ITEMS.find(i => i.id === selectedMeal)?.name || null;
    const drinkName = MENU_ITEMS.find(i => i.id === selectedDrink)?.name || null;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber,
          guestName,
          guestPhone,
          mealName,
          drinkName,
          withSalad: includeSalad
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowIdentityPopup(false); // Hide the popup
        setOrderId(data.orderId);
        setOrderStatus('SENT');
      } else {
        alert("Server error processing order.");
      }
    } catch (error) {
      alert("Failed to send order. Please check internet connection.");
    }
    setIsSubmitting(false);
  };

  if (tableNumber === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw', padding: '24px', textAlign: 'center', backgroundColor: 'var(--navy-bg)' }}>
        <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', color: 'var(--gold-bright)', marginBottom: '16px' }}>Table Code Missing</h1>
        <p style={{ color: '#d1d5db' }}>Please scan the barcode located on your table using your phone's camera.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', maxWidth: '100%', minHeight: '100vh', backgroundColor: 'var(--navy-bg)', paddingBottom: '128px', overflowX: 'hidden' }}>
      
      {/* HERO SECTION */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '30px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <nav style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '800px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontFamily: '"Cinzel", serif', fontSize: '1.5rem', color: 'var(--gold-base)', fontWeight: 'bold', textDecoration: 'none' }}>O'K26</a>
          <div style={{ fontSize: '0.85rem', color: '#fff', background: 'rgba(249, 168, 212, 0.15)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--pink-accent)' }}>
            Table {tableNumber}
          </div>
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px', marginTop: '10px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: 'var(--gold-bright)', lineHeight: '1.2' }}>Digital Menu</h1>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 16px', marginTop: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <input type="text" placeholder="Search for a meal or drink..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#fff', padding: '14px 16px', borderRadius: '8px', outline: 'none' }} />
        </div>

        <div className="no-scrollbar" style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'rgba(10, 20, 47, 0.95)', padding: '16px 0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', gap: '10px', padding: '0 4px' }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveTab(cat)} style={{ padding: '8px 18px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: activeTab === cat ? 'var(--gold-base)' : 'transparent', color: activeTab === cat ? '#000' : '#9ca3af', border: activeTab === cat ? 'none' : '1px solid #4b5563' }}>{cat}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredMenu.map((item) => {
            const isMeal = item.category === 'Swallows' || item.category === 'Rice';
            const isSelected = isMeal ? selectedMeal === item.id : selectedDrink === item.id;
            return (
              <div key={item.id}>
                <label className={`menu-item-card ${isSelected ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', border: `1px solid ${isSelected ? 'var(--gold-base)' : 'rgba(255,255,255,0.1)'}`, backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <input type="radio" name={isMeal ? "meal" : "drink"} checked={isSelected} onChange={() => isMeal ? setSelectedMeal(item.id) : setSelectedDrink(item.id)} style={{ width: '22px', height: '22px', marginRight: '12px', accentColor: 'var(--gold-base)' }} />
                    <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem', textTransform: 'uppercase' }}>{item.name}</span>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING ORDER BUTTON (Triggers Popup instead of sending directly) */}
      {(selectedMeal || selectedDrink) && !orderStatus && !showIdentityPopup && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '16px', backgroundColor: 'rgba(10, 20, 47, 0.95)', zIndex: 30 }}>
          <button onClick={() => setShowIdentityPopup(true)} style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block', backgroundColor: 'var(--gold-base)', color: '#000', fontWeight: 'bold', padding: '18px', borderRadius: '8px', textTransform: 'uppercase', border: 'none' }}>
            Next Step
          </button>
        </div>
      )}

      {/* IDENTITY POPUP (Collects Name/Phone) */}
      {showIdentityPopup && !orderStatus && (
        <div className="tracker-overlay" style={{ zIndex: 100 }}>
          <div className="tracker-card">
            <h2 style={{ fontFamily: '"Cinzel", serif', color: 'var(--gold-bright)', fontSize: '1.4rem', marginBottom: '10px' }}>Who is ordering?</h2>
            <p style={{ color: '#d1d5db', fontSize: '0.85rem', marginBottom: '20px' }}>Help our waiters locate you at Table {tableNumber}.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', color: '#fff', fontSize: '0.85rem', marginBottom: '5px' }}>Your Name (Required)</label>
                <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="e.g. Uncle Jare" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.5)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem' }} required />
              </div>
              <div>
                <label style={{ display: 'block', color: '#fff', fontSize: '0.85rem', marginBottom: '5px' }}>Phone Number (Optional)</label>
                <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="e.g. 08012345678" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => setShowIdentityPopup(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleConfirmOrder} disabled={isSubmitting} style={{ flex: 2, padding: '12px', backgroundColor: 'var(--gold-base)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Sending...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REAL-TIME TRACKER MODAL */}
      {orderStatus && (
        <div className="tracker-overlay" style={{ zIndex: 100 }}>
          <div className="tracker-card">
            <h2 style={{ fontFamily: '"Cinzel", serif', color: 'var(--gold-bright)', fontSize: '1.5rem', marginBottom: '10px' }}>Order Status</h2>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '20px' }}>Hold tight, <strong style={{ color: 'var(--gold-base)' }}>{guestName}</strong>! Your order is locked to Table {tableNumber}.</p>

            <div className="step-container">
              <div className="step-line"></div>
              <div className="step-line-fill" style={{ height: orderStatus === 'SENT' ? '0%' : orderStatus === 'PLATING' ? '50%' : '100%' }}></div>

              <div className={`step-item ${orderStatus === 'SENT' ? 'active' : 'completed'}`}>
                <div className="step-icon">{orderStatus === 'SENT' ? '🎫' : '✔️'}</div>
                <div className="step-text">
                  <h4>Ticket Sent {orderStatus === 'SENT' && <span className="pulsing-dot"></span>}</h4>
                  <p>Kitchen has received your order</p>
                </div>
              </div>

              <div className={`step-item ${orderStatus === 'PLATING' ? 'active' : orderStatus === 'DISPATCHED' ? 'completed' : ''}`}>
                <div className="step-icon">{orderStatus === 'DISPATCHED' ? '✔️' : '🍳'}</div>
                <div className="step-text">
                  <h4>Chef is Plating {orderStatus === 'PLATING' && <span className="pulsing-dot"></span>}</h4>
                  <p>Preparing your meal freshly</p>
                </div>
              </div>

              <div className={`step-item ${orderStatus === 'DISPATCHED' ? 'active' : ''}`}>
                <div className="step-icon">🏃‍♂️</div>
                <div className="step-text">
                  <h4>On the Way! {orderStatus === 'DISPATCHED' && <span className="pulsing-dot"></span>}</h4>
                  <p>Waiter is heading to Table {tableNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

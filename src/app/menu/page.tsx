'use client';
import { useState, useMemo, useEffect } from 'react';

const MENU_ITEMS = [
  { id: 'm1', name: 'Pounded Yam + Egusi', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=200&q=80' },
  { id: 'r1', name: 'Party Jollof Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80' },
  { id: 'd1', name: 'Chilled Coca-Cola', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 'd2', name: 'Premium Red Wine', category: 'Drinks', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=200&q=80' }
];

export default function MenuPage() {
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  
  // WIZARD STATES
  const [wizardStep, setWizardStep] = useState(1); // 1:Food, 2:Drink, 3:Identity, 4:Tracking, 5:Success
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  
  // TRACKING & TICKER STATES
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>([
    "✨ Welcome to the O'K26 Celebration!",
    "🔥 Kitchen is actively taking orders..."
  ]);

  useEffect(() => { setTableNumber(new URLSearchParams(window.location.search).get('table')); }, []);

  // TICKER & TRACKER POLLING
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch('/api/orders');
        const orders = await res.json();
        
        // Build the Live Ticker from real database data!
        if (orders.length > 0) {
          const activities = orders.slice(0, 5).map((o: any) => {
            const firstName = o.guestName ? o.guestName.split(' ')[0] : 'A guest';
            if (o.status === 'DELIVERED') return `🎉 ${firstName} at Table ${o.tableNumber} just received their meal!`;
            if (o.status === 'DISPATCHED') return `🏃‍♂️ ${firstName}'s order is arriving at Table ${o.tableNumber}!`;
            return `🔥 ${firstName} at Table ${o.tableNumber} just placed an order.`;
          });
          setRecentActivity(activities);
        }

        // Update Tracker if tracking an order
        if (orderId && orderStatus !== 'DELIVERED') {
          const myOrder = orders.find((o: any) => o.id === orderId);
          if (myOrder && myOrder.status !== orderStatus) setOrderStatus(myOrder.status);
        }
      } catch (err) {}
    };

    fetchUpdates();
    const interval = setInterval(fetchUpdates, 8000); // Check every 8 seconds
    return () => clearInterval(interval);
  }, [orderId, orderStatus]);

  const handleConfirmOrder = async () => {
    if (!guestName.trim()) return alert("Please enter your name!");
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tableNumber, guestName, guestPhone, 
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
    } catch (e) { alert("Failed to update status."); }
  };

  const resetMenu = () => {
    setWizardStep(1); setSelectedMeal(null); setSelectedDrink(null); setOrderId(null); setOrderStatus(null);
  };

  if (!tableNumber) return <div style={{ color: '#D4AF37', textAlign: 'center', marginTop: '50px' }}>Missing Table Code</div>;

  return (
    <div style={{ backgroundColor: '#0A142F', minHeight: '100vh', color: '#fff', paddingBottom: '100px', overflowX: 'hidden' }}>
      
      {/* THE LIVE TICKER */}
      <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'scroll 20s linear infinite', color: '#D4AF37', fontStyle: 'italic', fontSize: '0.85rem' }}>
          {recentActivity.join('   |   ')}   |   {recentActivity.join('   |   ')}
        </div>
      </div>
      <style>{`@keyframes scroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }`}</style>

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#D4AF37', textAlign: 'center', fontFamily: '"Cinzel", serif', marginBottom: '5px' }}>O'K26 Menu</h1>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '20px' }}>Table {tableNumber}</p>
        
        {/* WIZARD STEP 1: FOOD */}
        {wizardStep === 1 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h3 style={{ color: '#F9A8D4', marginBottom: '15px' }}>1. Choose Your Meal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {MENU_ITEMS.filter(i => i.category !== 'Drinks').map((item) => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', border: `1px solid ${selectedMeal === item.id ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', backgroundColor: selectedMeal === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent', cursor: 'pointer' }}>
                  <input type="radio" name="meal" checked={selectedMeal === item.id} onChange={() => setSelectedMeal(item.id)} style={{ marginRight: '15px', accentColor: '#D4AF37' }}/>
                  <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                </label>
              ))}
            </div>
            {selectedMeal && <button onClick={() => setWizardStep(2)} style={{ width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none' }}>Next: Choose Drink</button>}
          </div>
        )}

        {/* WIZARD STEP 2: DRINKS */}
        {wizardStep === 2 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h3 style={{ color: '#F9A8D4', marginBottom: '15px' }}>2. What are you drinking?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <input type="radio" name="drink" onChange={() => setSelectedDrink('none')} style={{ marginRight: '15px' }}/> Just Food, No Drink
              </label>
              {MENU_ITEMS.filter(i => i.category === 'Drinks').map((item) => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', border: `1px solid ${selectedDrink === item.id ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', backgroundColor: selectedDrink === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent', cursor: 'pointer' }}>
                  <input type="radio" name="drink" checked={selectedDrink === item.id} onChange={() => setSelectedDrink(item.id)} style={{ marginRight: '15px', accentColor: '#D4AF37' }}/>
                  <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setWizardStep(1)} style={{ padding: '15px', flex: 1, backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}>Back</button>
              {selectedDrink && <button onClick={() => setWizardStep(3)} style={{ padding: '15px', flex: 2, backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none' }}>Review Order</button>}
            </div>
          </div>
        )}

        {/* WIZARD STEP 3: IDENTITY */}
        {wizardStep === 3 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h3 style={{ color: '#F9A8D4', marginBottom: '15px' }}>3. Who is ordering?</h3>
            <p style={{ color: '#d1d5db', fontSize: '0.85rem', marginBottom: '20px' }}>This helps the waiter find you at the table.</p>
            <input type="text" placeholder="Your First Name (e.g. Ahmed)" value={guestName} onChange={e => setGuestName(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #D4AF37', color: '#fff' }} />
            <input type="tel" placeholder="Phone Number (Optional)" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setWizardStep(2)} style={{ padding: '15px', flex: 1, backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}>Back</button>
              <button onClick={handleConfirmOrder} disabled={isSubmitting} style={{ padding: '15px', flex: 2, backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none' }}>
                {isSubmitting ? 'Sending...' : 'Order Now'}
              </button>
            </div>
          </div>
        )}

        {/* WIZARD STEP 4: TRACKING */}
        {wizardStep === 4 && (
          <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center', marginTop: '20px' }}>
            <h2 style={{ color: '#D4AF37', marginBottom: '20px' }}>Tracking Your Meal</h2>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
              <p style={{ color: orderStatus === 'SENT' ? '#D4AF37' : '#555', fontWeight: 'bold', margin: '10px 0' }}>🎫 Ticket Sent</p>
              <p style={{ color: orderStatus === 'PLATING' ? '#D4AF37' : '#555', fontWeight: 'bold', margin: '10px 0' }}>🍳 Chef is Plating</p>
              <p style={{ color: orderStatus === 'DISPATCHED' ? '#D4AF37' : '#555', fontWeight: 'bold', margin: '10px 0' }}>🏃‍♂️ On the Way!</p>
            </div>
            
            {orderStatus === 'DISPATCHED' ? (
              <div style={{ animation: 'pulse 2s infinite' }}>
                <p style={{ color: '#F9A8D4', marginBottom: '15px', fontStyle: 'italic' }}>Your waiter is approaching your table!</p>
                <button onClick={handleMarkDelivered} style={{ width: '100%', padding: '20px', backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px', border: 'none', boxShadow: '0 0 15px rgba(76, 175, 80, 0.5)' }}>
                  ✅ I Received My Order
                </button>
              </div>
            ) : (
              <p style={{ color: '#888', fontStyle: 'italic' }}>Please leave this page open.</p>
            )}
          </div>
        )}

        {/* WIZARD STEP 5: SUCCESS */}
        {wizardStep === 5 && (
          <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center', marginTop: '40px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🥂</div>
            <h2 style={{ color: '#D4AF37', marginBottom: '10px' }}>Delivered!</h2>
            <p style={{ color: '#d1d5db', marginBottom: '30px' }}>Enjoy your meal, {guestName}. Thank you for celebrating with us.</p>
            <button onClick={resetMenu} style={{ padding: '15px 30px', backgroundColor: 'transparent', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: '8px' }}>
              Order Another Round
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

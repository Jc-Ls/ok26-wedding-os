'use client';
import { useState, useMemo, useEffect } from 'react';

const MENU_ITEMS = [
  { id: 'm1', name: 'Pounded Yam + Egusi', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=200&q=80' },
  { id: 'r1', name: 'Party Jollof Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80' },
  { id: 'd1', name: 'Coca-Cola', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' }
]; // (Other items will still render from previous code if we kept it, but this keeps the script light for now!)

export default function MenuPage() {
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [showIdentityPopup, setShowIdentityPopup] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { setTableNumber(new URLSearchParams(window.location.search).get('table')); }, []);

  const handleConfirmOrder = async () => {
    if (!guestName.trim()) return alert("Please enter your name!");
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, guestName, guestPhone, mealName: MENU_ITEMS.find(i => i.id === selectedMeal)?.name, drinkName: MENU_ITEMS.find(i => i.id === selectedDrink)?.name, withSalad: false })
      });
      const data = await res.json();
      if (data.success) { setShowIdentityPopup(false); setOrderStatus('SENT'); }
    } catch (e) { alert("Error sending order."); }
    setIsSubmitting(false);
  };

  if (!tableNumber) return <div style={{ color: '#D4AF37', textAlign: 'center', marginTop: '50px' }}>Missing Table Code</div>;

  return (
    <div style={{ backgroundColor: '#0A142F', minHeight: '100vh', color: '#fff', padding: '20px', paddingBottom: '100px' }}>
      <h1 style={{ color: '#D4AF37', textAlign: 'center' }}>Table {tableNumber} Menu</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {MENU_ITEMS.map((item) => (
          <label key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid #D4AF37', borderRadius: '8px' }}>
            <input type="radio" name={item.category === 'Drinks' ? 'drink' : 'meal'} onChange={() => item.category === 'Drinks' ? setSelectedDrink(item.id) : setSelectedMeal(item.id)} style={{ marginRight: '10px' }}/>
            {item.name}
          </label>
        ))}
      </div>

      {(selectedMeal || selectedDrink) && !showIdentityPopup && !orderStatus && (
        <button onClick={() => setShowIdentityPopup(true)} style={{ position: 'fixed', bottom: 20, left: 20, right: 20, padding: '15px', backgroundColor: '#D4AF37', fontWeight: 'bold' }}>Next Step</button>
      )}

      {showIdentityPopup && !orderStatus && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ color: '#D4AF37' }}>Who is ordering?</h2>
          <input type="text" placeholder="Your Name" value={guestName} onChange={e => setGuestName(e.target.value)} style={{ padding: '15px', marginBottom: '10px', marginTop: '20px' }} />
          <input type="text" placeholder="Phone (Optional)" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} style={{ padding: '15px', marginBottom: '20px' }} />
          <button onClick={handleConfirmOrder} style={{ padding: '15px', backgroundColor: '#D4AF37', fontWeight: 'bold' }}>{isSubmitting ? 'Sending...' : 'Confirm Order'}</button>
        </div>
      )}

      {orderStatus && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <h2 style={{ color: '#D4AF37' }}>Order Status</h2>
          <p>Hang tight, {guestName}!</p>
          <h3 style={{ color: '#4CAF50', marginTop: '20px' }}>Current Phase: {orderStatus}</h3>
        </div>
      )}
    </div>
  );
}

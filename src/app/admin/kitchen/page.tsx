'use client';
import { useState, useEffect } from 'react';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [waiterName, setWaiterName] = useState('');
  const [pin, setPin] = useState('');
  const [isSecurelyLoggedIn, setIsSecurelyLoggedIn] = useState(false); // Changed variable to break cache

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/kitchen');
      if (res.ok) setOrders(await res.json());
    } catch(e) {}
  };

  useEffect(() => {
    if (isSecurelyLoggedIn) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 3000);
      return () => clearInterval(interval);
    }
  }, [isSecurelyLoggedIn]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/kitchen', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, waiterName })
    });
    fetchOrders(); 
  };

  const handleLogin = () => {
    if (!waiterName) return alert("Please enter your name.");
    if (pin !== '5273') return alert("Access Denied: Invalid Master PIN.");
    setIsSecurelyLoggedIn(true);
  };

  if (!isSecurelyLoggedIn) {
    return (
      <div style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Montserrat", sans-serif' }}>
        <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '16px', border: '1px solid #ef4444', textAlign: 'center', width: '90%', maxWidth: '400px', boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🔒</span>
          <h2 style={{ color: '#ef4444', margin: '0 0 20px 0' }}>Kitchen Secure Login</h2>
          <input type="text" placeholder="Enter Waiter/Chef Name" value={waiterName} onChange={(e) => setWaiterName(e.target.value)} style={{ width: '100%', padding: '15px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px', outline: 'none', textAlign: 'center' }} />
          <input type="password" placeholder="Master PIN (5273)" value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: '100%', padding: '15px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '25px', outline: 'none', textAlign: 'center', letterSpacing: '4px' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '15px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Unlock Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: '"Montserrat", sans-serif', backgroundColor: '#050505', color: '#FDFBF7', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#D4AF37', margin: 0, fontFamily: '"Cormorant Garamond", serif' }}>Kitchen Engine</h1>
          <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '5px 0 0 0' }}>Logged in as: <strong style={{ color: '#fff' }}>{waiterName}</strong></p>
        </div>
        <button onClick={() => { setIsSecurelyLoggedIn(false); setPin(''); }} style={{ padding: '10px 15px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px' }}>Logout</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {orders.length === 0 ? <p style={{ color: '#aaa' }}>No active orders in the queue.</p> : orders.map((o) => (
          <div key={o.id} style={{ backgroundColor: '#111', border: o.status === 'Pending' ? '1px solid #ef4444' : o.status === 'Ready' ? '1px solid #D4AF37' : '1px solid #333', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, color: '#D4AF37' }}>Table {o.tableNumber}</h2>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>{o.status}</span>
            </div>
            <p style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}><strong>{o.guestName}</strong></p>
            <p style={{ margin: '0 0 5px 0', color: '#aaa' }}>🍽️ {o.mealName} {o.withSalad ? '(+ Salad)' : ''}</p>
            <p style={{ margin: '0 0 15px 0', color: '#aaa' }}>🍹 {o.drinkName}</p>

            {o.status === 'Pending' && <button onClick={() => updateStatus(o.id, 'Preparing')} style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Accept & Start Cooking</button>}
            {o.status === 'Preparing' && <button onClick={() => updateStatus(o.id, 'Ready')} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Mark as Ready</button>}
            {o.status === 'Ready' && <button onClick={() => updateStatus(o.id, 'On the Way')} style={{ width: '100%', padding: '12px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Claim & Deliver</button>}
            {o.status === 'On the Way' && <p style={{ textAlign: 'center', color: '#10b981', margin: '10px 0 0 0', fontSize: '0.9rem' }}>En route by {o.deliveredBy}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

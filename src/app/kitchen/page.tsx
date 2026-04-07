'use client';
import { useState, useEffect } from 'react';

type Order = { id: string; tableNumber: string; guestName: string; mealName: string; drinkName: string; withSalad: boolean; status: string; createdAt: string; };
type VIPRequest = { id: string; tableNumber: string; guestName: string; requestType: string; status: string; createdAt: string; };

export default function KitchenDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [vipRequests, setVipRequests] = useState<VIPRequest[]>([]);
  
  // 1. GHOST LOCK CHECK
  useEffect(() => {
    const savedAuth = localStorage.getItem('ok26_kitchen_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '5273') {
      setIsAuthenticated(true);
      localStorage.setItem('ok26_kitchen_auth', 'true');
    } else {
      alert('Incorrect Kitchen PIN');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ok26_kitchen_auth');
  };

  // 2. LIVE DATA POLLING
  const fetchData = async () => {
    try {
      const [ordersRes, vipRes] = await Promise.all([ fetch('/api/orders'), fetch('/api/concierge') ]);
      const [ordersData, vipData] = await Promise.all([ ordersRes.json(), vipRes.json() ]);
      setOrders(ordersData);
      setVipRequests(vipData);
    } catch (err) { console.error("Data fetch error"); }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // 3. OPTIMISTIC UI UPDATES (Super Fast)
  const updateOrderStatus = async (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try { await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) }); } 
    catch (e) { fetchData(); /* revert on fail */ }
  };

  const handleVIPRequest = async (id: string) => {
    setVipRequests(prev => prev.filter(req => req.id !== id));
    try { await fetch('/api/concierge', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'HANDLED' }) }); } 
    catch (e) { fetchData(); }
  };

  // --- LOCK SCREEN UI ---
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontFamily: '"Montserrat", sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#111', padding: '40px', borderRadius: '12px', border: '1px solid #D4AF37', textAlign: 'center', width: '90%', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', marginBottom: '10px' }}>Kitchen Access</h2>
          <p style={{ color: '#888', marginBottom: '30px' }}>Authorized Staff Only</p>
          <input type="password" value={pinInput} onChange={e => setPinInput(e.target.value)} placeholder="Enter 4-Digit PIN" maxLength={4} style={{ width: '100%', padding: '15px', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '10px', borderRadius: '8px', border: '1px solid #D4AF37', backgroundColor: '#000', color: '#fff', marginBottom: '20px' }} />
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px', border: 'none' }}>Unlock Dashboard</button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: '"Montserrat", sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', margin: 0 }}>O'K26 Kitchen Engine</h1>
        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px' }}>Lock Terminal</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* COLUMN 1: LIVE GRILL (SENT & PLATING) */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', minHeight: '80vh' }}>
          <h2 style={{ color: '#D4AF37', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>🔥 Live Orders ({orders.filter(o => o.status === 'SENT' || o.status === 'PLATING').length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {orders.filter(o => o.status === 'SENT' || o.status === 'PLATING').map(order => (
              <div key={order.id} style={{ backgroundColor: '#000', borderLeft: `4px solid ${order.status === 'SENT' ? '#ef4444' : '#f59e0b'}`, padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#D4AF37' }}>Table {order.tableNumber}</span>
                  <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600', margin: '0 0 5px 0' }}>{order.mealName} {order.withSalad && <span style={{color: '#10b981'}}>(+ Salad)</span>}</p>
                <p style={{ color: '#888', margin: '0 0 10px 0' }}>Drink: {order.drinkName}</p>
                <p style={{ color: '#aaa', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '15px' }}>Guest: {order.guestName}</p>
                
                {order.status === 'SENT' ? (
                  <button onClick={() => updateOrderStatus(order.id, 'PLATING')} style={{ width: '100%', padding: '12px', backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px' }}>Start Plating</button>
                ) : (
                  <button onClick={() => updateOrderStatus(order.id, 'DISPATCHED')} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px' }}>Dispatch Waiter</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: VIP CONCIERGE */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', minHeight: '80vh' }}>
          <h2 style={{ color: '#60a5fa', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>🔔 VIP Requests ({vipRequests.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {vipRequests.length === 0 && <p style={{ color: '#555', textAlign: 'center', marginTop: '20px' }}>No active VIP requests.</p>}
            {vipRequests.map(req => (
              <div key={req.id} style={{ backgroundColor: '#000', borderLeft: '4px solid #60a5fa', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ color: '#60a5fa', margin: '0 0 10px 0', fontSize: '1.3rem' }}>Table {req.tableNumber}</h3>
                <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 5px 0' }}>{req.requestType}</p>
                <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '15px' }}>Requested by: {req.guestName}</p>
                <button onClick={() => handleVIPRequest(req.id)} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#60a5fa', border: '1px solid #60a5fa', borderRadius: '6px', fontWeight: 'bold' }}>Mark as Handled</button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: PENDING DELIVERIES (Override) */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', minHeight: '80vh' }}>
          <h2 style={{ color: '#10b981', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>🏃‍♂️ Pending Deliveries</h2>
          <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: '15px' }}>Orders with waiters. Use Force Complete if guest forgets to confirm.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {orders.filter(o => o.status === 'DISPATCHED').map(order => (
              <div key={order.id} style={{ backgroundColor: '#000', border: '1px solid #10b981', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', display: 'block' }}>Table {order.tableNumber}</span>
                  <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{order.guestName}</span>
                </div>
                <button onClick={() => updateOrderStatus(order.id, 'DELIVERED')} style={{ padding: '10px 15px', backgroundColor: '#10b981', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Force Complete</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Order = { id: string; tableNumber: string; guestName: string; mealName: string; drinkName: string; withSalad: boolean; status: string; deliveredBy: string | null; createdAt: string; };
type Concierge = { id: string; tableNumber: string; guestName: string; requestType: string; status: string; createdAt: string; };

export default function KitchenDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<Concierge[]>([]);
  
  // Waiter Assignment State
  const [completingOrder, setCompletingOrder] = useState<string | null>(null);
  
  // EDIT YOUR WAITER NAMES HERE
  const waitersList = ['Waiter 1', 'Waiter 2', 'Waiter 3', 'Lead Waiter'];

  useEffect(() => { if (localStorage.getItem('kitchen_auth') === 'true') setIsAuthenticated(true); }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '5273') { localStorage.setItem('kitchen_auth', 'true'); setIsAuthenticated(true); } else { alert('Invalid PIN'); }
  };

  const lockTerminal = () => { localStorage.removeItem('kitchen_auth'); setIsAuthenticated(false); };

  const fetchData = async () => {
    try {
      const oRes = await fetch('/api/orders'); if (oRes.ok) setOrders(await oRes.json());
      const cRes = await fetch('/api/concierge'); if (cRes.ok) setRequests(await cRes.json());
    } catch (err) { console.error("Database sleeping..."); }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const updateOrderStatus = async (id: string, newStatus: string, waiterName: string | null = null) => {
    await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus, deliveredBy: waiterName }) });
    setCompletingOrder(null);
    fetchData();
  };

  const updateRequestStatus = async (id: string, newStatus: string) => {
    await fetch('/api/concierge', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Montserrat", sans-serif' }}>
        <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', width: '90%', maxWidth: '400px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', fontSize: '2rem', margin: '0 0 10px 0' }}>Kitchen Engine</h1>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '30px' }}>Authorized Staff Only</p>
          <form onSubmit={login}>
            <input type="password" placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: '100%', padding: '15px', backgroundColor: '#000', border: '1px solid #D4AF37', color: '#fff', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '5px', borderRadius: '8px', marginBottom: '20px' }} autoFocus />
            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', textTransform: 'uppercase', cursor: 'pointer' }}>Unlock Terminal</button>
          </form>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'COMPLETED');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const activeRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: '"Montserrat", sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', margin: 0 }}>M'K26 Kitchen Engine</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #10b981' }}></span><p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>Live Auto-Sync Active</p></div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="/admin" style={{ padding: '10px 15px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #333', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem' }}>Hub</Link>
          <button onClick={lockTerminal} style={{ padding: '10px 15px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Lock</button>
        </div>
      </header>

      {/* WAITER ASSIGNMENT POPUP */}
      {completingOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #D4AF37', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>Who is delivering this?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {waitersList.map(name => (
                <button key={name} onClick={() => updateOrderStatus(completingOrder, 'COMPLETED', name)} style={{ padding: '15px', backgroundColor: '#333', color: '#D4AF37', border: '1px solid #555', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{name}</button>
              ))}
            </div>
            <button onClick={() => setCompletingOrder(null)} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #aaa', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* SPLIT SCREEN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        
        {/* LEFT SIDE: ACTIVE QUEUE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#b91c1c', padding: '15px', textAlign: 'center' }}><h2 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>🚨 VIP Concierge ({activeRequests.length})</h2></div>
            <div style={{ padding: '20px' }}>
              {activeRequests.length === 0 ? <p style={{ color: '#555', textAlign: 'center' }}>No active requests.</p> : activeRequests.map(req => (
                <div key={req.id} style={{ backgroundColor: '#000', border: '1px solid #ef4444', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Table {req.tableNumber}</span><span style={{ color: '#aaa', fontSize: '0.8rem' }}>{req.guestName}</span></div>
                  <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '1.2rem' }}>Needs: {req.requestType}</h3>
                  <button onClick={() => updateRequestStatus(req.id, 'RESOLVED')} style={{ width: '100%', padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Mark Resolved</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#D4AF37', padding: '15px', textAlign: 'center' }}><h2 style={{ margin: 0, color: '#000', fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>🍳 Kitchen Orders ({activeOrders.length})</h2></div>
            <div style={{ padding: '20px' }}>
              {activeOrders.length === 0 ? <p style={{ color: '#555', textAlign: 'center' }}>Kitchen is clear.</p> : activeOrders.map(order => (
                <div key={order.id} style={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '10px' }}><span style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '1.2rem' }}>Table {order.tableNumber}</span><span style={{ color: '#aaa', fontSize: '0.85rem' }}>{order.guestName}</span></div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0', color: '#fff' }}>
                    <li style={{ marginBottom: '5px' }}>🍽️ {order.mealName}</li>
                    {order.drinkName && <li style={{ marginBottom: '5px' }}>🍹 {order.drinkName}</li>}
                    {order.withSalad && <li style={{ color: '#10b981' }}>🥗 + Side Salad</li>}
                  </ul>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {order.status === 'SENT' ? (
                      <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} style={{ flex: 1, padding: '10px', backgroundColor: '#f59e0b', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Start Preparing</button>
                    ) : (
                      <button onClick={() => setCompletingOrder(order.id)} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Mark Completed</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: DELIVERY LOG & EVIDENCE */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden', height: 'fit-content' }}>
          <div style={{ backgroundColor: '#333', padding: '15px', textAlign: 'center' }}><h2 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>✅ Delivery Evidence ({completedOrders.length})</h2></div>
          <div style={{ padding: '20px', maxHeight: '700px', overflowY: 'auto' }}>
            {completedOrders.length === 0 ? <p style={{ color: '#555', textAlign: 'center' }}>No deliveries yet.</p> : completedOrders.map(order => (
              <div key={order.id} style={{ backgroundColor: '#000', borderLeft: '3px solid #10b981', borderRadius: '0 8px 8px 0', padding: '15px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Table {order.tableNumber}</span>
                  <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div style={{ color: '#E5D08F', fontSize: '0.9rem', marginBottom: '8px' }}>👤 {order.guestName}</div>
                <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '10px' }}>
                  {order.mealName} {order.drinkName ? `+ ${order.drinkName}` : ''} {order.withSalad ? '+ Salad' : ''}
                </div>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-block' }}>
                  Delivered by: <strong>{order.deliveredBy || 'Unknown'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

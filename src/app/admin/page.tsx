'use client';
import { useState, useEffect } from 'react';

type Order = { id: string; tableNumber: string; guestName: string; mealName: string; drinkName: string; withSalad: boolean; status: string; createdAt: string; };
type VIPRequest = { id: string; tableNumber: string; guestName: string; requestType: string; status: string; createdAt: string; };

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [vipRequests, setVipRequests] = useState<VIPRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const savedAuth = localStorage.getItem('ok26_admin_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '9144') {
      setIsAuthenticated(true);
      localStorage.setItem('ok26_admin_auth', 'true');
    } else {
      alert('Access Denied');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ok26_admin_auth');
  };

  const fetchData = async () => {
    try {
      const [ordersRes, vipRes] = await Promise.all([ fetch('/api/orders'), fetch('/api/concierge') ]);
      const [ordersData, vipData] = await Promise.all([ ordersRes.json(), vipRes.json() ]);
      setOrders(ordersData); setVipRequests(vipData);
    } catch (err) {}
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // --- GOD MODE CONTROLS ---
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Delete this order permanently?")) return;
    setOrders(prev => prev.filter(o => o.id !== id));
    await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
  };

  const handleEditOrder = async (id: string, currentTable: string, currentName: string) => {
    const newTable = prompt("Edit Table Number:", currentTable);
    if (newTable === null) return;
    const newName = prompt("Edit Guest Name:", currentName);
    if (newName === null) return;

    setOrders(prev => prev.map(o => o.id === id ? { ...o, tableNumber: newTable, guestName: newName } : o));
    await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, tableNumber: newTable, guestName: newName }) });
  };

  const handleNukeDatabase = async () => {
    const code = prompt("WARNING: This will delete ALL orders. Type 'CONFIRM' to proceed.");
    if (code !== 'CONFIRM') return;
    setOrders([]);
    await fetch('/api/orders?wipeAll=true', { method: 'DELETE' });
    alert("Database wiped clean.");
  };

  const filteredOrders = orders.filter(o => 
    o.tableNumber.includes(searchQuery) || o.guestName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontFamily: '"Montserrat", sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#111', padding: '40px', borderRadius: '12px', border: '1px solid #D4AF37', textAlign: 'center', width: '90%', maxWidth: '400px', boxShadow: '0 0 30px rgba(212, 175, 55, 0.1)' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', marginBottom: '10px' }}>System Admin</h2>
          <p style={{ color: '#888', marginBottom: '30px', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Restricted Access</p>
          <input type="password" value={pinInput} onChange={e => setPinInput(e.target.value)} placeholder="Enter PIN" maxLength={4} style={{ width: '100%', padding: '15px', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '10px', borderRadius: '8px', border: '1px solid #D4AF37', backgroundColor: '#000', color: '#fff', marginBottom: '20px' }} />
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px', border: 'none' }}>Authorize</button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#fff', padding: '30px', fontFamily: '"Montserrat", sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', margin: 0, fontSize: '2.5rem' }}>O'K26 Admin Powerhouse</h1>
          <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '0.9rem' }}>God Mode Authorized</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', fontWeight: 'bold' }}>Lock Console</button>
      </header>

      {/* ANALYTICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)', textAlign: 'center' }}>
          <h3 style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Total Orders</h3>
          <p style={{ color: '#D4AF37', fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{orders.length}</p>
        </div>
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
          <h3 style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Delivered</h3>
          <p style={{ color: '#10b981', fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{orders.filter(o => o.status === 'DELIVERED').length}</p>
        </div>
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid rgba(96, 165, 250, 0.2)', textAlign: 'center' }}>
          <h3 style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Pending VIP Requests</h3>
          <p style={{ color: '#60a5fa', fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{vipRequests.length}</p>
        </div>
      </div>

      {/* MASTER CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Search by Table or Name..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          style={{ width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.5)', backgroundColor: '#000', color: '#fff', fontSize: '1rem' }} 
        />
        <button onClick={handleNukeDatabase} style={{ padding: '12px 20px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 'bold', borderRadius: '6px', border: 'none', boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' }}>
          ⚠️ Wipe Database
        </button>
      </div>

      {/* THE MASTER LEDGER */}
      <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#000', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px', color: '#D4AF37' }}>Table</th>
                <th style={{ padding: '15px', color: '#D4AF37' }}>Guest Name</th>
                <th style={{ padding: '15px', color: '#D4AF37' }}>Order Details</th>
                <th style={{ padding: '15px', color: '#D4AF37' }}>Status</th>
                <th style={{ padding: '15px', color: '#D4AF37' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{order.tableNumber}</td>
                  <td style={{ padding: '15px' }}>{order.guestName}</td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{order.mealName} {order.withSalad && <span style={{color: '#10b981'}}>(+ Salad)</span>}</div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Drink: {order.drinkName}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '5px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                      backgroundColor: order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: order.status === 'DELIVERED' ? '#10b981' : '#f59e0b',
                      border: `1px solid ${order.status === 'DELIVERED' ? '#10b981' : '#f59e0b'}`
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEditOrder(order.id, order.tableNumber, order.guestName || '')} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#60a5fa', border: '1px solid #60a5fa', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteOrder(order.id)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#555' }}>No orders found in the ledger.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}

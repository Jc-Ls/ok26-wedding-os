'use client';
import { useState, useEffect } from 'react';

type Order = {
  id: string;
  tableNumber: string;
  mealName: string;
  drinkName: string;
  withSalad: boolean;
  status: string;
  createdAt: string;
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch active orders from the Neon Database
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setIsFetching(false);
    }
  };

  // Poll the database every 5 seconds so the Kitchen iPad auto-updates
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    // 1. Optimistic Update (makes the UI feel instantly snappy)
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
    
    // 2. Actually tell the database
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (err) {
      alert('Failed to update status. Please check your internet connection.');
      fetchOrders(); // refresh from db if it failed
    }
  };

  // Convert UTC database time to local readable time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isFetching) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0A142F', color: '#D4AF37', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Cinzel", serif', fontSize: '1.5rem' }}>Loading Kitchen Command...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A142F', color: '#fff', padding: '20px', fontFamily: '"Montserrat", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px' }}>
          <h1 style={{ fontFamily: '"Cinzel", serif', color: '#D4AF37' }}>Kitchen Command</h1>
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', padding: '8px 15px', borderRadius: '20px', border: '1px solid #D4AF37', fontSize: '0.9rem' }}>
            🔴 Live Orders: {orders.filter(o => o.status !== 'DISPATCHED').length}
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.filter(o => o.status !== 'DISPATCHED').map((order) => (
            <div key={order.id} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderLeft: `4px solid ${order.status === 'SENT' ? '#F44336' : '#FFEB3B'}`, borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#D4AF37', marginBottom: '5px' }}>Table {order.tableNumber}</h2>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>
                  {order.mealName} {order.withSalad && <span style={{ color: '#4CAF50', fontSize: '0.8rem', marginLeft: '5px' }}>(+ Salad)</span>}
                </p>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginTop: '4px' }}>Drink: {order.drinkName}</p>
                <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>⏱ Ordered at {formatTime(order.createdAt)}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '150px' }}>
                {order.status === 'SENT' && (
                  <button onClick={() => updateStatus(order.id, 'PLATING')} style={{ padding: '12px', backgroundColor: '#FFEB3B', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                    👨‍🍳 Start Plating
                  </button>
                )}
                {order.status === 'PLATING' && (
                  <button onClick={() => updateStatus(order.id, 'DISPATCHED')} style={{ padding: '12px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                    🏃‍♂️ Dispatch
                  </button>
                )}
              </div>

            </div>
          ))}
          {orders.filter(o => o.status !== 'DISPATCHED').length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#888', fontStyle: 'italic' }}>Kitchen is clear. Waiting for incoming orders...</div>
          )}
        </div>
      </div>
    </div>
  );
}

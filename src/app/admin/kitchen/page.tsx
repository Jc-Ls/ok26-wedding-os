'use client';
import { useState, useEffect } from 'react';

type Order = {
  id: string; tableNumber: string; guestName: string | null; guestPhone: string | null;
  mealName: string; drinkName: string; withSalad: boolean; status: string; createdAt: string;
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders(await res.json());
    } catch (err) { console.error(err); } finally { setIsFetching(false); }
  };

  useEffect(() => { fetchOrders(); const interval = setInterval(fetchOrders, 5000); return () => clearInterval(interval); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
    try {
      await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
    } catch (err) { alert('Failed to update.'); fetchOrders(); }
  };

  if (isFetching) return <div style={{ minHeight: '100vh', backgroundColor: '#0A142F', color: '#D4AF37', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A142F', color: '#fff', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1 style={{ color: '#D4AF37' }}>Kitchen Command</h1>
          <div>🔴 Live Orders: {orders.filter(o => o.status !== 'DISPATCHED').length}</div>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.filter(o => o.status !== 'DISPATCHED').map((order) => (
            <div key={order.id} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ color: '#D4AF37' }}>Table {order.tableNumber}</h2>
                <p style={{ color: '#fff', fontStyle: 'italic' }}>Guest: <span style={{ color: '#F9A8D4' }}>{order.guestName || 'Anonymous'}</span> {order.guestPhone && `(${order.guestPhone})`}</p>
                <p style={{ fontWeight: 'bold' }}>{order.mealName} {order.withSalad && <span style={{ color: '#4CAF50' }}>(+ Salad)</span>}</p>
                <p style={{ color: '#d1d5db' }}>Drink: {order.drinkName}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.status === 'SENT' && <button onClick={() => updateStatus(order.id, 'PLATING')} style={{ padding: '12px', backgroundColor: '#FFEB3B', fontWeight: 'bold' }}>👨‍🍳 Plating</button>}
                {order.status === 'PLATING' && <button onClick={() => updateStatus(order.id, 'DISPATCHED')} style={{ padding: '12px', backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold' }}>🏃‍♂️ Dispatch</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

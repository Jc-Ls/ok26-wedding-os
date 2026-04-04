'use client';
import { useState } from 'react';

// Temporary Mock Data until we wire the API in the next step
const MOCK_ORDERS = [
  { id: '1', tableNumber: '5', mealName: 'Party Jollof Rice', drinkName: 'Coca-Cola', withSalad: true, status: 'SENT', time: 'Just now' },
  { id: '2', tableNumber: '12', mealName: 'Amala + Gbegiri', drinkName: 'Pulpy Orange', withSalad: false, status: 'PLATING', time: '2 mins ago' },
];

export default function KitchenDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const updateStatus = (id: string, newStatus: string) => {
    // In final step, this will hit the API to update the database
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

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
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{order.mealName} {order.withSalad && <span style={{ color: '#4CAF50', fontSize: '0.8rem', marginLeft: '5px' }}>(+ Salad)</span>}</p>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>Drink: {order.drinkName}</p>
                <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>⏱ {order.time}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '150px' }}>
                {order.status === 'SENT' && (
                  <button onClick={() => updateStatus(order.id, 'PLATING')} style={{ padding: '12px', backgroundColor: '#FFEB3B', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    👨‍🍳 Start Plating
                  </button>
                )}
                {order.status === 'PLATING' && (
                  <button onClick={() => updateStatus(order.id, 'DISPATCHED')} style={{ padding: '12px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    🏃‍♂️ Dispatch
                  </button>
                )}
              </div>

            </div>
          ))}
          {orders.filter(o => o.status !== 'DISPATCHED').length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#888', fontStyle: 'italic' }}>No active orders right now.</div>
          )}
        </div>
      </div>
    </div>
  );
}

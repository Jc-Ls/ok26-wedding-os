'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { notifyKitchenNewOrder, notifyAdminOrderUpdate, triggerHaptic, HapticPatterns, requestNotificationPermission } from '@/lib/notifications';

type KitchenOrder = {
  id: string;
  tableNumber: string;
  guestName?: string;
  mealName?: string;
  drinkName?: string;
  withSalad?: boolean;
  status: string;
  createdAt: string;
  deliveredBy?: string;
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isSecurelyLoggedIn] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const previousOrderCountRef = useRef(0);
  const notifiedOrdersRef = useRef<Set<string>>(new Set());
  
  // Request notification permission on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const enabled = await requestNotificationPermission();
      setNotificationsEnabled(enabled);
    };
    setupNotifications();
  }, []);
  
  // Fetching data immediately on load
  useEffect(() => {
    if (isSecurelyLoggedIn) {
      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/kitchen');
          if (res.ok) {
            const newOrders = await res.json() as KitchenOrder[];
            
            // Detect new orders and send notifications
            if (newOrders.length > previousOrderCountRef.current) {
              const newOrderCount = newOrders.length - previousOrderCountRef.current;
              
              // Find which orders are new
              const existingIds = new Set(orders.map(o => o.id));
              const newOrdersList = newOrders.filter(o => !existingIds.has(o.id));
              
              // Send notification for each new order
              newOrdersList.forEach(order => {
                if (!notifiedOrdersRef.current.has(order.id)) {
                  void notifyKitchenNewOrder(
                    order.tableNumber,
                    order.mealName || 'Unknown Meal',
                    order.id
                  );
                  triggerHaptic(HapticPatterns.newOrder);
                  notifiedOrdersRef.current.add(order.id);
                  
                  console.log(`[NEW ORDER ALERT] Table ${order.tableNumber}: ${order.mealName}`);
                }
              });
            }
            
            previousOrderCountRef.current = newOrders.length;
            setOrders(newOrders);
          }
        } catch (err) {
          console.error('[KITCHEN FETCH ERROR]', err);
        }
      };
      
      fetchOrders();
      const interval = setInterval(fetchOrders, 2000); // 2 second lightning-fast polling
      return () => clearInterval(interval);
    }
  }, [isSecurelyLoggedIn, orders]);

  const updateOrderStatus = async (orderId: string, newStatus: string, waiterName?: string) => {
    try {
      const res = await fetch('/api/kitchen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus, waiterName }),
      });
      
      if (res.ok) {
        const updated = await res.json();
        void notifyAdminOrderUpdate(updated.tableNumber, newStatus, orderId);
        triggerHaptic(HapticPatterns.statusUpdate);
        console.log(`[STATUS UPDATE] Order ${orderId}: ${newStatus}`);
        setOrders(orders.map(o => o.id === orderId ? updated : o));
      }
    } catch (err) {
      console.error('[UPDATE ERROR]', err);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }} className="page-shell">
      <Link href="/admin" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 16px', textDecoration: 'none', fontSize: '0.9rem', width: 'auto' }}>
        ← Back to Hub
      </Link>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#D4AF37', marginTop: '0', marginBottom: '8px', fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem' }}>👨‍🍳 Kitchen Orders</h1>
        <p style={{ color: '#E5C07B', marginBottom: '25px', fontSize: '1rem' }}>Active orders: <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{orders.length}</span></p>
        
        {!notificationsEnabled && (
          <div style={{ background: 'rgba(249, 168, 212, 0.1)', border: '1px solid rgba(249, 168, 212, 0.4)', borderRadius: '8px', padding: '15px', marginBottom: '20px', color: '#E5C07B' }}>
            📱 Notifications are disabled. Enable in your browser settings to get alerts for new orders.
          </div>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(229, 208, 143, 0.2)' }}>
              <p style={{ fontSize: '3rem' }}>🍽️</p>
              <p style={{ color: '#aaa', fontSize: '1.1rem', marginTop: '10px' }}>No active orders</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(229, 208, 143, 0.3)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#E5C07B', fontFamily: '"Cormorant Garamond", serif' }}>Table {order.tableNumber}</h3>
                    <p style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '0.9rem' }}>Guest: {order.guestName || 'Unknown'}</p>
                    <p style={{ margin: '0', color: '#aaa', fontSize: '0.85rem' }}>Time: {new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', background: order.status === 'Completed' ? 'rgba(76, 175, 80, 0.2)' : order.status === 'On the Way' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 152, 0, 0.2)', color: order.status === 'Completed' ? '#4CAF50' : order.status === 'On the Way' ? '#2196F3' : '#FF9800' }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Details</p>
                  <p style={{ margin: '5px 0', color: '#FDFBF7', fontSize: '1rem' }}>🍲 {order.mealName || 'Unknown Meal'}</p>
                  <p style={{ margin: '5px 0', color: '#FDFBF7', fontSize: '1rem' }}>🥤 {order.drinkName || 'No Drink'}</p>
                  {order.withSalad && <p style={{ margin: '5px 0', color: '#FDFBF7', fontSize: '1rem' }}>🥗 With Salad</p>}
                  {order.deliveredBy && <p style={{ margin: '5px 0', color: '#aaa', fontSize: '0.9rem' }}>Delivered by: {order.deliveredBy}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                  <button onClick={() => updateOrderStatus(order.id, 'In Progress')} className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem', width: '100%' }}>In Progress</button>
                  <button onClick={() => updateOrderStatus(order.id, 'On the Way')} className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem', width: '100%' }}>On the Way</button>
                  <button onClick={() => updateOrderStatus(order.id, 'Completed')} className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem', width: '100%', background: '#4CAF50' }}>✓ Completed</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

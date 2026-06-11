'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type KitchenOrder = {
  id: string;
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isSecurelyLoggedIn] = useState(true);
  
  // Fetching data immediately on load
  useEffect(() => {
    if (isSecurelyLoggedIn) {
      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/kitchen');
          if (res.ok) setOrders(await res.json());
        } catch {}
      };
      fetchOrders();
      const interval = setInterval(fetchOrders, 2000); // 2 second lightning-fast polling
      return () => clearInterval(interval);
    }
  }, [isSecurelyLoggedIn]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#050505', color: '#FDFBF7', minHeight: '100vh' }}>
      <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 16px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-bright)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.3s ease' }}>
        ← Back to Hub
      </Link>
      <h1 style={{ color: '#D4AF37', marginTop: '0', fontFamily: '"Cormorant Garamond", serif' }}>Kitchen Orders</h1>
      <p>Active orders: {orders.length}</p>
    </div>
  );
}

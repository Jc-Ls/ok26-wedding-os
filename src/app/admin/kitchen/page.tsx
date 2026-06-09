'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type KitchenOrder = {
  id: string;
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isSecurelyLoggedIn] = useState(false);
  
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

  // ... (Rest of your kitchen logic remains here)
  return (
    <div style={{ padding: '20px', backgroundColor: '#050505', color: '#FDFBF7', minHeight: '100vh' }}>
       {/* UI components here */}
       <Link href="/admin">← Back to Hub</Link>
       <p>Active orders: {orders.length}</p>
    </div>
  );
}

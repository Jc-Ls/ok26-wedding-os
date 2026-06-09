'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type MenuItem = { id: string; name: string; category: string; imageUrl: string; isAvailable: boolean; };

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState({ name: '', category: 'MEAL', imageUrl: '' });
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/menu');
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchItems();
    });
  }, [fetchItems]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert("Item name is required.");
    setLoading(true);
    
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    setForm({ name: '', category: 'MEAL', imageUrl: '' }); // Reset form
    fetchItems(); // Refresh the list
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: '"Montserrat", sans-serif' }}>
      <header style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', margin: 0, fontSize: '2rem' }}>Menu Manager</h1>
          <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '5px 0 0 0' }}>Add Food & Drinks to Database</p>
        </div>
        <Link href="/admin" style={{ padding: '10px 15px', border: '1px solid #D4AF37', color: '#D4AF37', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem' }}>← Hub</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* ADD NEW ITEM FORM */}
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333', height: 'fit-content' }}>
          <h2 style={{ color: '#D4AF37', fontSize: '1.2rem', margin: '0 0 20px 0' }}>Add New Item</h2>
          <form onSubmit={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div>
              <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', marginTop: '5px', outline: 'none' }}>
                <option value="MEAL">Food / Main Course</option>
                <option value="DRINK">Beverage / Drink</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Item Name</label>
              <input type="text" placeholder="e.g. Royal Jollof Rice" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', marginTop: '5px', outline: 'none' }} required />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Image URL (Optional)</label>
              <input type="url" placeholder="Paste Cloudinary Link Here" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', marginTop: '5px', outline: 'none' }} />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
              {loading ? 'Adding to Menu...' : 'Save to Database'}
            </button>
          </form>
        </div>

        {/* CURRENT MENU LIST */}
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
          <h2 style={{ color: '#D4AF37', fontSize: '1.2rem', margin: '0 0 20px 0' }}>Live Menu Preview ({items.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
            {items.length === 0 ? <p style={{ color: '#555', fontSize: '0.9rem' }}>No items in database. The app is currently using the Fallback Menu.</p> : items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#000', border: '1px solid #222', borderRadius: '8px', padding: '10px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '6px', backgroundImage: `url(${item.imageUrl || 'https://via.placeholder.com/50'})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid #333' }} />
                <div style={{ marginLeft: '15px' }}>
                  <h4 style={{ margin: '0 0 3px 0', color: '#fff', fontSize: '0.95rem' }}>{item.name}</h4>
                  <span style={{ fontSize: '0.65rem', color: item.category === 'MEAL' ? '#f59e0b' : '#3b82f6', border: `1px solid ${item.category === 'MEAL' ? '#f59e0b' : '#3b82f6'}`, padding: '2px 6px', borderRadius: '4px' }}>{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

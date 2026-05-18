'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type MenuItem = { id: string; name: string; category: string; imageUrl: string; isAvailable: boolean; };

export default function AdminMenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState({ name: '', category: 'MEAL', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMsg('Failed to load menu. Database might be waking up.');
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setForm({ name: '', category: 'MEAL', imageUrl: '' });
      fetchItems();
    } catch (err) {
      setErrorMsg('Failed to add item.');
    }
    setLoading(false);
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    await fetch('/api/menu', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isAvailable: !currentStatus }) });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    if(!confirm("Delete this item?")) return;
    await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: '"Montserrat", sans-serif' }}>
      <style>{`
        .responsive-grid { display: grid; grid-template-columns: 1fr; gap: 30px; }
        @media (min-width: 768px) { .responsive-grid { grid-template-columns: 1fr 2fr; } }
      `}</style>

      <header style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#D4AF37', margin: 0 }}>O'K26 Menu Manager</h1>
          <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '5px 0 0 0' }}>Add or modify Gala selections</p>
        </div>
        <Link href="/admin" style={{ padding: '8px 15px', backgroundColor: 'transparent', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Hub
        </Link>
      </header>

      {errorMsg && <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{errorMsg}</div>}

      <div className="responsive-grid">
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333', height: 'fit-content' }}>
          <h2 style={{ color: '#D4AF37', fontSize: '1.2rem', marginBottom: '20px' }}>Add New Item</h2>
          <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Item Name (e.g., Amala & Ewedu)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ padding: '12px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ padding: '12px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px' }}>
              <option value="MEAL">Main Meal</option>
              <option value="DRINK">Beverage</option>
            </select>
            <input type="text" placeholder="Cloudinary Secure URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} style={{ padding: '12px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
            <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{loading ? 'Adding...' : 'Add to Menu'}</button>
          </form>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {items.map(item => (
            <div key={item.id} style={{ backgroundColor: '#111', border: `1px solid ${item.isAvailable ? '#D4AF37' : '#ef4444'}`, borderRadius: '12px', overflow: 'hidden', opacity: item.isAvailable ? 1 : 0.5 }}>
              {item.imageUrl ? <div style={{ height: '120px', backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} /> : <div style={{ height: '120px', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>No Image</div>}
              <div style={{ padding: '15px' }}>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#333', padding: '3px 8px', borderRadius: '4px', color: '#aaa' }}>{item.category}</span>
                <h3 style={{ margin: '10px 0', fontSize: '1.1rem', color: '#fff' }}>{item.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                  <button onClick={() => toggleAvailability(item.id, item.isAvailable)} style={{ padding: '6px 10px', fontSize: '0.8rem', backgroundColor: item.isAvailable ? '#ef4444' : '#10b981', color: '#fff', border: 'none', borderRadius: '4px' }}>{item.isAvailable ? 'Sold Out' : 'Available'}</button>
                  <button onClick={() => deleteItem(item.id)} style={{ padding: '6px 10px', fontSize: '0.8rem', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px' }}>Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

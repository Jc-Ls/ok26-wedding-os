'use client';

import { useState, useMemo, useEffect } from 'react';

const MENU_ITEMS = [
  { id: 'm1', name: 'Pounded Yam + Egusi', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=200&q=80' },
  { id: 'm2', name: 'Pounded Yam + Efo-riro', category: 'Swallows', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80' },
  { id: 'm3', name: 'Amala + Gbegiri', category: 'Swallows', img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=200&q=80' },
  { id: 'm4', name: 'Amala + Ewedu', category: 'Swallows', img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=200&q=80' },
  { id: 'm5', name: 'Amala + Abula', category: 'Swallows', img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=200&q=80' },
  { id: 'm6', name: 'Semo + Ewedu', category: 'Swallows', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=200&q=80' },
  { id: 'r1', name: 'Party Jollof Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80' },
  { id: 'r2', name: 'Fried Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=200&q=80' },
  { id: 'r3', name: 'Jollof + Fried Rice', category: 'Rice', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80' },
  { id: 'r4', name: 'White Rice + Beans', category: 'Rice', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=200&q=80' },
  { id: 'd1', name: 'Coca-Cola', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 'd2', name: 'Fanta', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 'd3', name: 'Pulpy Orange', category: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 'd4', name: 'Premium Red Wine', category: 'Wine', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=200&q=80' },
];

export default function MenuPage() {
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [includeSalad, setIncludeSalad] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTableNumber(params.get('table'));
  }, []);

  const categories = ['All', 'Swallows', 'Rice', 'Drinks', 'Wine'];

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All' || item.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const isRiceSelected = selectedMeal && MENU_ITEMS.find(i => i.id === selectedMeal)?.category === 'Rice';

  if (tableNumber === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw', padding: '24px', textAlign: 'center', backgroundColor: 'var(--navy-bg)' }}>
        <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', color: 'var(--gold-bright)', marginBottom: '16px' }}>Table Code Missing</h1>
        <p style={{ color: '#d1d5db' }}>Please scan the barcode located on your table using your phone's camera to access the menu and place your order.</p>
        <a href="/" style={{ marginTop: '32px', color: 'var(--gold-base)', border: '1px solid var(--gold-base)', padding: '8px 24px', borderRadius: '4px', textDecoration: 'none' }}>Return Home</a>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', maxWidth: '100%', minHeight: '100vh', backgroundColor: 'var(--navy-bg)', paddingBottom: '128px', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '30px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 20, 47, 0.95)', zIndex: 0 }}></div>
        
        <nav style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '800px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontFamily: '"Cinzel", serif', fontSize: '1.5rem', color: 'var(--gold-base)', fontWeight: 'bold', textDecoration: 'none' }}>O'K26</a>
          <div style={{ fontSize: '0.85rem', color: '#fff', background: 'rgba(249, 168, 212, 0.15)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--pink-accent)' }}>
            Table {tableNumber}
          </div>
        </nav>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px', marginTop: '10px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
            Welcome to the wedding ceremony of
          </p>
          
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: 'var(--gold-bright)', lineHeight: '1.2', marginBottom: '20px', width: '100%' }}>
            <span style={{ display: 'block', fontSize: 'clamp(2.5rem, 10vw, 3.5rem)' }}>
              Muhammed <br className="mobile-break" style={{ display: 'none' }} />
              <i style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', color: 'var(--pink-accent)', whiteSpace: 'nowrap' }}>(Omokayode)</i>
            </span>
            <span style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(1.5rem, 6vw, 2rem)', display: 'block', margin: '10px 0' }}>&</span>
            <span style={{ display: 'block', fontSize: 'clamp(2.5rem, 10vw, 3.5rem)' }}>
              Kaothar <br className="mobile-break" style={{ display: 'none' }} />
              <i style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', color: 'var(--pink-accent)', whiteSpace: 'nowrap' }}>(Oyindamola)</i>
            </span>
          </h1>
          
          <p style={{ fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', color: 'var(--gold-base)', maxWidth: '28rem', fontStyle: 'italic', lineHeight: '1.6' }}>
            To serve you seamlessly, please use this digital menu to place your order directly to our kitchen. Browse the options below and choose with love and happiness.
          </p>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 16px', marginTop: '24px' }}>
        <p style={{ fontSize: '0.75rem', textAlign: 'center', fontStyle: 'italic', color: 'rgba(212, 175, 55, 0.8)', marginBottom: '24px', padding: '0 10px' }}>
          * All meals are served with assorted premium proteins based on kitchen availability.
        </p>

        {/* 2. SEARCH BAR */}
        <div style={{ marginBottom: '24px' }}>
          <input 
            type="text" 
            placeholder="Search for a meal or drink..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#fff', padding: '14px 16px', borderRadius: '8px', outline: 'none', fontSize: '1rem' }}
          />
        </div>

        {/* 3. STICKY CATEGORY TABS */}
        <div className="no-scrollbar" style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'rgba(10, 20, 47, 0.95)', backdropFilter: 'blur(8px)', padding: '16px 0', marginBottom: '24px', overflowX: 'auto', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ display: 'flex', gap: '10px', padding: '0 4px' }}>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '8px 18px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', transition: 'all 0.3s', cursor: 'pointer', flexShrink: 0,
                  backgroundColor: activeTab === cat ? 'var(--gold-base)' : 'transparent',
                  color: activeTab === cat ? '#000' : '#9ca3af',
                  border: activeTab === cat ? 'none' : '1px solid #4b5563'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. MENU LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredMenu.map((item) => {
            const isMeal = item.category === 'Swallows' || item.category === 'Rice';
            const isSelected = isMeal ? selectedMeal === item.id : selectedDrink === item.id;

            return (
              <div key={item.id}>
                {/* Fixed Layout to guarantee radio button and text fit */}
                <label className={`menu-item-card ${isSelected ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', border: `1px solid ${isSelected ? 'var(--gold-base)' : 'rgba(255,255,255,0.1)'}`, backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', width: '100%' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingRight: '15px' }}>
                    <input 
                      type="radio" 
                      name={isMeal ? "meal" : "drink"} 
                      checked={isSelected}
                      onChange={() => isMeal ? setSelectedMeal(item.id) : setSelectedDrink(item.id)}
                      style={{ width: '22px', height: '22px', marginRight: '12px', flexShrink: 0, accentColor: 'var(--gold-base)' }}
                    />
                    <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem', lineHeight: '1.4', textTransform: 'uppercase', wordBreak: 'break-word' }}>
                      {item.name}
                    </span>
                  </div>

                  <div style={{ width: '70px', height: '70px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </label>

                {/* Conditional Salad Toggle for Rice */}
                {isMeal && isSelected && item.category === 'Rice' && (
                  <div style={{ marginLeft: '45px', marginTop: '8px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: '#d1d5db' }}>Include Coleslaw/Salad?</span>
                    <input 
                      type="checkbox" 
                      checked={includeSalad} 
                      onChange={(e) => setIncludeSalad(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--gold-base)' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FLOATING ORDER BUTTON */}
      {(selectedMeal || selectedDrink) && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '16px', backgroundColor: 'rgba(10, 20, 47, 0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(212, 175, 55, 0.3)', zIndex: 30 }}>
          <button style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block', backgroundColor: 'var(--gold-base)', color: '#000', fontWeight: 'bold', padding: '18px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '2px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(212,175,55,0.3)', fontSize: '1rem' }}>
            Place Your Order
          </button>
        </div>
      )}
    </div>
  );
}

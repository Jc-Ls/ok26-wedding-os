'use client';

import { useState, useMemo, useEffect } from 'react';

// Mock Data for the Menu
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
  
  // State for selections
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [includeSalad, setIncludeSalad] = useState(false);

  // URL checking for Table Number
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTableNumber(params.get('table'));
  }, []);

  const categories = ['All', 'Swallows', 'Rice', 'Drinks', 'Wine'];

  // Instant Search & Filter Logic
  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All' || item.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const isRiceSelected = selectedMeal && MENU_ITEMS.find(i => i.id === selectedMeal)?.category === 'Rice';

  // If they somehow get here without scanning a table code
  if (tableNumber === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#111]">
        <h1 className="text-3xl font-serif text-[#E5C07B] mb-4">Table Code Missing</h1>
        <p className="text-gray-300">Please scan the barcode located on your table using your phone's camera to access the menu and place your order.</p>
        <a href="/" className="mt-8 text-[#D4AF37] border border-[#D4AF37] px-6 py-2 rounded">Return Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] pb-32">
      {/* 1. HERO SECTION */}
      <div className="relative h-[35vh] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Navigation */}
        <nav className="relative z-10 w-full p-4 flex justify-between items-center">
          <a href="/" className="logo text-2xl" style={{ textDecoration: 'none' }}>O'K26</a>
          <div className="live-counter">Table {tableNumber}</div>
        </nav>

        {/* Intro Copy */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 -mt-8">
          <h1 className="text-3xl font-serif text-[#E5C07B] mb-2 font-bold">Reception Menu</h1>
          <p className="text-sm text-gray-300 max-w-md">
            Welcome! To serve you seamlessly, please use this digital menu to place your order directly to our kitchen. Browse the options below and choose with love and happiness.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        {/* Disclaimer */}
        <p className="text-xs text-center italic text-[#D4AF37]/80 mb-6">
          * All meals are served with assorted premium proteins based on kitchen availability.
        </p>

        {/* 2. SEARCH BAR */}
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search for a meal or drink..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#D4AF37]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#E5C07B]"
          />
        </div>

        {/* 3. STICKY CATEGORY TABS */}
        <div className="sticky top-0 z-20 bg-[#111]/95 backdrop-blur py-4 mb-6 overflow-x-auto whitespace-nowrap border-b border-[#D4AF37]/20 no-scrollbar">
          <div className="flex gap-3">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold tracking-wider uppercase transition-all ${activeTab === cat ? 'bg-[#D4AF37] text-black' : 'bg-transparent text-gray-400 border border-gray-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. MEAL LIST (IMAGE ON RIGHT, TEXT ON LEFT) */}
        <div className="space-y-4">
          {filteredMenu.map((item) => {
            const isMeal = item.category === 'Swallows' || item.category === 'Rice';
            const isSelected = isMeal ? selectedMeal === item.id : selectedDrink === item.id;

            return (
              <div key={item.id}>
                <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-[#E5C07B] bg-[#E5C07B]/10' : 'border-gray-800 bg-[#1a1a1a]/50'}`}>
                  
                  <div className="flex items-center gap-4 flex-1">
                    {/* Radio Button */}
                    <input 
                      type="radio" 
                      name={isMeal ? "meal" : "drink"} 
                      checked={isSelected}
                      onChange={() => isMeal ? setSelectedMeal(item.id) : setSelectedDrink(item.id)}
                      className="w-5 h-5 accent-[#D4AF37]"
                    />
                    <span className="font-bold text-gray-200">{item.name}</span>
                  </div>

                  {/* Food Image */}
                  <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden ml-4 shrink-0 shadow-lg">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </label>

                {/* Conditional Salad Toggle for Rice */}
                {isMeal && isSelected && item.category === 'Rice' && (
                  <div className="ml-12 mt-2 p-3 bg-black/40 rounded-lg border border-gray-800 flex items-center justify-between">
                    <span className="text-sm text-gray-300">Include Coleslaw/Salad?</span>
                    <input 
                      type="checkbox" 
                      checked={includeSalad} 
                      onChange={(e) => setIncludeSalad(e.target.checked)}
                      className="w-5 h-5 accent-[#D4AF37]"
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
        <div className="fixed bottom-0 left-0 w-full p-4 bg-[#111]/90 backdrop-blur-md border-t border-[#D4AF37]/30 z-30">
          <button className="w-full max-w-2xl mx-auto block bg-[#D4AF37] text-black font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] uppercase tracking-widest transition-transform active:scale-95">
            Proceed with Order
          </button>
        </div>
      )}
    </div>
  );
}

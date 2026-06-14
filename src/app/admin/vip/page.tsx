'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function VIPGenerator() {
  const [count, setCount] = useState(1000);
  const [status, setStatus] = useState('');
  const [codes, setCodes] = useState<string[]>([]);

  const generateCodes = async () => {
    setStatus('Generating...');
    setCodes([]);
    try {
      const res = await fetch('/api/admin/generate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      const data = await res.json();
      if (data.success) {
        setCodes(data.codes);
        setStatus(`✅ Successfully generated ${data.total} codes!`);
      } else {
        setStatus('❌ Error generating codes.');
      }
    } catch (err) { 
      setStatus('❌ Error generating codes.'); 
    }
  };

  const exportToCSV = () => {
    if (codes.length === 0) {
      setStatus('❌ No codes to export. Generate codes first!');
      return;
    }
    
    const csvContent = 'RESERVATION_CODE\n' + codes.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MK26-VIP-Codes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('✅ CSV exported successfully!');
  };

  const copyToClipboard = () => {
    if (codes.length === 0) return;
    navigator.clipboard.writeText(codes.join('\n'));
    setStatus('✅ Codes copied to clipboard!');
  };

  const saveToLocalStorage = () => {
    if (codes.length === 0) {
      setStatus('❌ No codes to save!');
      return;
    }
    localStorage.setItem('mk26_vip_codes', JSON.stringify(codes));
    setStatus(`✅ ${codes.length} codes saved to local storage!`);
  };

  const fetchAllCodes = async () => {
    setStatus('Fetching all codes...');
    setCodes([]);
    try {
      const res = await fetch('/api/admin/generate-codes');
      const data = await res.json();
      if (data.success) {
        setCodes(data.codes);
        setStatus(`✅ Loaded ${data.total} unused codes from database!`);
      } else {
        setStatus('❌ Error fetching codes.');
      }
    } catch (err) {
      setStatus('❌ Error fetching codes.');
    }
  };

  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Montserrat", sans-serif', backgroundColor: '#050505', color: '#FDFBF7', minHeight: '100vh' }}>
      <h1 style={{ color: '#D4AF37', fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', textAlign: 'center' }}>VIP Code Manager</h1>
      <p style={{ color: '#aaa', marginBottom: '40px', textAlign: 'center' }}>Generate, export, and manage MK26 access passes.</p>
      
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Generate Section */}
        <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
          <h2 style={{ color: '#D4AF37', marginBottom: '20px' }}>Generate New Codes</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <input 
              type="number" 
              min="1" 
              max="2000"
              value={count} 
              onChange={(e) => setCount(Math.min(2000, Math.max(1, Number(e.target.value))))} 
              style={{ flex: 1, minWidth: '150px', padding: '15px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', outline: 'none', fontSize: '1rem' }} 
            />
            <button onClick={generateCodes} style={{ padding: '15px 30px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
              Generate
            </button>
          </div>
          {status && <p style={{ color: status.includes('✅') ? '#10b981' : '#ef4444', marginTop: '10px' }}>{status}</p>}
        </div>

        {/* Actions Section */}
        {codes.length > 0 && (
          <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
            <h2 style={{ color: '#D4AF37', marginBottom: '20px' }}>Export Options ({codes.length} codes)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <button onClick={exportToCSV} style={{ padding: '15px', backgroundColor: '#10b981', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                📥 Download CSV
              </button>
              <button onClick={copyToClipboard} style={{ padding: '15px', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                📋 Copy to Clipboard
              </button>
              <button onClick={saveToLocalStorage} style={{ padding: '15px', backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                💾 Save Locally
              </button>
            </div>
          </div>
        )}

        {/* Fetch All Codes */}
        <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' }}>
          <h2 style={{ color: '#D4AF37', marginBottom: '20px' }}>Database Actions</h2>
          <button onClick={fetchAllCodes} style={{ padding: '15px 30px', backgroundColor: '#8b5cf6', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            📊 Load All Unused Codes
          </button>
        </div>

        {/* Code Preview */}
        {codes.length > 0 && (
          <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h2 style={{ color: '#D4AF37', marginBottom: '20px' }}>Preview ({codes.slice(0, 10).length}/{codes.length})</h2>
            <div style={{ backgroundColor: '#000', padding: '20px', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.9rem', color: '#10b981' }}>
              {codes.slice(0, 10).map((code, i) => <div key={i}>{code}</div>)}
              {codes.length > 10 && <div style={{ color: '#aaa', marginTop: '10px' }}>... and {codes.length - 10} more</div>}
            </div>
          </div>
        )}
      </div>

      <Link href="/admin" style={{ display: 'inline-block', marginTop: '40px', color: '#D4AF37', textDecoration: 'none', borderBottom: '1px solid #D4AF37' }}>← Back to Hub</Link>
    </div>
  );
}

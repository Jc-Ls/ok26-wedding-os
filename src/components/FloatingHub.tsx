'use client';

import { useState } from 'react';

const LIVE_STREAM_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

function ChatAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ from: 'user' | 'assistant'; text: string }[]>([]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user' as const, text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    // lightweight stubbed assistant reply
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'assistant', text: `Thanks — I can help with schedule, directions, RSVP, menu, and gifts. For example: '${userMsg.text}'` }]);
    }, 600);
  };

  return (
    <div className="tracker-overlay" role="dialog" aria-modal="true" style={{ zIndex: 200 }}>
      <div className="tracker-card" style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>AI Wedding Assistant</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: '#E5D08F', fontWeight: 700 }}>
            Close
          </button>
        </div>
        <div style={{ marginTop: 16, maxHeight: 320, overflow: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 10, textAlign: m.from === 'user' ? 'right' : 'left' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: m.from === 'user' ? 'rgba(229,208,143,0.9)' : 'rgba(255,255,255,0.06)',
                  color: m.from === 'user' ? '#000' : '#e6e6e6',
                  padding: '8px 12px',
                  borderRadius: 10,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the schedule, RSVP, or gifts"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: '1px solid rgba(229,208,143,0.15)',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
            }}
          />
          <button onClick={send} className="btn-primary" type="button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FloatingHub() {
  const [showHub, setShowHub] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);

  const quickActions = [
    { label: 'AI Wedding Assistant', href: null },
    { label: 'Watch Live', href: '/live' },
    { label: 'Get Directions', href: '#schedule' },
    { label: 'Contact Support', href: '#footer' },
  ];

  return (
    <>
      {/* Floating Hub Button */}
      <div
        className={`floating-hub ${showHub ? 'open' : ''}`}
        style={{
          position: 'fixed',
          bottom: 'max(20px, env(safe-area-inset-bottom))',
          right: '20px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-end',
        }}
      >
        <button
          type="button"
          className="hub-toggle"
          onClick={() => setShowHub((value) => !value)}
          aria-expanded={showHub}
          aria-label="Open quick actions"
          style={{
            padding: '12px 20px',
            background: 'rgba(229, 208, 143, 0.95)',
            color: '#000',
            border: 'none',
            borderRadius: '999px',
            fontWeight: 700,
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 8px 24px rgba(229, 208, 143, 0.2)',
          }}
        >
          {showHub ? 'Close' : 'Quick Actions'}
        </button>

        {showHub && (
          <div
            className="hub-menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: 'rgba(10, 20, 47, 0.95)',
              border: '1px solid rgba(229, 208, 143, 0.15)',
              borderRadius: '12px',
              padding: '12px',
              backdropFilter: 'blur(10px)',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {quickActions.map((item) =>
              item.href === null ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setShowAssistantModal(true)}
                  className="hub-link"
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    border: '1px solid rgba(229, 208, 143, 0.12)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(229, 208, 143, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(229, 208, 143, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(229, 208, 143, 0.12)';
                  }}
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="hub-link"
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    border: '1px solid rgba(229, 208, 143, 0.12)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'block',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(229, 208, 143, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(229, 208, 143, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(229, 208, 143, 0.12)';
                  }}
                >
                  {item.label}
                </a>
              )
            )}
            <a
              href={LIVE_STREAM_URL}
              target="_blank"
              rel="noreferrer"
              className="hub-link"
              style={{
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#fff',
                border: '1px solid rgba(229, 208, 143, 0.12)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'block',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(229, 208, 143, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(229, 208, 143, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(229, 208, 143, 0.12)';
              }}
            >
              Live Stream
            </a>
          </div>
        )}
      </div>

      {/* Chat Assistant Modal */}
      {showAssistantModal && <ChatAssistant onClose={() => setShowAssistantModal(false)} />}
    </>
  );
}

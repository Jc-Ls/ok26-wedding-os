'use client';
import { useEffect, useState } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ coupleName1, coupleName2, weddingDate, onDismiss }) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleDismiss = () => {
    setIsLeaving(true);
  };

  useEffect(() => {
    const autoDismiss = setTimeout(() => setIsLeaving(true), 7000);
    return () => clearTimeout(autoDismiss);
  }, []);

  useEffect(() => {
    if (!isLeaving) return undefined;
    const exitTimer = setTimeout(() => {
      if (typeof onDismiss === 'function') onDismiss();
    }, 600);
    return () => clearTimeout(exitTimer);
  }, [isLeaving, onDismiss]);

  const petals = [
    { x: '8%', delay: '0s', size: '0.85rem', hue: 15 },
    { x: '18%', delay: '0.6s', size: '0.7rem', hue: 25 },
    { x: '28%', delay: '1.2s', size: '0.95rem', hue: 5 },
    { x: '42%', delay: '0.9s', size: '0.75rem', hue: 10 },
    { x: '55%', delay: '0.4s', size: '0.9rem', hue: 20 },
    { x: '66%', delay: '1.1s', size: '0.8rem', hue: 12 },
    { x: '75%', delay: '0.2s', size: '0.7rem', hue: 28 },
    { x: '85%', delay: '1.5s', size: '0.9rem', hue: 22 },
    { x: '92%', delay: '0.8s', size: '0.8rem', hue: 18 },
  ];

  return (
    <div className={`wedding-splash-shell ${isLeaving ? 'is-leaving' : ''}`}>
      <div className="wedding-splash-panel">
        <div className="wedding-splash-stage" aria-hidden="true">
          <div className="wedding-ring ring-a" />
          <div className="wedding-ring ring-b" />
          <div className="wedding-ring-glow" />
        </div>

        <div className="wedding-splash-copy">
          <p className="wedding-splash-eyebrow">Welcome to Our Royal Celebration</p>
          <h1 className="wedding-splash-heading">
            {coupleName1} &amp; {coupleName2}
          </h1>
          <p className="wedding-splash-subtitle">{weddingDate}</p>
          <p className="wedding-splash-message">We are honored to celebrate with you. Your presence means everything to us, and we look forward to creating unforgettable memories together.</p>
          <button type="button" className="wedding-splash-button" onClick={handleDismiss}>
            Enter the Celebration
          </button>
        </div>

        <div className="wedding-petal-layer">
          {petals.map((petal, index) => (
            <span
              key={index}
              className="wedding-petal"
              style={{
                left: petal.x,
                animationDelay: petal.delay,
                width: petal.size,
                height: petal.size,
                background: `hsla(${petal.hue}, 75%, 70%, 0.82)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

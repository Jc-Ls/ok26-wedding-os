'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import TiltCard from '../components/TiltCard';

const broadcastSteps = [
  { label: 'Pre-show check', description: 'Camera, audio, and VIP stream readiness.', status: 'active' },
  { label: 'Welcome op', description: 'Opening broadcast with live host and guest overlay.', status: 'upcoming' },
  { label: 'Main ceremony', description: 'Premium ceremony coverage with immersive depth.', status: 'upcoming' },
  { label: 'After-show lounge', description: 'Post-event highlights and celebration recap.', status: 'upcoming' },
];

const livestreamHighlights = [
  { title: 'Broadcast stage', detail: 'Premium frame with layered depth, on-air treatment, and motion highlights.' },
  { title: 'AI host assistant', detail: 'An intelligent event guide with curated guest commentary and schedule cues.' },
  { title: 'Live guest journey', detail: 'Interactive progress steps and premium VIP navigation through the feed.' },
];

export default function LivestreamPage() {
  const { scrollY } = useScroll();
  const heroGlow = useTransform(scrollY, [0, 500], [0.08, 0.22]);
  const panelFloat = useTransform(scrollY, [0, 500], [24, -12]);

  return (
    <main className="livestream-shell">
      <motion.section
        className="livestream-hero"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="livestream-copy">
          <span className="eyebrow">Livestream</span>
          <h1>Immersive broadcast for invited guests</h1>
          <p>
            Experience the live celebration with broadcast-style framing, subtle parallax layers, and a premium digital lounge for gala viewers.
          </p>
          <div className="livestream-buttons">
            <Link href="/reservations" className="btn-primary">
              Reserve Seat
            </Link>
            <Link href="/meet-the-couple" className="btn-secondary">
              Meet the Couple
            </Link>
          </div>
        </div>

        <motion.div className="livestream-visuals" style={{ y: panelFloat, opacity: heroGlow }}>
          <div className="livestream-visuals-float" />
          <div className="broadcast-stage">
            <div className="broadcast-header">
              <div className="broadcast-status">
                <span className="live-dot" /> On Air
              </div>
              <div className="broadcast-tags">
                <span>AI assistant</span>
                <span>Studio feed</span>
              </div>
            </div>
            <div className="broadcast-screen" aria-hidden="true">
              <div className="broadcast-layer broadcast-layer-back" />
              <div className="broadcast-layer broadcast-layer-mid" />
              <div className="broadcast-layer broadcast-layer-front" />
              <div className="broadcast-hud">
                <div>
                  <strong>Scene:</strong> Ceremony highlights
                </div>
                <div>
                  <strong>Host:</strong> Aṣa
                </div>
              </div>
            </div>
            <div className="broadcast-footer">
              <div>
                <p>Live stream access opens on event day with premium guest controls.</p>
              </div>
              <div className="broadcast-chip">VIP only</div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="livestream-grid">
        {livestreamHighlights.map((item, index) => (
          <TiltCard key={item.title} className="livestream-card" style={{ borderRadius: 14 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <p className="eyebrow">{item.title}</p>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
            </motion.div>
          </TiltCard>
        ))}
      </section>

      <section className="livestream-timeline">
        <div className="section-heading">
          <span>On air journey</span>
          <h2>Modern broadcast flow</h2>
        </div>

        <div className="timeline-shell">
          <div className="timeline-line" />
          {broadcastSteps.map((step, index) => (
            <motion.div
              key={step.label}
              className={`timeline-step ${step.status}`}
              initial={{ opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="timeline-marker">
                <span>{index + 1}</span>
              </div>
              <div className="timeline-copy">
                <h3>{step.label}</h3>
                <p>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="livestream-actions">
        <motion.div
          className="livestream-action-panel"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="eyebrow">Immersive view</p>
            <h2>Return on event day for the premium broadcast portal</h2>
            <p>
              The livestream experience is designed for a sharper, more kinetic interface with layered depth and guest-level controls.
            </p>
          </div>
          <div className="livestream-action-buttons">
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
            <Link href="/reservations" className="btn-primary">
              Reserve a Seat
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

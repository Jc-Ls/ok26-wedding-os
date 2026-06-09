'use client';
import Link from 'next/link';

export default function SponsorBanner() {
  return (
    <section className="sponsor-banner">
      <div className="sponsor-card">
        <div>
          <span className="eyebrow">Sponsor Spotlight</span>
          <h2>BABA-K TICKETHUB</h2>
          <p>Premium booking and celebration support powered across the entire wedding experience.</p>
        </div>
        <Link href="/itinerary" className="btn-sponsor">
          Discover the BABA-K Experience
        </Link>
      </div>
    </section>
  );
}

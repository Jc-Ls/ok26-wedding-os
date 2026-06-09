'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const journey = [
  { label: 'Couple', href: '/meet-the-couple' },
  { label: 'Family', href: '/meet-the-olowojares' },
  { label: 'Guests', href: '/special-guests' },
  { label: 'Traditions', href: '/traditions' },
  { label: 'Organisers', href: '/organisers' },
  { label: 'RSVP', href: '/reservations' },
];

export default function JourneyRail() {
  const pathname = usePathname();
  const activeIndex = journey.findIndex((item) => pathname === item.href);

  if (activeIndex < 0) return null;

  return (
    <nav className="journey-rail" aria-label="Guest journey">
      {journey.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`journey-step ${index === activeIndex ? 'active' : ''} ${index < activeIndex ? 'complete' : ''}`}
          aria-current={index === activeIndex ? 'page' : undefined}
        >
          <span>{index + 1}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

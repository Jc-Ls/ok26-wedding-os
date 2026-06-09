'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingHub() {
  const pathname = usePathname();
  const isStaffSurface = pathname.startsWith('/admin') || pathname.startsWith('/kitchen');

  if (isStaffSurface) return null;

  return (
    <details className="floating-hub">
      <summary className="hub-toggle">
        <span className="hub-orb" />
        AI Assistant
      </summary>
      <div className="hub-menu">
        <p className="hub-title">Guest command center</p>
        <Link href="/livestream" className="hub-link">
          Livestream
        </Link>
        <Link href="/reservations" className="hub-link">
          Reservations
        </Link>
      </div>
    </details>
  );
}

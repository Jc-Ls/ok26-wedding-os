'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SponsorBanner from './SponsorBanner';

interface PageFooterProps {
  previousHref?: string;
  previousLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}

const pageSequence = [
  { href: '/', label: 'Home' },
  { href: '/meet-the-couple', label: 'Meet the Couple' },
  { href: '/meet-the-olowojares', label: 'Meet the Family' },
  { href: '/honorees', label: 'Honorees' },
  { href: '/special-guests', label: 'Special Guests' },
  { href: '/traditions', label: 'Traditions' },
  { href: '/organisers', label: 'Organisers' },
  { href: '/itinerary', label: 'Itinerary' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/menu', label: 'Menu' },
  { href: '/menu-gate', label: 'Menu Gate' },
  { href: '/live', label: 'Live' },
  { href: '/scan', label: 'Scan' },
  { href: '/vault', label: 'Vault' },
  //{ href: '/kitchen', label: 'Kitchen' },
];

export default function PageFooter({
  previousHref,
  previousLabel = 'Previous Page',
  nextHref,
  nextLabel = 'Next Page',
}: PageFooterProps) {
  const pathname = usePathname();

  const { resolvedPreviousHref, resolvedPreviousLabel, resolvedNextHref, resolvedNextLabel } = useMemo(() => {
    const normalizedPath = pathname?.replace(/\/+$/, '') || '/';
    const activeIndex = pageSequence.findIndex((page) => page.href === normalizedPath);
    const previousPage = pageSequence[activeIndex - 1];
    const nextPage = pageSequence[activeIndex + 1];

    return {
      resolvedPreviousHref: previousHref ?? previousPage?.href,
      resolvedPreviousLabel: previousHref ? previousLabel : previousPage?.label ?? previousLabel,
      resolvedNextHref: nextHref ?? nextPage?.href,
      resolvedNextLabel: nextHref ? nextLabel : nextPage?.label ?? nextLabel,
    };
  }, [pathname, previousHref, previousLabel, nextHref, nextLabel]);

  if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return null;
  }

  if (!resolvedPreviousHref && !resolvedNextHref) {
    return null;
  }

  return (
    <footer id="footer" className="page-footer">
      <div className="page-navigation">
        <div className="nav-button previous">
          {resolvedPreviousHref ? (
            <Link href={resolvedPreviousHref} className="btn-nav">
              ← {resolvedPreviousLabel}
            </Link>
          ) : (
            <button className="btn-nav disabled" disabled>
              ← {resolvedPreviousLabel}
            </button>
          )}
        </div>
        <div className="nav-button next">
          {resolvedNextHref ? (
            <Link href={resolvedNextHref} className="btn-nav">
              {resolvedNextLabel} →
            </Link>
          ) : (
            <button className="btn-nav disabled" disabled>
              {resolvedNextLabel} →
            </button>
          )}
        </div>
      </div>
      <SponsorBanner />
      <div className="footer-bottom">
        <style>{`
          .footer-credit {
            font-size: 13px;
            color: rgba(229, 208, 143, 0.75);
            text-align: center;
            letter-spacing: 0.02em;
            margin: 0;
          }

          .footer-credit-link {
            color: #E5C07B;
            text-decoration: none;
            font-weight: 600;
            position: relative;
            transition: all 0.3s ease;
            cursor: pointer;
            display: inline-block;
          }

          .footer-credit-link::before {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #E5C07B, #F5D962);
            transition: width 0.4s ease;
          }

          .footer-credit-link:hover::before {
            width: 100%;
          }

          .footer-credit-link:hover {
            color: #F5D962;
            text-shadow: 0 0 12px rgba(229, 192, 123, 0.6);
          }

          @keyframes portfolioGlow {
            0%, 100% {
              text-shadow: 0 0 0px rgba(229, 192, 123, 0.4);
            }
            50% {
              text-shadow: 0 0 8px rgba(229, 192, 123, 0.8);
            }
          }

          .footer-credit-link.pulse {
            animation: portfolioGlow 3s ease-in-out infinite;
          }
        `}</style>
        <p className="footer-credit">
          Designed & Developed by{' '}
          <a 
            href="https://jclabs-portfolio.vercel.app/" 
            className="footer-credit-link pulse"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit JCLabs Portfolio"
          >
            Jare&apos;s Choice Labs (JCLs)
          </a>
          {' '}• Crafting Digital Experiences That Matter
        </p>
      </div>
    </footer>
  );
}

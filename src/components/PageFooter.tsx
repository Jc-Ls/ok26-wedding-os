'use client';
import Link from 'next/link';

interface PageFooterProps {
  previousHref?: string;
  previousLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}

export default function PageFooter({
  previousHref,
  previousLabel = 'Previous Page',
  nextHref,
  nextLabel = 'Next Page',
}: PageFooterProps) {
  return (
    <footer className="page-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-grid">
            <div>
              <p className="footer-title">Quick Links</p>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/couple">Couple</Link>
                </li>
                <li>
                  <Link href="/honorees">Honorees</Link>
                </li>
                <li>
                  <Link href="/itinerary">Itinerary</Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="footer-title">Need Help?</p>
              <p>Event Coordinator</p>
              <p>Groom Representative</p>
              <p>Bride Representative</p>
            </div>
            <div>
              <p className="footer-title">Contact</p>
              <p>+234 800 000 0000</p>
              <p>support@olowojarewedding.com</p>
            </div>
          </div>
          <p className="footer-credit">
            Designed & Developed by Jare's Choice Labs (JCLs) • Crafting Digital Experiences That Matter
          </p>
        </div>

        <div className="page-navigation">
          <div className="nav-button previous">
            {previousHref ? (
              <Link href={previousHref} className="btn-nav">
                ← {previousLabel}
              </Link>
            ) : (
              <button className="btn-nav disabled" disabled>
                ← {previousLabel}
              </button>
            )}
          </div>
          <div className="nav-button next">
            {nextHref ? (
              <Link href={nextHref} className="btn-nav">
                {nextLabel} →
              </Link>
            ) : (
              <button className="btn-nav disabled" disabled>
                {nextLabel} →
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

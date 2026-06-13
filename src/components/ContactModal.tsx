'use client';
import { useState, useEffect } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsor: {
    name: string;
    description: string;
    ceoName: string;
    phone: string;
    email: string;
    locations: string;
  };
}

export default function ContactModal({ isOpen, onClose, sponsor }: ContactModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <div 
        className={`contact-modal-overlay ${isClosing ? 'closing' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className={`contact-modal ${isClosing ? 'closing' : ''}`}>
        <style>{`
          .contact-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 999;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            animation: fadeIn 0.3s ease;
          }

          .contact-modal-overlay.closing {
            animation: fadeOut 0.3s ease;
          }

          .contact-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            background: linear-gradient(135deg, rgba(7, 15, 34, 0.95), rgba(20, 30, 50, 0.95));
            border: 1px solid rgba(229, 192, 123, 0.3);
            border-radius: 16px;
            padding: 40px;
            max-width: 480px;
            width: calc(100vw - 32px);
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(229, 192, 123, 0.2);
            animation: slideUp 0.3s ease;
          }

          .contact-modal.closing {
            animation: slideDown 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }

          @keyframes slideUp {
            from { 
              transform: translate(-50%, calc(-50% + 20px));
              opacity: 0;
            }
            to { 
              transform: translate(-50%, -50%);
              opacity: 1;
            }
          }

          @keyframes slideDown {
            from { 
              transform: translate(-50%, -50%);
              opacity: 1;
            }
            to { 
              transform: translate(-50%, calc(-50% + 20px));
              opacity: 0;
            }
          }

          .modal-close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            color: #E5C07B;
            font-size: 28px;
            cursor: pointer;
            padding: 0;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .modal-close-btn:hover {
            background: rgba(229, 192, 123, 0.1);
            transform: rotate(90deg);
          }

          .modal-header {
            margin-bottom: 24px;
            border-bottom: 2px solid rgba(229, 192, 123, 0.3);
            padding-bottom: 16px;
          }

          .modal-header h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px;
            color: #E5C07B;
            margin: 0 0 8px 0;
          }

          .modal-header p {
            color: rgba(229, 192, 123, 0.8);
            margin: 0;
            font-size: 14px;
            font-style: italic;
          }

          .contact-section {
            margin: 20px 0;
          }

          .contact-section-title {
            font-family: 'Cinzel', serif;
            font-size: 12px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #D4AF37;
            margin: 0 0 12px 0;
            opacity: 0.9;
          }

          .contact-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin: 12px 0;
          }

          .contact-icon {
            min-width: 20px;
            color: #E5C07B;
            font-size: 18px;
          }

          .contact-info {
            flex: 1;
          }

          .contact-label {
            font-size: 12px;
            color: rgba(229, 192, 123, 0.6);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
            display: block;
          }

          .contact-value {
            color: #e0e0e0;
            font-size: 14px;
            word-break: break-all;
            font-weight: 500;
          }

          .contact-value a {
            color: #E5C07B;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .contact-value a:hover {
            color: #F5D962;
            text-decoration: underline;
          }

          .description-box {
            background: rgba(229, 192, 123, 0.08);
            border-left: 3px solid #E5C07B;
            padding: 16px;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .description-box p {
            color: rgba(229, 229, 223, 0.9);
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
          }

          .modal-footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid rgba(229, 192, 123, 0.2);
            text-align: center;
            font-size: 12px;
            color: rgba(229, 192, 123, 0.6);
          }

          @media (max-width: 640px) {
            .contact-modal {
              padding: 24px;
              border-radius: 12px;
            }

            .modal-header h2 {
              font-size: 22px;
            }

            .contact-item {
              gap: 10px;
            }

            .contact-value {
              font-size: 13px;
            }
          }

          @media (max-width: 480px) {
            .contact-modal {
              padding: 20px;
              width: calc(100vw - 20px);
            }

            .modal-header h2 {
              font-size: 20px;
            }
          }
        `}</style>

        <button 
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="modal-header">
          <h2>{sponsor.name}</h2>
          <p>Get in Touch</p>
        </div>

        <div className="description-box">
          <p>{sponsor.description}</p>
        </div>

        <div className="contact-section">
          <h3 className="contact-section-title">📍 Locations</h3>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div className="contact-info">
              <span className="contact-value">{sponsor.locations}</span>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <h3 className="contact-section-title">👤 CEO / Founder</h3>
          <div className="contact-item">
            <span className="contact-icon">👤</span>
            <div className="contact-info">
              <span className="contact-value">{sponsor.ceoName}</span>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <h3 className="contact-section-title">Contact Information</h3>
          
          <div className="contact-item">
            <span className="contact-icon">📱</span>
            <div className="contact-info">
              <span className="contact-label">Phone</span>
              <span className="contact-value">
                <a href={`tel:${sponsor.phone.replace(/\s/g, '')}`}>
                  {sponsor.phone}
                </a>
              </span>
            </div>
          </div>

          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <div className="contact-info">
              <span className="contact-label">Email</span>
              <span className="contact-value">
                <a href={`mailto:${sponsor.email}`}>
                  {sponsor.email}
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <p>For more information, please reach out directly via phone or email.</p>
        </div>
      </div>
    </>
  );
}

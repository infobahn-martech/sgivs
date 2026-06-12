import { createPortal } from 'react-dom';

export const CARD_VERIFICATION_CONTENT = (
  <>
    <style>{`
        .card-verification-content {
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
        }

        .verification-banner {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            border-radius: 8px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .card-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }

        .card-section {
            border-radius: 10px;
            padding: 16px;
            border: 1px solid #e5e7eb;
        }

        .card-section.local {
            background: #f0fdf4;
            border-color: #bbf7d0;
        }

        .card-section.international {
            background: #eff6ff;
            border-color: #bfdbfe;
        }

        .card-section-title {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .card-section.local .card-section-title { color: #15803d; }
        .card-section.international .card-section-title { color: #1d4ed8; }

        .fee-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 20px;
            margin-bottom: 10px;
        }

        .card-section.local .fee-badge {
            background: #dcfce7;
            color: #166534;
        }

        .card-section.international .fee-badge {
            background: #dbeafe;
            color: #1e40af;
        }

        .bank-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .bank-list li {
            font-size: 13px;
            color: #4b5563;
            padding: 3px 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .bank-list li:last-child { border-bottom: none; }

        .bank-list li::before {
            content: '•';
            color: #16a34a;
            font-weight: bold;
            font-size: 16px;
            line-height: 1;
        }

        .card-section.international .bank-list li::before {
            color: #2563eb;
        }

        .warning-box {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px 14px;
            border-radius: 8px;
            background: #fffbeb;
            border: 1px solid #fde68a;
            color: #92400e;
            font-size: 13px;
        }

        .warning-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
    `}</style>

    <div className="card-verification-content">
      <div className="verification-banner">
        🛡️ Verify the issuing bank before selecting a card type
      </div>

      <div className="card-grid">
        <div className="card-section local">
          <div className="card-section-title">
            🏦 Local Card
          </div>
          <div className="fee-badge">Debit: 1.5% &nbsp;|&nbsp; Credit: 1.8%</div>
          <ul className="bank-list">
            <li>National Bank of Oman</li>
            <li>Bank Muscat</li>
            <li>Bank Dhofar</li>
            <li>Sohar International</li>
            <li>Oman Arab Bank</li>
            <li>Ahli Bank</li>
            <li>Bank Nizwa</li>
            <li>Alizz Islamic Bank</li>
          </ul>
        </div>

        <div className="card-section international">
          <div className="card-section-title">
            🌐 International Card
          </div>
          <div className="fee-badge">2.25% charge</div>
          <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '8px' }}>
            All cards <strong>not issued</strong> by the listed local banks are considered International cards.
          </p>
        </div>
      </div>

      <div className="warning-box">
        <span className="warning-icon">⚠️</span>
        <span><strong>Important:</strong> Incorrect card type selection may lead to billing errors and customer disputes.</span>
      </div>
    </div>
  </>
);

export function CardNotificationModal({ showModal, closeModal, title = 'Card Type Verification', content }) {
  if (!showModal) return null;

  return createPortal(
    <>
      {/* Backdrop — semi-transparent, doesn't fully block */}
      <div
        onClick={closeModal}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.25)',
          zIndex: 99998,
        }}
      />

      {/* Popup */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        width: '680px',
        maxWidth: '95vw',
        maxHeight: '85vh',
        overflowY: 'auto',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f3f4f6',
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
              {title}
            </h4>
            <small style={{ color: '#6b7280', fontSize: '13px' }}>
              Ensure the correct card type is selected
            </small>
          </div>
          <button
            type="button"
            onClick={closeModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#6b7280',
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', flex: 1 }}>
          {content}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button
            type="button"
            onClick={closeModal}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#051a53',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            ✓ &nbsp; I Understand, Proceed
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

export default CardNotificationModal;
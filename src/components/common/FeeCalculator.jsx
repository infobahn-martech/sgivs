import React from 'react';

const formatFee = (value) => (typeof value === 'number' ? value.toFixed(3) : String(value ?? '0.000'));

const FeeCalculator = ({
  govtFees = 0,
  icwfFees = 0,
  serviceFees = 0,
  totalFees,
  onlinePaid = '...',
  className = '',
}) => {
  const total = totalFees ?? (Number(govtFees) + Number(icwfFees) + Number(serviceFees));
  const displayOnlinePaid = onlinePaid !== null && onlinePaid !== undefined && onlinePaid !== ''
    ? (typeof onlinePaid === 'number' ? formatFee(onlinePaid) : String(onlinePaid))
    : '...';

  return (
    <div className={`fee-calculator-box ${className}`.trim()} style={styles.box}>
      <div style={styles.title}>Fees Calculator</div>
      <div style={styles.row}>
        <span style={styles.label}>Govt Fees:</span>
        <span style={styles.value}>{formatFee(govtFees)}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>ICWF Fees:</span>
        <span style={styles.value}>{formatFee(icwfFees)}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Service Fees:</span>
        <span style={styles.value}>{formatFee(serviceFees)}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Total Fees:</span>
        <span style={styles.valueTotal}>{formatFee(total)}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Online Paid:</span>
        <span style={styles.value}>{displayOnlinePaid}</span>
      </div>
    </div>
  );
};

const styles = {
  box: {
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '12px 14px',
    backgroundColor: '#f8f9fa',
    minWidth: '180px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#212529',
    marginBottom: '10px',
    paddingBottom: '6px',
    borderBottom: '1px solid #dee2e6',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    padding: '3px 0',
    gap: '8px',
  },
  label: {
    color: '#495057',
    flexShrink: 0,
  },
  value: {
    fontWeight: 500,
    color: '#212529',
    fontVariantNumeric: 'tabular-nums',
  },
  valueTotal: {
    fontWeight: 700,
    color: '#0d6efd',
    fontVariantNumeric: 'tabular-nums',
  },
};

export default FeeCalculator;

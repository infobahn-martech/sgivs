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
      <div style={styles.totalBox}>
        <span style={styles.totalLabel}>Total Fees:</span>
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
    border: "1px solid #dee2e6",
    borderRadius: "12px",
    padding: "18px 22px",
    backgroundColor: "#ffffff",
    minWidth: "240px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },

  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#212529",
    marginBottom: "14px",
    paddingBottom: "8px",
    borderBottom: "1px solid #dee2e6",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    padding: "6px 0",
    gap: "12px",
    borderBottom: "1px dashed rgba(148, 163, 184, 0.35)",
  },

  label: {
    fontWeight: 500,
    color: "#495057",
    flexShrink: 0,
  },

  value: {
    fontWeight: 500,
    color: "#212529",
    fontVariantNumeric: "tabular-nums",
  },

  // 🔥 TOTAL AS SEPARATE CARD BLOCK
  totalBox: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontWeight: 700,
    color: "#0d6efd",
  },

  valueTotal: {
    fontWeight: 800,
    color: "#0d6efd",
    fontVariantNumeric: "tabular-nums",
  },
};
export default FeeCalculator;

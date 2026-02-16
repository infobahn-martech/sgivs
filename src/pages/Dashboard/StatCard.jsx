import React from 'react';

/**
 * Stat card matching the Employee count / Applications MTD KPI style:
 * rounded card, light background, icon circle (with initial), label, large value.
 */
const StatCard = ({ label, value, initial, size = 'normal', className = '' }) => {
  const letter = initial != null ? String(initial).charAt(0).toUpperCase() : (label || ' ').charAt(0).toUpperCase();

  return (
    <div className={`dash-stat-card ${size === 'large' ? 'dash-stat-card--large' : ''} ${className}`.trim()}>
      <div className="dash-stat-card-inner">
        <div className="dash-stat-card-icon">
          <span className="dash-stat-card-initial">{letter}</span>
        </div>
        <div className="dash-stat-card-info">{label || '-'}</div>
        <span className="dash-stat-card-count">{value ?? '-'}</span>
      </div>
    </div>
  );
};

export default StatCard;

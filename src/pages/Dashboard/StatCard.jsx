import React from 'react';

const StatCard = ({ label, value, initial, size = 'normal', variant = 'blue', className = '' }) => {
  const letter = initial != null
    ? String(initial).charAt(0).toUpperCase()
    : (label || ' ').charAt(0).toUpperCase();

  return (
    <div className={`dash-stat-card dash-stat-card--${variant} ${size === 'large' ? 'dash-stat-card--large' : ''} ${className}`.trim()}>
      <div className="dash-stat-card-inner">
        <div className="dash-stat-card-top">
          <div className="dash-stat-card-icon">
            <span className="dash-stat-card-initial">{letter}</span>
          </div>
          <div className="dash-stat-card-detail">
            <div className="dash-stat-card-info">{label || '-'}</div>
            <span className="dash-stat-card-count">{value ?? '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
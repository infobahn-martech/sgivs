import React from 'react';
import CommonSkeleton from '../../components/common/CommonSkeleton';

const CountBlock = ({ icon, label, count, trend, className = '', isLoading }) => {
  if (isLoading) {
    return (
      <div className={`count-blk count-blk--kpi ${className}`}>
        <div className="count-blk-inner">
          <CommonSkeleton height={80} />
        </div>
      </div>
    );
  }

  return (
    <div className={`count-blk count-blk--kpi ${className}`}>
      <div className="count-blk-inner">

        {/* Top row — icon left, label+count right */}
        <div className="count-blk-top">
          <div className="icon-blk">
            <img src={icon} alt="" />
          </div>
          <div className="count-blk-detail">
            <div className="info">{label || '-'}</div>
            <span className="count">{count ?? '-'}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="count-blk-divider" />

        {/* Footer */}
        <div className="count-blk-footer">
          {trend ? (
            <span className={`trend ${trend.startsWith('+') ? 'trend--up' : 'trend--down'}`}>
              {trend}
            </span>
          ) : (
            <span className="trend-placeholder">-</span>
          )}
          <span className="trend-label">than yesterday</span>
        </div>

      </div>
    </div>
  );
};

export default CountBlock;
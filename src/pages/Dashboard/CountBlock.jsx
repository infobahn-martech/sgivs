import React from 'react';
import CommonSkeleton from '../../components/common/CommonSkeleton';

const CountBlock = ({ icon, label, count, className = '', isLoading }) => {
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
        <div className="icon-blk">
          <img src={icon} alt="" />
        </div>
        <div className="info">{label || '-'}</div>
        <span className="count">{count ?? '-'}</span>
      </div>
    </div>
  );
};

export default CountBlock;

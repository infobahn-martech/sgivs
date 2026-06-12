import React, { useEffect, useRef, useState } from 'react';

const ActionsMenu = ({
  row,
  onPrintReceipt,
  onPrintBarcode,
  onViewApplication,
  onComment,
  onActivityLog,
  onEditApplication,
  onChangeServiceFee,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    setOpen((s) => !s);
  };

  const handleItem = (e, cb) => {
    e.stopPropagation();
    setOpen(false);
    cb?.(row);
  };

  return (
    <div className="action-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="action-menu__btn" onClick={toggle} aria-label="More actions">
        ⋮
      </button>

      {open && (
        <div className="action-menu__dropdown">
          <button type="button" onClick={(e) => handleItem(e, onPrintReceipt)}>
            Print Receipt
          </button>
          <button type="button" onClick={(e) => handleItem(e, onPrintBarcode)}>
            Print Barcode
          </button>
          <button type="button" onClick={(e) => handleItem(e, onViewApplication)}>
            View Application
          </button>
          <button type="button" onClick={(e) => handleItem(e, onComment)}>
            Comment
          </button>
          {/* <button type="button" onClick={(e) => handleItem(e, onActivityLog)}>
            Activity Log
          </button> */}
          <button type="button" onClick={(e) => handleItem(e, onEditApplication)}>
            Edit Application
          </button>
          <button type="button" onClick={(e) => handleItem(e, onChangeServiceFee)}>
            Change Service/Fees
          </button>

          <div className="action-menu__divider" />

          <button type="button" className="danger" onClick={(e) => handleItem(e, onDelete)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;

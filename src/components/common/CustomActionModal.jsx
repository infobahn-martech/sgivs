import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

import '../../assets/scss/modal.scss';

import CustomModal from './CustomModal';
import deleteIcon from '../../assets/images/delete-modal.svg';
import logoutIcon from '../../assets/images/logout-modal.svg';
// import notifyIcon from '../../assets/images/notifications.svg';
import warningIcon from '../../assets/images/warning.svg';

const CustomActionModal = ({
  showModal,
  closeModal,
  message,
  onSubmit,
  isLoading,
  isDelete,
  isLogout,
  isWarning = false,
  showCommentBox = false,
  button = { primary: 'Submit', secondary: 'Cancel' },
}) => {
  const [comment, setComment] = useState('');
  useEffect(() => {
    if (!showModal) {
      setComment('');
    }
  }, [showModal]);

  const renderHeader = () => (
    <>
      <button
        type="button"
        className="btn-close nn"
        onClick={closeModal}
        aria-label="Close"
      ></button>
    </>
  );
  const renderBody = () => (
    <>
      <div className="modal-body">
        <div className="modal-icon">
          <div className="icon-blk">
            <img
              // className="icon"
              // src={notifyIcon}
              src={
                isDelete
                  ? deleteIcon
                  : isLogout
                    ? logoutIcon
                    : isWarning
                      ? warningIcon
                      : warningIcon
              }
              alt=""
            />
          </div>
        </div>
        <div className="prompt-title">{message}</div>
        {/* ✅ NEW: conditional comment box */}
        {showCommentBox && (
          <div className="form-group mt-3">
            <label className="form-label">Remark</label>
            <textarea
              className="form-control"
              placeholder="Type your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ minHeight: '120px' }}
            />
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-cancel" onClick={closeModal}>
          {button.secondary}
        </button>
        {/* <button
          type="submit"
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={isLoading}
        > */}
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() =>
            onSubmit(
              showCommentBox ? { comment } : {}
            )
          }
          disabled={
            isLoading ||
            (showCommentBox && !comment.trim())
          }
        >
          {isLoading ? (
            <Spinner
              size="sm"
              as="span"
              animation="border"
              variant="light"
              aria-hidden="true"
              className="custom-spinner"
            />
          ) : isDelete ? (
            'Delete'
          ) : (
            button.primary
          )}
        </button>
      </div>
    </>
  );

  return (
    <CustomModal
      // closeButton
      className="modal fade prompt-modal add-new-msg-modal"
      dialgName="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      show={showModal}
      header={renderHeader()}
      closeModal={closeModal}
      body={renderBody()}
    />
  );
};

export default CustomActionModal;

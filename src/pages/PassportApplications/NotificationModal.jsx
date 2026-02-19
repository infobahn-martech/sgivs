import CustomModal from '../../components/common/CustomModal';

export const CARD_VERIFICATION_CONTENT = (
  <div className="card-verification-content">
    <p className="fw-semibold mb-2">Please verify the issuing bank before proceeding!</p>
    <p className="mb-2">
      If the Credit/Debit Card is issued by any of the following <strong>LOCAL BANKS</strong>, select
      &quot;Local Card (1.5% charge for debit card &amp; 1.8% charge for credit card)&quot;:
    </p>
    <ul className="mb-2">
      <li>National Bank of Oman</li>
      <li>Bank Muscat</li>
      <li>Bank Dhofar</li>
      <li>Sohar International</li>
      <li>Oman Arab Bank</li>
      <li>Ahli Bank</li>
      <li>Bank Nizwa</li>
      <li>Alizz Islamic Bank</li>
    </ul>
    <p className="mb-2">
      Local Cards attract a 1.5% charge for debit card &amp; 1.8% charge for credit card.
    </p>
    <p className="mb-2">
      All other cards are considered <strong>INTERNATIONAL</strong> and attract a 2.25% charge.
    </p>
    <p className="text-danger fw-semibold mb-0">
      Incorrect selection will lead to billing errors and customer disputes.
      <br />
      Please double-check the card before proceeding.
    </p>
  </div>
);

export function NotificationModal({ showModal, closeModal, title = 'Notifications', content }) {

    const renderHeader = () => (
        <>
            <h4 className="modal-title">{title}</h4>
            <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
            />
        </>
    );

    const renderBody = () => (
        <div className="modal-body custom-scroll view-modal-body">
            {content}
        </div>
    );

    return (
        <CustomModal
            className="modal fade passport-application-modal show"
            dialgName="modal-dialog-scrollable"
            show={!!showModal}
            closeModal={closeModal}
            body={renderBody()}
            header={renderHeader()}
        />
    );
}

export default NotificationModal;

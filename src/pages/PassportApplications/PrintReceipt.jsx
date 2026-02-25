import CustomModal from '../../components/common/CustomModal';


export function PrintReceiptModal({ showModal, closeModal, title = 'Print Receipt' }) {

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
            <div className="print-receipt-content">
                <h4>Print Receipt</h4>
                <p>Thank you for your application. Your receipt is below.</p>
            </div>
        </div>
    );

    return (
        <CustomModal
            className="modal fade print-receipt-modal card-type-verification-modal show"
            dialgName="modal-dialog-scrollable"
            show={!!showModal}
            closeModal={closeModal}
            body={renderBody()}
            header={renderHeader()}
        />
    );
}

export default PrintReceiptModal;

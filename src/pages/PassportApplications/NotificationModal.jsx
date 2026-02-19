
import CustomModal from '../../components/common/CustomModal';


export function NotificationModal({ showModal, closeModal }) {

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Notifications</h4>
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

import React, { useState, useEffect } from 'react';
import CustomModal from '../../components/common/CustomModal';
import passportApplicationService from '../../services/PassportApplicationService';
import useAlertReducer from '../../stores/AlertReducer';

export function PrintReceiptModal({ showModal, closeModal, title = 'Print Receipt' }) {
    const [receiptData, setReceiptData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!showModal) {
            setReceiptData(null);
            return;
        }
        const passport_app_id = showModal?.passport_app_id || showModal?.id || showModal?._id;
        if (!passport_app_id) return;

        const fetchReceipt = async () => {
            setIsLoading(true);
            setReceiptData(null);
            try {
                const { data } = await passportApplicationService.getReceipt(passport_app_id);
                setReceiptData(data?.data ?? data);
            } catch (err) {
                const { error } = useAlertReducer.getState();
                error(err?.response?.data?.message ?? err?.message ?? 'Failed to load receipt');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReceipt();
    }, [showModal]);

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
                {isLoading && (
                    <p className="text-muted">Loading receipt...</p>
                )}
                {!isLoading && receiptData && (
                    <>
                        {typeof receiptData === 'string' && receiptData.startsWith('http') && (
                            <iframe src={receiptData} title="Receipt" style={{ width: '100%', minHeight: '400px', border: 'none' }} />
                        )}
                        {typeof receiptData === 'string' && receiptData.startsWith('data:') && (
                            <img src={receiptData} alt="Receipt" style={{ maxWidth: '100%' }} />
                        )}
                        {typeof receiptData === 'object' && receiptData?.url && (
                            <iframe src={receiptData.url} title="Receipt" style={{ width: '100%', minHeight: '400px', border: 'none' }} />
                        )}
                        {typeof receiptData === 'object' && receiptData?.html && (
                            <div dangerouslySetInnerHTML={{ __html: receiptData.html }} />
                        )}
                        {receiptData && !receiptData?.url && !receiptData?.html && typeof receiptData !== 'string' && (
                            <pre>{JSON.stringify(receiptData, null, 2)}</pre>
                        )}
                    </>
                )}
                {!isLoading && !receiptData && showModal && (
                    <>
                        <h4>Print Receipt</h4>
                        <p className="text-muted">No receipt data available.</p>
                    </>
                )}
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

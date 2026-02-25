import React, { useState, useEffect } from 'react';
import CustomModal from '../../components/common/CustomModal';
import passportApplicationService from '../../services/PassportApplicationService';
import useAlertReducer from '../../stores/AlertReducer';

export function PrintBarcodeModal({ showModal, closeModal, title = 'Print Barcode' }) {
    const [barcodeData, setBarcodeData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!showModal) {
            setBarcodeData(null);
            return;
        }
        const passport_app_id = showModal?.passport_app_id || showModal?.id || showModal?._id;
        if (!passport_app_id) return;

        const fetchBarcode = async () => {
            setIsLoading(true);
            setBarcodeData(null);
            try {
                const { data } = await passportApplicationService.getBarcode(passport_app_id);
                setBarcodeData(data?.data ?? data);
            } catch (err) {
                const { error } = useAlertReducer.getState();
                error(err?.response?.data?.message ?? err?.message ?? 'Failed to load barcode');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBarcode();
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
                    <p className="text-muted">Loading barcode...</p>
                )}
                {!isLoading && barcodeData && (
                    <>
                        {typeof barcodeData === 'string' && barcodeData.startsWith('http') && (
                            <iframe src={barcodeData} title="Barcode" style={{ width: '100%', minHeight: '300px', border: 'none' }} />
                        )}
                        {typeof barcodeData === 'string' && barcodeData.startsWith('data:') && (
                            <img src={barcodeData} alt="Barcode" style={{ maxWidth: '100%' }} />
                        )}
                        {typeof barcodeData === 'object' && barcodeData?.url && (
                            <iframe src={barcodeData.url} title="Barcode" style={{ width: '100%', minHeight: '300px', border: 'none' }} />
                        )}
                        {typeof barcodeData === 'object' && barcodeData?.html && (
                            <div dangerouslySetInnerHTML={{ __html: barcodeData.html }} />
                        )}
                        {typeof barcodeData === 'object' && barcodeData?.image && (
                            <img src={barcodeData.image} alt="Barcode" style={{ maxWidth: '100%' }} />
                        )}
                        {barcodeData && !barcodeData?.url && !barcodeData?.html && !barcodeData?.image && typeof barcodeData !== 'string' && (
                            <pre>{JSON.stringify(barcodeData, null, 2)}</pre>
                        )}
                    </>
                )}
                {!isLoading && !barcodeData && showModal && (
                    <>
                        <h4>Print Barcode</h4>
                        <p className="text-muted">No barcode data available.</p>
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

export default PrintBarcodeModal;

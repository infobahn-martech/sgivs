import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import JsBarcode from 'jsbarcode';
import attestationApplicationService from '../../services/attestationApplicationService';
import useAlertReducer from '../../stores/AlertReducer';

/* =========================
   BARCODE COMPONENT
========================= */
function BarcodeSvg({ value, options = {} }) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current && value) {
            try {
                JsBarcode(svgRef.current, String(value), {
                    format: 'CODE128',
                    width: 2.5,
                    height: 70,
                    displayValue: false,
                    margin: 10,
                    ...options,
                });
            } catch (e) {}
        }
    }, [value, options]);

    return value ? <svg ref={svgRef} className="barcode-svg" /> : null;
}

/* =========================
   Attestation CONTENT
========================= */
function AttestationBarcodeContent({ data }) {
    if (!data || typeof data !== 'object') return null;

    const referenceNo = data.appointment_reference_no || '—';

    const applicantName = data.full_name || '—';

    const applicationDate = data.application_date
        ? moment(data.application_date).format('DD/MM/YYYY HH:mm')
        : '—';

    const icac = data.center_name || '—';

    return (
        <div className="passport-barcode" id="attestation-barcode-print">

            <style>{`
                .passport-barcode {
                    max-width: 420px;
                    margin: 0 auto;
                    padding: 24px;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 14px;
                    color: #111;
                }

                .barcode-title {
                    font-size: 18px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 18px;
                    color: #0d47a1;
                }

                .barcode-section {
                    text-align: center;
                    padding: 16px;
                    background: #fafafa;
                    border: 1px solid #e5e5e5;
                    border-radius: 8px;
                    margin-bottom: 18px;
                }

                .barcode-value {
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    margin: 8px 0;
                    font-family: monospace;
                }

                .details-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .details-table td {
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }

                .details-table td:first-child {
                    font-weight: 500;
                    color: #555;
                    width: 45%;
                }

                .details-table td:last-child {
                    font-weight: 600;
                }

                @media print {
                    body { margin: 0; }
                }
            `}</style>

            {/* TITLE */}
            <div className="barcode-title">
                ATTESTATION APPLICATION BARCODE
            </div>

            {/* MAIN BARCODE */}
            <div className="barcode-section">
                <div className="barcode-value">{referenceNo}</div>
                <BarcodeSvg value={referenceNo} />
            </div>

            {/* DETAILS */}
            <table className="details-table">
                <tbody>
                    <tr>
                        <td>Reference No</td>
                        <td>{referenceNo}</td>
                    </tr>
                    <tr>
                        <td>Applicant Name</td>
                        <td>{applicantName}</td>
                    </tr>
                    <tr>
                        <td>Application Date</td>
                        <td>{applicationDate}</td>
                    </tr>
                    <tr>
                        <td>Delivery Mode</td>
                        <td>Counter</td>
                    </tr>
                    <tr>
                        <td>ICAC</td>
                        <td>{icac}</td>
                    </tr>
                </tbody>
            </table>    
        </div>
    );
}

/* =========================
   PRINT MODAL
========================= */
export function PrintBarcodeModal({ showModal, closeModal }) {
    const [barcodeData, setBarcodeData] = useState(null);

    useEffect(() => {
        if (!showModal) {
            setBarcodeData(null);
            return;
        }

        const id =
            showModal?.attestation_application_id ??
            showModal?.id ??
            showModal?._id;

        if (!id) {
            closeModal();
            return;
        }

        const fetchBarcode = async () => {
            try {
                const { data } = await attestationApplicationService.getBarcode(id);
                setBarcodeData(data?.data ?? data);
            } catch (err) {
                const { error } = useAlertReducer.getState();
                error(err?.message || 'Failed to load Attestation barcode');
                closeModal();
            }
        };

        fetchBarcode();
    }, [showModal]);

    useEffect(() => {
        if (!barcodeData || !showModal) return;

        const timer = setTimeout(() => {
            const el = document.getElementById('attestation-barcode-print');
            if (!el) return;

            const w = window.open('', '_blank');
            w.document.write(`
                <html>
                    <head>
                        <title>Attestation Barcode</title>
                    </head>
                    <body style="margin:0;padding:20px;">
                        ${el.outerHTML}
                    </body>
                </html>
            `);

            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 300);
            closeModal();
        }, 300);

        return () => clearTimeout(timer);
    }, [barcodeData, showModal]);

    if (!showModal) return null;

    return (
        <div style={{ position: 'fixed', left: -9999 }}>
            {barcodeData && <AttestationBarcodeContent data={barcodeData} />}
        </div>
    );
}

export default PrintBarcodeModal;
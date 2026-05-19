import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import JsBarcode from 'jsbarcode';
import attestationVasApplicationsService from '../../services/attestationVasApplicationsService';
import useAlertReducer from '../../stores/AlertReducer';

function Barcode({ value, options = {} }) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current && value) {
            try {
                JsBarcode(svgRef.current, String(value), {
                    format: 'CODE128',
                    width: 2,
                    height: 40,
                    displayValue: false,
                    ...options,
                });
            } catch (e) { }
        }
    }, [value, options]);

    return value ? <svg ref={svgRef} className="receipt-barcode" /> : null;
}

function formatOMR(val) {
    if (val == null || val === '' || val === undefined) return '—';
    const n = parseFloat(val);
    return isNaN(n) ? String(val) : `OMR ${n.toFixed(3)}`;
}

function ReceiptContentOCI({ data }) {
    if (!data || typeof data !== 'object') return null;

    const centerName = data.center_name || '-';

    const arnNumber = data.embassy_arn || data.receipt_no || '—';
    const receiptNo = data.receipt_no || '—';

    const applicantName = data.applicant_name || '—';
    const phone = data.applicant_phone || '—';
    const passportNo = data.passport_no || '—';

    const serviceName = data.oci_service || 'OCI SERVICE';

    const printedOn = moment().format('DD/MM/YYYY, HH:mm');

    const applicationDate = data.application_date
        ? moment(data.application_date).format('DD/MM/YYYY, HH:mm')
        : printedOn;

    const counterUser = data.counter_user || '—';
    const paymentMode = data.payment_mode || '—';

    const ociFee = data.oci_fee;
    const icwfFee = data.icwf_fee;

    const totalA = data.total_a;
    const sgivsFee = data.sgivs_service_fee;

    const totalB = data.total_b;

    const vatAmount = data.vat_amount;
    const grandTotal = data.grand_total;

    const barcodeValue = arnNumber;
    const sgivsBarcodeValue = receiptNo;

    return (
        <div className="fee-receipt" id="fee-receipt-print-oci">

            <style>{`
                .fee-receipt {
                    max-width: 100%;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 13px;
                    line-height: 1.4;
                    color: #111;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 10px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #333;
                }
                .receipt-header h2 {
                    font-size: 16px;
                    margin: 0;
                }
                .vatin {
                    font-size: 12px;
                    color: #444;
                }
                .receipt-title {
                    font-size: 15px;
                    font-weight: 700;
                    text-align: center;
                    margin: 10px 0;
                }
                .receipt-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 12px;
                }
                .receipt-table td {
                    padding: 6px 8px;
                    border-bottom: 1px solid #eee;
                }
                .receipt-table td:first-child {
                    font-weight: 500;
                    width: 45%;
                }
                .total-row td {
                    font-weight: 600;
                }
                .counter-user {
                    text-align: center;
                    font-weight:bold;
                    font-size: 16px;
                    margin: 8px;
                }

                .tracking-info {
                    text-align: center;
                    margin-top: 10px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .tracking-url {
                    font-weight: 600;
                    display: inline-block;
                    margin-top: 2px;
                }
                .barcode-section {
                    text-align: center;
                    margin-top: 15px; 
                }
                .barcode-title {
                    text-align: center;
                    font-size: 15px;
                    font-weight: 700;
                }
                .barcode-value {
                    font-weight: 600;
                    font-size:25px;
                }
                .disclaimer {
                    margin-top: 14px;
                    font-size: 12px;
                    text-align: center;
                    color: #555;
                }
                @media print {
                    .no-print { display: none !important; }
                }
            `}</style>

            {/* HEADER */}
            <div className="receipt-header">
                <h2>{centerName}</h2>
                 VATIN: OM1100477993
            </div>

            {/* BARCODE */}
            <div className="barcode-section">
                <div className="barcode-title">OCI Fee Receipt</div>
                <Barcode value={sgivsBarcodeValue} />
                <div className="barcode-value">{receiptNo}</div>
                <div className="counter-user">Counter User: {counterUser}</div>
            </div>

            {/* BASIC INFO */}
            <table className="receipt-table">
                <tbody>
                    <tr>
                        <td>Printed On</td>
                        <td>{printedOn}</td>
                    </tr>
                    <tr>
                        <td>Application Date</td>
                        <td>{applicationDate}</td>
                    </tr>
                    <tr>
                        <td>Applicant Name</td>
                        <td>{applicantName}</td>
                    </tr>
                    <tr>
                        <td>Phone Number</td>
                        <td>{phone}</td>
                    </tr>
                    <tr>
                        <td>Passport Number</td>
                        <td>{passportNo}</td>
                    </tr>
                </tbody>
            </table>

            {/* FEES */}
            <table className="receipt-table">
                <tbody>
                    <tr>
                        <td>OCI Service</td>
                        <td>{serviceName}</td>
                    </tr>
                    <tr>
                        <td>OCI Fee</td>
                        <td>{formatOMR(ociFee)}</td>
                    </tr>
                    <tr>
                        <td>ICWF Fee</td>
                        <td>{formatOMR(icwfFee)}</td>
                    </tr>
                    <tr className="total-row">
                        <td>Total (A)</td>
                        <td>{formatOMR(totalA)}</td>
                    </tr>
                    <tr>
                        <td>SGIVS Service Fee</td>
                        <td>{formatOMR(sgivsFee)}</td>
                    </tr>
                    <tr className="total-row">
                        <td>Total (B)</td>
                        <td>{formatOMR(totalB)}</td>
                    </tr>
                    <tr className="total-row">
                        <td>Grand Total (A+B)</td>
                        <td>{formatOMR(grandTotal)} (Tax inclusive)</td>
                    </tr>
                    {vatAmount != null && (
                        <tr>
                            <td>VAT (5%)</td>
                            <td>{formatOMR(vatAmount)} (Included in Total B)</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* PAYMENT */}
            <table className="receipt-table">
                <tbody>
                    <tr>
                        <td>Payment Mode</td>
                        <td>{paymentMode}</td>
                    </tr>
                    <tr>
                        <td>Submission Mode</td>
                        <td>Counter</td>
                    </tr>
                    <tr>
                        <td>Delivery Date</td>
                        <td>SUBJECT TO CLEARANCE FROM THE CONCERNED INDIAN GOVERNMENT AUTHORITIES</td>
                    </tr>
                </tbody>
            </table>

            <div className="tracking-info">
                Please Track status your application: <br />
                <span className="tracking-url">sgivsglobaloman.com</span>
            </div>
            
            {/* SECOND BARCODE */}
            <div className="barcode-section">
                <div className="barcode-title">Embassy ARN</div>
                <Barcode value={barcodeValue} />
                <div className="barcode-value">{arnNumber}</div>
            </div>

            {/* FOOTER */}
            <div className="disclaimer">
                <div>Fees once paid are not refundable</div>
                <div>please retain the original receipt at the time of collection of your document</div>
                <div style={{ marginTop: 8 }}>Thank You</div>
            </div>

        </div>
    );
}

export function PrintReceiptModal({ showModal, closeModal }) {
    const [receiptData, setReceiptData] = useState(null);

    useEffect(() => {
        if (!showModal) {
            setReceiptData(null);
            return;
        }

        const id = showModal?.oci_application_id ?? showModal?.id ?? showModal?._id;

        if (!id) {
            closeModal();
            return;
        }

        const fetchReceipt = async () => {
            try {
                const { data } = await attestationVasApplicationsService.getReceipt(id);
                const payload = data?.data ?? data;
                setReceiptData(payload);
            } catch (err) {
                const { error } = useAlertReducer.getState();
                error(err?.message || 'Failed to load receipt');
                closeModal();
            }
        };

        fetchReceipt();
    }, [showModal]);

    useEffect(() => {
        if (!receiptData || !showModal) return;

        const timer = setTimeout(() => {
            const el = document.getElementById('fee-receipt-print-oci');
            if (!el) return;

            const w = window.open('', '_blank');
            w.document.write(`
                <html>
                    <head><title>OCI Fee Receipt</title></head>
                    <body>${el.outerHTML}</body>
                </html>
            `);

            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 300);
            closeModal();
        }, 400);

        return () => clearTimeout(timer);
    }, [receiptData, showModal]);

    if (!showModal) return null;

    return (
        <div style={{ position: 'fixed', left: -9999 }}>
            {receiptData && <ReceiptContentOCI data={receiptData} />}
        </div>
    );
}

export default PrintReceiptModal;
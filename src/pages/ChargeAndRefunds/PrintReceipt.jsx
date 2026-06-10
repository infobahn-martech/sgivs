import React, { useState, useEffect } from 'react';
import moment from 'moment';
import useAlertReducer from '../../stores/AlertReducer';

function formatAmount(val) {
    if (val == null || val === '' || val === undefined) return '—';
    const n = parseFloat(val);
    return isNaN(n) ? String(val) : n.toFixed(2);
}

function ReceiptContentCharge({ data }) {
    if (!data || typeof data !== 'object') return null;

    const printedOn = moment().format('DD/MM/YYYY, HH:mm');

    return (
        <div className="fee-receipt" id="fee-receipt-print-charge">
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
                    margin: 0 0 4px 0;
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
                .receipt-footer {
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
                <h2>SGIVS Global</h2>
                <div className="vatin">VATIN: OM1100477993</div>
            </div>

            {/* TITLE */}
            <div className="receipt-title">Charge & Refund Receipt</div>

            {/* BASIC INFO */}
            <table className="receipt-table">
                <tbody>
                    <tr>
                        <td>Printed On</td>
                        <td>{printedOn}</td>
                    </tr>
                    <tr>
                        <td>Reference No</td>
                        <td>{data?.reference_no ?? '—'}</td>
                    </tr>
                    <tr>
                        <td>Application Type</td>
                        <td>{data?.application_type ?? '—'}</td>
                    </tr>
                    <tr>
                        <td>Applicant Name</td>
                        <td>{data?.applicant_name ?? '—'}</td>
                    </tr>
                    <tr>
                        <td>Service</td>
                        <td>{data?.service ?? '—'}</td>
                    </tr>
                </tbody>
            </table>

            {/* PAYMENT */}
            <table className="receipt-table">
                <tbody>
                    <tr><td>Amount</td><td>{formatAmount(data?.amount)}</td></tr>
                    <tr><td>Govt Fee</td><td>{formatAmount(data?.govt_fee)}</td></tr>
                    <tr><td>ICWF Fee</td><td>{formatAmount(data?.icwf_fee)}</td></tr>
                    <tr><td>SGIVS Service Fee</td><td>{formatAmount(data?.sgv_service_fee)}</td></tr>
                    <tr><td>Urgent Fee</td><td>{formatAmount(data?.urgent_fee)}</td></tr>
                    <tr><td>VAT Amount</td><td>{formatAmount(data?.vat_amount)}</td></tr>
                    <tr className="total-row"><td>Grand Total</td><td>{formatAmount(data?.grand_total)}</td></tr>
                    <tr><td>Payment Mode</td><td>{data?.payment_mode ?? '—'}</td></tr>
                    <tr><td>Transaction Type</td><td>{data?.transaction_type ?? '—'}</td></tr>
                    <tr><td>Transaction Date</td><td>{data?.transaction_date ?? '—'}</td></tr>
                    <tr><td>Processed By</td><td>{data?.processed_by ?? '—'}</td></tr>
                </tbody>
            </table>

            {/* FOOTER */}
            <div className="receipt-footer">
                <div>Fees once paid are not refundable</div>
                <div>Please retain the original receipt at the time of collection of your document</div>
                <div style={{ marginTop: 8 }}>Thank You</div>
            </div>
        </div>
    );
}

function PrintReceiptModal({ showModal, closeModal, getReceipt, isLoadingReceipt }) {
    const [receiptData, setReceiptData] = useState(null);

    useEffect(() => {
        if (!showModal) {
            setReceiptData(null);
            return;
        }

        // pass whatever identifier your API needs — adjust key as needed
        const params = {
            reference_no: showModal?.reference_no,
            application_type: showModal?.application_type,
        };

        getReceipt(params, (data) => {
            setReceiptData(data);
        });
    }, [showModal]);

    // print triggers when receiptData is ready
    useEffect(() => {
        if (!receiptData || !showModal) return;

        const timer = setTimeout(() => {
            const el = document.getElementById('fee-receipt-print-charge');
            if (!el) return;

            const w = window.open('', '_blank');
            if (!w) return;

            w.document.write(`
                <html>
                    <head>
                        <title>Charge &amp; Refund Receipt</title>
                        <style>body { margin: 20px; }</style>
                    </head>
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

    if (isLoadingReceipt) return null; // loading silently, print opens once ready

    return (
        <div style={{ position: 'fixed', left: -9999, top: -9999 }}>
            {receiptData && <ReceiptContentCharge data={receiptData} />}
        </div>
    );
}

export default PrintReceiptModal;
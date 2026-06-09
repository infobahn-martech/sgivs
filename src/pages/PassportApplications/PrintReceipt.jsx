import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import JsBarcode from 'jsbarcode';
import passportApplicationService from '../../services/PassportApplicationService';
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
            } catch (e) {
                // Fallback: show value as text if barcode fails
            }
        }
    }, [value, options]);
    return value ? <svg ref={svgRef} className="receipt-barcode" /> : null;
}

function formatOMR(val) {
    if (val == null || val === '' || val === undefined) return '—';
    const n = parseFloat(val);
    return isNaN(n) ? String(val) : `OMR ${n.toFixed(3)}`;
}

function ReceiptContent({ data }) {
    if (!data || typeof data !== 'object') return null;

    const centerName = `India Consular Application Center - ${data.center_name || '-'}`;

    const arnNumber = data.arn_number || '—';

    const applicantName = [data.first_name, data.last_name].filter(Boolean).join(' ') || '—';


    const counterUser = data.created_by || '—';
    const printedOn = moment().format('DD/MM/YYYY, HH:mm');
    const applicationDate = data.created_on
        ? moment(data.created_on).format('DD/MM/YYYY, HH:mm')
        : printedOn;
    const phone = data.contact_no || '—';
    const passportNo = data.passport_no || data.old_passport_no || '—';
    const passportService = data.service_name || '—';

    const passportFee = data.govt_fee;
    const icwfFee = data.icwf_fee;
    const totalA = data.total_a;
    const sgivsFee = data.sgv_service_fee;
    const totalB = data.total_b;
    const grandTotal = data.total_amount;
    const vatAmount = data.vat_amount;
    const vatPercent = data.vat_percent;

    const paymentMode = data.payment_mode || '—';
    const submissionMode =
        data.courier_type === '1' || data.courier_type === 1
            ? 'Courier'
            : 'Counter';
    const deliveryDate = 'SUBJECT TO CLEARANCE FROM THE CONCERNED INDIAN GOVERNMENT AUTHORITIES';
    const sgivsReceiptNo = data.appointment_ref_no || '—';
    const trackUrl = data.track_url || 'sgivsglobal-oman.com';
    const email = data.email_address || '—';

    const barcodeValue = arnNumber;
    const sgivsBarcodeValue = sgivsReceiptNo;

    return (
        <div className="fee-receipt" id="fee-receipt-print">
            <style>{`
                .fee-receipt {
                    max-width: 100%;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 13px;
                    line-height: 1.4;
                    color: #111;
                }
                .fee-receipt .receipt-header {
                    text-align: center;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #333;
                }
                .fee-receipt .receipt-header h2 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                }
                .fee-receipt .receipt-header .vatin { 
                    font-size: 12px; 
                    color: #444; 
                }
                .fee-receipt .receipt-title {
                    font-size: 15px;
                    font-weight: 700;
                    text-align: center;
                    margin: 8px 0;
                }
                .fee-receipt .barcode-section {
                    text-align: center;
                    margin: 12px 0;
                }
                .fee-receipt .barcode-section svg {
                    max-width: 100%; 
                 }
                .fee-receipt .barcode-section .barcode-value {
                    font-size: 14px;
                    font-weight: 600;
                    margin-top: 4px;
                }
                .fee-receipt .receipt-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .fee-receipt .receipt-table td {
                    padding: 4px 8px;
                    vertical-align: top;
                }
                .fee-receipt .receipt-table td:first-child {
                    font-weight: 500;
                    color: #333;
                    width: 45%;
                }
                .fee-receipt .receipt-table tr {
                    border-bottom: 1px solid #eee;
                  }
                .fee-receipt .receipt-table .total-row td {
                    font-weight: 600; 
                 }
                .counter-user {
                    text-align: center;
                    font-weight:bold;
                    font-size: 16px;
                    margin: 8px;
                }
                .fee-receipt .disclaimer {
                    margin-top: 16px;
                    font-size: 11px;
                    color: #555;
                    text-align: center;
                }
                @media print {
                    .fee-receipt { font-size: 12px; }
                    .no-print { display: none !important; }
                }
            `}</style>

            {/* HEADER */}
            <div className="receipt-header">
                <h2>{centerName}</h2>
                <div className="vatin">VATIN: OM1100477993</div>
            </div>

            <div className="receipt-title">Fee Receipt</div>

            <div className="barcode-section">
                <Barcode value={barcodeValue} />
                <div className="barcode-value">{arnNumber}</div>
                <div className="counter-user">Counter User: {counterUser}</div>
            </div>

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
                        <td>Applicant Phone No</td>
                        <td>{phone}</td>
                    </tr>
                    <tr>
                        <td>Passport No</td>
                        <td>{passportNo}</td>
                    </tr>
                    <tr>
                        <td>Passport Service</td>
                        <td>{passportService}</td>
                    </tr>
                </tbody>
            </table>

            <table className="receipt-table" style={{ marginTop: 12 }}>
                <tbody>
                    <tr>
                        <td>Passport Fee</td>
                        <td>{formatOMR(passportFee)}</td>
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
                            <td>VAT ({vatPercent}%)</td>
                            <td>{formatOMR(vatAmount)} (Included in Total B)</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <table className="receipt-table" style={{ marginTop: 12 }}>
                <tbody>
                    <tr>
                        <td>Payment Mode</td>
                        <td>{paymentMode}</td>
                    </tr>
                    <tr>
                        <td>Submission Mode</td>
                        <td>{submissionMode}</td>
                    </tr>
                    <tr>
                        <td>Delivery Date</td>
                        <td>{deliveryDate}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: 12, fontSize: 12 }}>
                <div>Please Track status your application: {trackUrl}</div>
                <div>Email: {email}</div>
            </div>

            <div className="barcode-section" style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>SGIVS Receipt No</div>
                <Barcode value={sgivsBarcodeValue} />
                <div className="barcode-value">{sgivsReceiptNo}</div>
            </div>

            <div className="disclaimer">
                <div>Fees once paid are not refundable</div>
                <div>Please retain the original receipt at the time of collection of your document</div>
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
        const passport_app_id = showModal?.passport_app_id || showModal?.id || showModal?._id;
        if (!passport_app_id) {
            closeModal();
            return;
        }

        const fetchReceipt = async () => {
            try {
                const { data } = await passportApplicationService.getReceipt(passport_app_id);
                const payload = data?.data ?? data;
                setReceiptData(payload);
            } catch (err) {
                const { error } = useAlertReducer.getState();
                error(err?.response?.data?.message ?? err?.message ?? 'Failed to load receipt');
                closeModal();
            }
        };
        fetchReceipt();
    }, [showModal, closeModal]);

    useEffect(() => {
        if (!receiptData || !showModal) return;

        // URL – open in new window and print
        const url = typeof receiptData === 'string' && receiptData.startsWith('http')
            ? receiptData
            : receiptData?.url;
        if (url) {
            const w = window.open(url, '_blank');
            if (w) {
                w.onload = () => {
                    w.focus();
                    w.print();
                };
            }
            closeModal();
            return;
        }

        // HTML string
        if (receiptData?.html) {
            const w = window.open('', '_blank');
            w.document.write(receiptData.html);
            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 300);
            closeModal();
            return;
        }

        // Formatted receipt (object) – wait for React + JsBarcode to render
        if (typeof receiptData === 'object' && !receiptData?.url && !receiptData?.html) {
            const timer = setTimeout(() => {
                const el = document.getElementById('fee-receipt-print');
                if (!el) {
                    closeModal();
                    return;
                }
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head><title>Print Receipt</title></head>
                        <body>${el.outerHTML}</body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => printWindow.print(), 300);
                closeModal();
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [receiptData, showModal, closeModal]);

    // Render nothing visible – receipt is rendered off-screen for object data
    if (!showModal) return null;

    const isObjectReceipt =
        receiptData &&
        typeof receiptData === 'object' &&
        !receiptData?.url &&
        !receiptData?.html;

    return (
        <div
            style={{
                position: 'fixed',
                left: -9999,
                top: 0,
                visibility: isObjectReceipt ? 'visible' : 'hidden',
            }}
            aria-hidden="true"
        >
            {isObjectReceipt && <ReceiptContent data={receiptData} />}
        </div>
    );
}

export default PrintReceiptModal;

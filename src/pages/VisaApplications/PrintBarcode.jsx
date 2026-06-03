import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import JsBarcode from 'jsbarcode';
import visaApplicationService from '../../services/VisaApplicationService';
import useAlertReducer from '../../stores/AlertReducer';

function BarcodeSvg({ value, options = {} }) {
    const svgRef = useRef(null);
    useEffect(() => {
        if (svgRef.current && value) {
            try {
                JsBarcode(svgRef.current, String(value), {
                    format: 'CODE128',
                    width: 2.5,
                    height: 60,
                    displayValue: false,
                    margin: 10,
                    ...options,
                });
            } catch (e) {
                // Fallback if barcode fails
            }
        }
    }, [value, options]);
    return value ? <svg ref={svgRef} className="barcode-svg" /> : null;
}

function BarcodeContent({ data }) {
    if (!data || typeof data !== 'object') return null;

    const barcodeValue = data.barcode_text || '—';
    const arn = data.reference_no || '—';
    const applicantName = data.applicant_name || '—';
    const formatApplicationDate = (dateValue) => {
        if (!dateValue) return '—';
        const m = moment(dateValue, ['DD/MM/YYYY', 'YYYY-MM-DD', moment.ISO_8601], true);
        return m.isValid() ? m.format('DD/MM/YYYY') : String(dateValue);
    };
    const applicationDate = data.application_date
        ? formatApplicationDate(data.application_date)
        : data.created_on
            ? formatApplicationDate(data.created_on)
            : '—';
    const deliveryMode = data.delivery_mode || '—';
    const icacCenter = data.icac || '—';

    return (
        <div className="visa-barcode" id="visa-barcode-print">
            <style>{`
                .visa-barcode {
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 24px;
                    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #1a1a1a;
                }
                .visa-barcode .barcode-title {
                    font-size: 18px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 20px;
                    color: #0d47a1;
                    letter-spacing: 0.5px;
                }
                .visa-barcode .barcode-section {
                    text-align: center;
                    padding: 16px 0;
                    background: #fafafa;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border: 1px solid #e8e8e8;
                }
                .visa-barcode .barcode-section .barcode-value {
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    margin: 8px 0;
                    font-family: 'Consolas', 'Monaco', monospace;
                }
                .visa-barcode .barcode-section svg {
                    max-width: 100%;
                    height: auto;
                }
                .visa-barcode .details-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .visa-barcode .details-table td {
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                    vertical-align: top;
                }
                .visa-barcode .details-table td:first-child {
                    font-weight: 500;
                    color: #555;
                    width: 42%;
                }
                .visa-barcode .details-table td:last-child {
                    font-weight: 600;
                    color: #111;
                }
                .visa-barcode .details-table tr:last-child td {
                    border-bottom: none;
                }
                @media print {
                    .visa-barcode { padding: 16px; }
                    .visa-barcode .barcode-section { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>


            <div className="barcode-section">
                <div className="barcode-value">{barcodeValue}</div>
                <BarcodeSvg value={barcodeValue} options={{ height: 70 }} />
                <div className="barcode-value">{barcodeValue}</div>
            </div>

            <table className="details-table">
                <tbody>
                    <tr>
                        <td>Reference No</td>
                        <td>{arn}</td>
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
                        <td>{deliveryMode}</td>
                    </tr>
                    <tr>
                        <td>ICAC</td>
                        <td>{icacCenter}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export function PrintBarcodeModal({ showModal, closeModal }) {
    const [barcodeData, setBarcodeData] = useState(null);

    useEffect(() => {
        if (!showModal) {
            setBarcodeData(null);
            return;
        }
        const visa_application_id =
            showModal?.id ??
            showModal?.visa_application_id;
        if (!visa_application_id) {
            closeModal();
            return;
        }

        const fetchBarcode = async () => {
            try {
                const { data } = await visaApplicationService.getBarcode(visa_application_id);
                setBarcodeData(data?.data ?? data);
            } catch (err) {
                const { error } = useAlertReducer.getState();
                error(err?.response?.data?.message ?? err?.message ?? 'Failed to load barcode');
                closeModal();
            }
        };
        fetchBarcode();
    }, [showModal, closeModal]);

    useEffect(() => {
        if (!barcodeData || !showModal) return;

        // URL – open in new window and print
        const url = typeof barcodeData === 'string' && barcodeData.startsWith('http')
            ? barcodeData
            : barcodeData?.url;
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
        if (barcodeData?.html) {
            const w = window.open('', '_blank');
            w.document.write(barcodeData.html);
            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 300);
            closeModal();
            return;
        }

        // Image – open in new window and print
        if (barcodeData?.image) {
            const w = window.open('', '_blank');
            w.document.write(`
                <html>
                    <head><title>Print Barcode</title></head>
                    <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                        <img src="${barcodeData.image}" alt="Barcode" style="max-width:100%;" />
                    </body>
                </html>
            `);
            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 300);
            closeModal();
            return;
        }

        // Formatted barcode (object)
        if (typeof barcodeData === 'object' && !barcodeData?.url && !barcodeData?.html && !barcodeData?.image) {
            const timer = setTimeout(() => {
                const el = document.getElementById('visa-barcode-print');
                if (!el) {
                    closeModal();
                    return;
                }
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head><title>Print Barcode</title></head>
                        <body style="margin:0;padding:20px;">${el.outerHTML}</body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => printWindow.print(), 300);
                closeModal();
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [barcodeData, showModal, closeModal]);

    if (!showModal) return null;

    const isObjectBarcode =
        barcodeData &&
        typeof barcodeData === 'object' &&
        !barcodeData?.url &&
        !barcodeData?.html &&
        !barcodeData?.image;

    return (
        <div
            style={{
                position: 'fixed',
                left: -9999,
                top: 0,
                visibility: isObjectBarcode ? 'visible' : 'hidden',
            }}
            aria-hidden="true"
        >
            {isObjectBarcode && <BarcodeContent data={barcodeData} />}
        </div>
    );
}

export default PrintBarcodeModal;

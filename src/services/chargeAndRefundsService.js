import Gateway from '../config/gateway';

const USE_MOCK = true; // 🔁 Toggle: true = mock data, false = real API

const mockResponse = {
    data: {
        records: [
            {
                application_type: "Passport",
                reference_no: null,
                applicant_name: "Rasik Ahammed",
                service: "Ordinary Passport 36 Pages (Passport Expiry in less than 1 Year)",
                amount: "35.3",
                payment_mode: "Cash",
                transaction_type: "Collected",
                transaction_date: "2026-06-08 05:57:14",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "Passport",
                reference_no: null,
                applicant_name: "Sheri Raza",
                service: "Jumbo Passport 60 Pages (Passport Expiry in less than 1 Year)",
                amount: "44.7",
                payment_mode: "Cash",
                transaction_type: "Collected",
                transaction_date: "2026-05-21 06:14:36",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "Passport",
                reference_no: null,
                applicant_name: "Mohammed Irshad",
                service: "Ordinary Passport 36 Pages (Passport Expiry in less than 1 Year)",
                amount: "35.3",
                payment_mode: "Credit Card / Debit Card / Other POS Transaction",
                transaction_type: "Collected",
                transaction_date: "2026-05-20 07:15:56",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "Attestation",
                reference_no: "ATA03",
                applicant_name: "asas asas",
                service: "Arabic Endorsement",
                amount: "6",
                payment_mode: "Credit Card / Debit Card / Other POS Transaction",
                transaction_type: "Collected",
                transaction_date: "2026-05-12 05:52:14",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "Attestation",
                reference_no: "ATA02",
                applicant_name: "Mkias Sas",
                service: "Arabic Endorsement",
                amount: "6",
                payment_mode: "Credit Card / Debit Card / Other POS Transaction",
                transaction_type: "Collected",
                transaction_date: "2026-05-12 05:47:43",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "Attestation",
                reference_no: "ATA01",
                applicant_name: "asas asas",
                service: "Arabic Endorsement",
                amount: "6",
                payment_mode: "Cash",
                transaction_type: "Collected",
                transaction_date: "2026-05-12 05:40:44",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "OCI",
                reference_no: "AP13",
                applicant_name: "Mayank Agarwal",
                service: "OCI Miscellaneous",
                amount: "0.00",
                payment_mode: "Cash",
                transaction_type: "Collected",
                transaction_date: "2026-05-07 08:23:25",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "OCI",
                reference_no: "AP12",
                applicant_name: "Suresh Karthik",
                service: "OCI Miscellaneous",
                amount: "0.00",
                payment_mode: "Cash",
                transaction_type: "Collected",
                transaction_date: "2026-05-07 08:20:39",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "OCI",
                reference_no: "AP11",
                applicant_name: "Himanshi Varadha",
                service: "OCI Services",
                amount: "0.00",
                payment_mode: "Cash",
                transaction_type: "Collected",
                transaction_date: "2026-05-07 07:55:23",
                processed_by: "SGIVS Global",
            },
            {
                application_type: "OCI",
                reference_no: "AP10",
                applicant_name: "Fathima Ahamed",
                service: "OCI Miscellaneous",
                amount: "0.00",
                payment_mode: "Cash",
                transaction_type: "Collected",
                transaction_date: "2026-05-07 07:43:25",
                processed_by: "SGIVS Global",
            },
        ],
        pagination: {
            totalRows: 23,
            totalPages: 3,
            currentPage: 1,
            limit: 10,
        },
    },
};

const getData = (payload) => {
    if (USE_MOCK) {
        return Promise.resolve({
            data: {
                status: 'success',
                message: 'Charge and refunds list fetched successfully',
                data: mockResponse.data,
            },
        });
    }
    return Gateway.post('finance/charge_and_refunds', payload);
};

const getReceipt = (params) => Gateway.post('finance/print_receipt', params);

export default { 
    getData,
    getReceipt
 };
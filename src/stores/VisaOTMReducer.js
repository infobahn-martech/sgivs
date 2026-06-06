import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaOTMService from '../services/visaOTMService';
// import { getItem } from '../helpers/localStorage';
// import { OTM_STATUS_ID } from '../utils/helpers';

const mapVisaOTMRow = (item) => ({
    id: item?.manifest_id,
    manifestId: item?.manifest_number ?? '-',
    date: item?.date ?? null,
    by: item?.employee_name ?? '-',
    totalApplication: item?.total_application ?? 0,
    raw: item,
});

const useVisaOTMReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    visaOTMData: {
        total: 0,
        data: [],
    },
    isLoadingPost: false,

    getData: async (params) => {
        try {
            set({
                isLoadingGet: true,
                errorMessage: '',
            });

            const payload = {
                from_date: params?.fromDate || null,
                to_date: params?.toDate || null,
                employee_id: params?.employeeId || null,
            };

            const { data } = await visaOTMService.getData(payload);

            const list = Array.isArray(data?.data) ? data.data : [];

            set({
                visaOTMData: {
                    total: list.length,
                    data: list.map(mapVisaOTMRow),
                },
                successMessage: data?.message ?? '',
                isLoadingGet: false,
            });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            const message = err?.response?.data?.message ?? err?.message ?? 'Something went wrong';

            set({
                errorMessage: message,
                isLoadingGet: false,
            });

            error(message);
        }
    },

    bulkStatusChange: async (payload, callback) => {
        const { error } = useAlertReducer.getState();

        try {
            set({ isLoadingPost: true, errorMessage: '', successMessage: '' });

            const response = await visaOTMService.bulkStatusChange(payload);
            const body = response?.data || {}; // { status, message, data: {...} }

            set({
                successMessage: body?.status === 'error' ? '' : (body?.message || ''),
                errorMessage: body?.status === 'error' ? (body?.message || '') : '',
            });

            // Hand the full body to the component so it can open the result modal
            callback?.(body);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong';

            error(msg); // only network/unexpected errors fall back to a toast
            set({ errorMessage: msg, successMessage: '' });
            callback?.(null, err);
        } finally {
            set({ isLoadingPost: false });
        }
    },
}));

export default useVisaOTMReducer;
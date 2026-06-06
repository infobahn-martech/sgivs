import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaInScanService from '../services/VisaInScanService';

const useVisaInScanReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    visaInScanData: [],
    isLoadingPost: false,

    getData: async (params = {}) => {
        try {
            set({ isLoadingGet: true, errorMessage: '', });

            const { data } = await visaInScanService.getData(params);

            set({
                visaInScanData: data?.data || [],
                isLoadingGet: false,
            });
        } catch (err) {
            const message =
                err?.response?.data?.message ??
                err?.message ??
                'Something went wrong';

            const { error } = useAlertReducer.getState();

            set({
                errorMessage: message,
                isLoadingGet: false,
                visaInScanData: [],
            });

            error(message);
        }
    },

    bulkStatusChange: async (payload, callback) => {
        const { error } = useAlertReducer.getState();

        try {
            set({ isLoadingPost: true, errorMessage: '', successMessage: '' });

            const response = await visaInScanService.bulkStatusChange(payload);
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

export default useVisaInScanReducer;
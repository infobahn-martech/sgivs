import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaIFMService from '../services/VisaIFMService';

const useVisaIFMReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    visaIFMData: null,
    isLoadingPost: false,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await visaIFMService.getData(params);
            const datas = data;
            set({
                visaIFMData: datas?.data,
                // successMessage: data?.response?.data?.message ?? data?.message,
                isLoadingGet: false,
            });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            set({
                errorMessage: err?.response?.data?.message ?? err?.message,
                isLoadingGet: false,
            });
            error(err?.response?.data?.message ?? err.message);
        }
    },

    bulkStatusChange: async (payload, callback) => {
        const { error } = useAlertReducer.getState();

        try {
            set({ isLoadingPost: true, errorMessage: '', successMessage: '' });

            const response = await visaIFMService.bulkStatusChange(payload);
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

export default useVisaIFMReducer;

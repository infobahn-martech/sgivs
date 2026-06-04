import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaOTSService from '../services/VisaOTSService';

const useVisaOTSReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    visaOTSData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await visaOTSService.getData(params);
            const datas = data;
            set({
                visaOTSData: datas?.data,
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
}));

export default useVisaOTSReducer;

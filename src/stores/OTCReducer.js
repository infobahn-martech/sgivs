import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import otcService from '../services/OTCService';

const useOTCReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    otcData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await otcService.getData(params);
            set({
                otcData: data?.data,
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

export default useOTCReducer;

import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import inScanService from '../services/inScanService';

const useInScanReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    inScanData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await inScanService.getData(params);
            set({
                inScanData: data?.data,
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

export default useInScanReducer;

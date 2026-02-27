import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import outScanService from '../services/outScanService';

const useOutScanReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    outScanData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await outScanService.getData(params);
            set({
                outScanData: data?.data,
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

export default useOutScanReducer;

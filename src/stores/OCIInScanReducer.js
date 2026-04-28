import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociInScanService from '../services/ociInScanService';

const useOCIInScanReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    ociInScanData: null,

    getData: async (payload) => {
        try {
            set({ isLoadingGet: true });
            const response = await ociInScanService.getData(payload);
            const data = response?.data;
            set({ ociInScanData: data?.data ?? [], isLoadingGet: false, });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            const msg =err?.response?.data?.message || err?.message || 'Something went wrong';
            set({ errorMessage: msg, isLoadingGet: false, });
            error(msg);
        }
    },
}));

export default useOCIInScanReducer;

import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociOTMService from '../services/ociOTMService';

const useOCIOTMReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    ociOTMData: null,

    getData: async (payload) => {
        try {
            set({ isLoadingGet: true });
            const response = await ociOTMService.getData(payload);
            const list = response?.data?.data || [];
            set({
            ociOTMData: {
                data: list,
                total: list.length,
            },
            isLoadingGet: false,
        });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            const msg =err?.response?.data?.message || err?.message || 'Something went wrong';
            set({ errorMessage: msg, isLoadingGet: false, });
            error(msg);
        }
    },
}));

export default useOCIOTMReducer;

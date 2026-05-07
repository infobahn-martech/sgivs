import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociOTSService from '../services/OCIOTSService';

const useOCIOTSReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    ociOTSData: null,
    isLoadingPost: false,

    getData: async (payload) => {
        try {
            set({ isLoadingGet: true });
            const response = await ociOTSService.getData(payload);
            const data = response?.data;
            set({ ociOTSData: data?.data ?? [], isLoadingGet: false, });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            const msg =err?.response?.data?.message || err?.message || 'Something went wrong';
            set({ errorMessage: msg, isLoadingGet: false, });
            error(msg);
        }
    },
}));

export default useOCIOTSReducer;

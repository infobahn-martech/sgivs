import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import otmService from '../services/otmService';

const useOTMReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    otmData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await otmService.getData(params);
            set({
                otmData: data?.data,
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

export default useOTMReducer;

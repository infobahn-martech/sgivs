import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import counterDeliveryService from '../services/counterDeliveryService';

const useCounterDeliveryReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    counterDeliveryData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await counterDeliveryService.getData(params);
            set({
                counterDeliveryData: data?.data,
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

export default useCounterDeliveryReducer;

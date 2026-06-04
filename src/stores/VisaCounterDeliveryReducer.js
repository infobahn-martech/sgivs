import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaCounterDeliveryService from '../services/VisaCounterDeliveryService';

const useVisaCounterDeliveryReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    visaCounterDeliveryData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await visaCounterDeliveryService.getData(params);
            const datas = data;
            set({
                visaCounterDeliveryData: datas?.data,
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

export default useVisaCounterDeliveryReducer;

import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociCounterDeliveryService from '../services/OCICounterDeliveryService';

const useOCICounterDeliveryReducer = create((set) => ({

    isLoadingGet: false,
    errorMessage: '',
    ociCounterDeliveryData: null,

    getData: async (payload) => {
        try {
            set({ isLoadingGet: true });
            const response = await ociCounterDeliveryService.getData(payload);
            const data = response?.data;
            set({ ociCounterDeliveryData: data?.data ?? [], isLoadingGet: false, });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
            set({ errorMessage: msg, isLoadingGet: false, });
            error(msg);
        }
    },
}));

export default useOCICounterDeliveryReducer;

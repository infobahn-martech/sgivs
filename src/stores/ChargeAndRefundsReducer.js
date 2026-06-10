import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import chargeAndRefundsService from '../services/chargeAndRefundsService';

const useChargeAndRefundsReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    chargeAndRefundsData: null,
    pagination: null,
    receiptData: null,
    isLoadingReceipt:    false,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const response = await chargeAndRefundsService.getData(params);
            const list = response?.data?.data;
            set({
                chargeAndRefundsData: list?.records ?? [],
                pagination: list?.pagination ?? null,
                isLoadingGet: false,
            });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            set({
                chargeAndRefundsData: [],
                pagination: null,
                errorMessage: err?.response?.data?.message ?? err?.message,
                isLoadingGet: false,
            });
            error(err?.response?.data?.message ?? err.message);
        }
    },

    getReceipt: async (params, onSuccess) => {
        try {
            set({ isLoadingReceipt: true, receiptData: null });
            const response = await chargeAndRefundsService.getReceipt(params);
            const data = response?.data?.data;
            set({ receiptData: data, isLoadingReceipt: false });
            if (onSuccess) onSuccess(data);
        } catch (err) {
            const { error } = useAlertReducer.getState();
            set({
                receiptData: null,
                errorMessage: err?.response?.data?.message ?? err?.message,
                isLoadingReceipt: false,
            });
            error(err?.response?.data?.message ?? err?.message);
        }
    },
}));

export default useChargeAndRefundsReducer;

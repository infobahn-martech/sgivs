import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import chargeAndRefundsService from '../services/chargeAndRefundsService';

const useChargeAndRefundsReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    chargeAndRefundsData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await chargeAndRefundsService.getData(params);
            const datas = data;
            set({
               chargeAndRefundsData: datas?.data,
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

export default useChargeAndRefundsReducer;

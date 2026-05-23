import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import counterDeliveryService from '../services/counterDeliveryService';
import { getItem } from '../helpers/localStorage';
import { CounterDelivery_STATUS_ID } from '../utils/helpers';

const useCounterDeliveryReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    counterDeliveryData: null,

    postData: async ({ application_numbers }, cb) => {
        try {
            set({ isLoading: true });
            const employee_id_raw = getItem('employee_id');
            const employee_id = employee_id_raw ? Number(employee_id_raw) : null;
            if (!employee_id) {
                const { error } = useAlertReducer.getState();
                error('Employee ID not found in local storage');
                set({ isLoading: false });
                return;
            }
            await counterDeliveryService.bulkStatusChange({
                status_id: CounterDelivery_STATUS_ID,
                employee_id,
                application_numbers,
            });
            const { success } = useAlertReducer.getState();
            success('Counter Delivery updated successfully');
            set({ isLoading: false });
            cb?.();
        } catch (err) {
            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
            set({ isLoading: false });
        }
    },

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

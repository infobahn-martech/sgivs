import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import otmService from '../services/otmService';
import { getItem } from '../helpers/localStorage';
import { OTM_STATUS_ID } from '../utils/helpers';

const useOTMReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    otmData: null,

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
            await otmService.bulkStatusChange({
                status_id: OTM_STATUS_ID,
                employee_id,
                application_numbers,
            });
            const { success } = useAlertReducer.getState();
            success('Out Scan to Mission updated successfully');
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

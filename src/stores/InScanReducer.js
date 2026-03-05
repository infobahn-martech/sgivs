import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import inScanService from '../services/inScanService';
import { getItem } from '../helpers/localStorage';
import { INSCAN_STATUS_ID } from '../utils/helpers';

const useInScanReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    inScanData: null,

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
            await inScanService.bulkStatusChange({
                status_id: INSCAN_STATUS_ID,
                employee_id,
                application_numbers,
            });
            const { success } = useAlertReducer.getState();
            success('In Scan updated successfully');
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
            const { data } = await inScanService.getData(params);
            set({
                inScanData: data?.data,
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

export default useInScanReducer;

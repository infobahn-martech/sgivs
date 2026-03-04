import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import outScanService from '../services/outScanService';

const EMPLOYEE_ID_KEY = 'employee_id'; // change if your key name differs
const OUTSCAN_STATUS_ID = 9;

const useOutScanReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    outScanData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await outScanService.getData(params);
            set({ outScanData: data?.data, isLoadingGet: false });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            set({
                errorMessage: err?.response?.data?.message ?? err?.message,
                isLoadingGet: false,
            });
            error(err?.response?.data?.message ?? err.message);
        }
    },

    // For Out Scan "Add" -> call bulk-status-change
    postData: async ({ application_numbers }, cb) => {
        try {
            set({ isLoading: true });

            const employee_id_raw = localStorage.getItem(EMPLOYEE_ID_KEY);
            const employee_id = employee_id_raw ? Number(employee_id_raw) : null;

            if (!employee_id) {
                const { error } = useAlertReducer.getState();
                error('Employee ID not found in local storage');
                set({ isLoading: false });
                return;
            }

            await outScanService.bulkStatusChange({
                status_id: OUTSCAN_STATUS_ID,
                employee_id,
                application_numbers,
            });

            const { success } = useAlertReducer.getState();
            success('Out Scan updated successfully');
            set({ isLoading: false });

            cb?.();
        } catch (err) {
            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
            set({ isLoading: false });
        }
    },
}));

export default useOutScanReducer;
import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import outScanService from '../services/outScanService';
import { getItem } from '../helpers/localStorage';
import { OUTSCAN_STATUS_ID } from '../utils/helpers';

// Status ID mapping:
// 0 - Inactive / Deleted Application
// 1 - Document Uploaded
// 2 - OutScanned from Spoke
// 3 - Inscan at hub
// 4 - Outscanned to mission
// 5 - Inscan from Mission
// 6 - Outscan to Spoke
// 7 - Counter Delivery
// 8 - Outscanned to Courier
// 9 - Delivered to Customer

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

    // For Out Scan "Add" -> call bulk_status_change
    // status_id: 2 = OutScanned from Spoke (default). Pass different status_id as needed.
    postData: async ({ application_numbers, status_id = OUTSCAN_STATUS_ID }, cb) => {
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

            await outScanService.bulkStatusChange({
                status_id,
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
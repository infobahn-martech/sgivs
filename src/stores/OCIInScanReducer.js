import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociInScanService from '../services/ociInScanService';

const useOCIInScanReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    ociInScanData: null,
    isLoadingPost: false,
    pagination: null,

    getData: async (payload) => {
        try {
            set({ isLoadingGet: true });
            const response = await ociInScanService.getData(payload);
            const list = response?.data;
            set({
                ociInScanData: list?.data ?? [],
                pagination: list?.pagination ?? null,
                isLoadingGet: false,
            });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
            set({ errorMessage: msg, isLoadingGet: false, });
            error(msg);
        }
    },

    bulkInscan: async (payload, callback) => {

        const { success, error } = useAlertReducer.getState();

        try {
            set({ isLoadingPost: true, errorMessage: '', successMessage: '', });

            const response = await ociInScanService.bulkInscan(payload);
            const data = response?.data;

            // Full error from backend
            if (data?.status === 'error') {
                error(data?.message || 'Something went wrong');
                callback?.(data);
                return;
            }

            // 🟢 SUCCESS CASE (build dynamic message)
            const updated = data?.updated_references || [];
            const deleted = data?.deleted_references || [];
            const missing = data?.missing_references || [];

            let parts = [];

            if (updated.length) {
                parts.push(`${updated.length} updated: ${updated.join(', ')}`);
            }

            if (deleted.length) {
                parts.push(`${deleted.length} deleted: ${deleted.join(', ')}`);
            }

            if (missing.length) {
                parts.push(`${missing.length} not found: ${missing.join(', ')}`);
            }

            const message = parts.join(' | ') || 'Operation completed';

            // 🟡 PARTIAL SUCCESS (has missing OR deleted OR mixed result)
            if (missing.length > 0) {
                error(message);

                set({
                    errorMessage: message,
                    successMessage: '',
                });
            }
            // 🟢 FULL SUCCESS
            else {
                success(message);

                set({
                    successMessage: message,
                    errorMessage: '',
                });
            }

            callback?.(data);

        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong';

            set({ errorMessage: msg, successMessage: '', });

            error(msg);
        }
        finally {
            set({ isLoadingPost: false });
        }
    },
}));

export default useOCIInScanReducer;

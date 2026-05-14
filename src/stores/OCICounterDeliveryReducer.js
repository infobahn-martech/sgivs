import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociCounterDeliveryService from '../services/OCICounterDeliveryService';

const useOCICounterDeliveryReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    ociCounterDeliveryData: null,
    isLoadingPost: false,
    pagination: null,

    getData: async (payload) => {
        try {
            set({ isLoadingGet: true });
            const response = await ociCounterDeliveryService.getData(payload);
            const list = response?.data;
            set({
                ociCounterDeliveryData: list?.data ?? [],
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

    bulkCounterDelivery: async (payload, callback) => {

        const { success, error } = useAlertReducer.getState();

        try {
            set({
                isLoadingPost: true,
                errorMessage: '',
                successMessage: '',
            });

            const response = await ociCounterDeliveryService.bulkCounterDelivery(payload);
            const data = response?.data;

            const status = data?.status;
            const backendMessage = data?.message || '';

            // Arrays
            const updated = data?.updated_references || [];
            const deleted = data?.deleted_references || [];
            const missing = data?.missing_references || [];
            const already = data?.already_in_same_status || [];

            // 🔥 BUILD MULTI-LINE TOAST
            let lines = [];

            // 1st line → backend message
            if (backendMessage) {
                lines.push(backendMessage);
            }

            // 2nd line → updated
            if (updated.length) {
                lines.push(`Updated (${updated.length}): ${updated.join(', ')}`);
            }

            // 3rd line → deleted
            if (deleted.length) {
                lines.push(`Deleted (${deleted.length}): ${deleted.join(', ')}`);
            }

            // 4th line → missing
            if (missing.length) {
                lines.push(`Missing (${missing.length}): ${missing.join(', ')}`);
            }

            // 5th line → already same status (optional but useful)
            if (already.length) {
                lines.push(`Already same (${already.length}): ${already.join(', ')}`);
            }

            const message = lines.join(' | ');

            // 🔥 TOAST HANDLING (ALL CASES SAME STRUCTURE)
            if (status === 'error') {
                error(message);
            } else if (status === 'info') {
                success(message);
            } else if (status === 'partial success') {
                success(message);
            } else {
                success(message);
            }

            set({
                successMessage: status === 'error' ? '' : message,
                errorMessage: status === 'error' ? message : '',
            });

            callback?.(data);

        } catch (err) {

            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong';

            error(msg);

            set({
                errorMessage: msg,
                successMessage: '',
            });

        } finally {

            set({
                isLoadingPost: false,
            });
        }
    },
}));

export default useOCICounterDeliveryReducer;

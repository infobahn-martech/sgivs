import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import attestationCounterDeliveryService from '../services/AttestationCounterDeliveryService';

const useAttestationCounterDeliveryReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    attestationCounterDeliveryData: null,
    isLoadingPost: false,
    pagination: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await attestationCounterDeliveryService.getData(params);
            const list = data;
            set({
                attestationCounterDeliveryData: list?.data,
                pagination: list?.pagination ?? null,
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

    bulkCounterDelivery: async (payload, callback) => {

        const { success, error } = useAlertReducer.getState();

        try {
            set({
                isLoadingPost: true,
                errorMessage: '',
                successMessage: '',
            });

            const response = await attestationCounterDeliveryService.bulkCounterDelivery(payload);
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

export default useAttestationCounterDeliveryReducer;

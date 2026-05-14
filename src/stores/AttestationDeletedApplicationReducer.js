import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import attestationDeletedApplicationService from '../services/attestationDeletedApplicationService';

const useAttestationDeleteApplicationReducer = create((set) => ({
    isLoadingGet: false, 
    errorMessage: '', 
    successMessage: '',
    deletedAttestationApplicationData: null,
    isLoadingRestore: false,
    pagination:null,

    getData: async (payload) => {
        try {
            set({ isLoadingGet: true });
            const response = await attestationDeletedApplicationService.getDeletedAttestationApplications(payload);
            const list = response?.data;
            set({
                deletedAttestationApplicationData: list?.data ?? [],
                pagination: list?.pagination ?? null,
                isLoadingGet: false,
            });
        } catch (err) {
            const { error } = useAlertReducer.getState();

            set({
                errorMessage: err?.response?.data?.message ?? err?.message,
                isLoadingGet: false,
                deletedOCIApplicationData: { data: [], total: 0 },
            });

            error(err?.response?.data?.message ?? err.message);
        }
    },

    restoreApplication: async (payload, callback) => {
        try {
            set({ isLoadingRestore: true });
            await attestationDeletedApplicationService.restoreAttestationApplication(payload);
            set({ isLoadingRestore: false });
            if (callback) callback();
        } catch (err) {
            set({ isLoadingRestore: false });

            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
        }
    },
}));

export default useAttestationDeleteApplicationReducer;

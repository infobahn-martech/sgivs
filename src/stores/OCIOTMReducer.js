import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociOTMService from '../services/ociOTMService';

const useOCIOTMReducer = create((set) => ({
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    ociOTMData: null,
    isLoadingPost: false,
    pagination: null,

    getData: async (payload) => {
        try {
            set({ isLoadingGet: true });
            const response = await ociOTMService.getData(payload);
            const list = response?.data;

            set({
                ociOTMData: list?.data ?? [],
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

    bulkOutscanToMission: async (payload, callback) => {
    
            const { success, error } = useAlertReducer.getState();
    
            try {
                set({ isLoadingPost: true, errorMessage: '', successMessage: '', });
    
                const response = await ociOTMService.bulkOutscanToMission(payload);
                const data = response?.data;
    
                // Full error from backend
                if (data?.status === 'error') {
                    error(data?.message || 'Something went wrong');
                    if (callback) callback(data);
                    return;
                }
    
                const updated = data?.updated_count || 0;
                const missing = data?.missing_references || [];
    
                // PARTIAL SUCCESS
                if (missing.length > 0) {
                    success(
                        `${updated} updated, ${missing.length} not found: ${missing.join(', ')}`
                    );
                }
                // FULL SUCCESS
                else {
                    success(`${updated} record(s) successfully updated`);
                }
    
                set({
                    successMessage: data?.message || 'Success',
                });
    
                callback?.(data);
    
            } catch (err) {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Something went wrong';
    
                set({ errorMessage: msg });
    
                error(msg);
            }
            finally {
                set({ isLoadingPost: false });
            }
        },
}));

export default useOCIOTMReducer;

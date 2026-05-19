import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import attestationVasApplicationsService from '../services/attestationVasApplicationsService';

const useAttestationVasApplicationsReducer = create((set) => ({
    isLoadingGet: false, attestationVasApplicationsData: null,
    
    isLoadingDelete: false,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await attestationVasApplicationsService.getData(params);
            const datas = data;
            set({
                attestationVasApplicationsData: datas?.data,
                // successMessage: data?.response?.data?.message ?? data?.message,
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

    deleteData: async (payload, cb) => {
        try {
            set({ isLoadingDelete: true });
            const res = await attestationVasApplicationsService.deleteAttestationVasApplication(payload);
            const { success } = useAlertReducer.getState();
            success(res?.data?.status || 'Deleted successfully');
            set({ isLoadingDelete: false });
            cb?.(res?.data);
        } catch (err) {
            set({ isLoadingDelete: false });
            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
        }
    },
}));

export default useAttestationVasApplicationsReducer;

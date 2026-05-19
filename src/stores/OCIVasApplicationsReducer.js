import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociVasApplicationsService from '../services/ociVasApplicationsService';

const useOCIVasApplicationsReducer = create((set) => ({
    isLoadingGet: false, ociVasApplicationsData: null,

    isLoadingDelete: false,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await ociVasApplicationsService.getData(params);
            const datas = data;
            set({
                ociVasApplicationsData: datas?.data,
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
            const res = await ociVasApplicationsService.deleteOCIVasApplication(payload);
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

export default useOCIVasApplicationsReducer;

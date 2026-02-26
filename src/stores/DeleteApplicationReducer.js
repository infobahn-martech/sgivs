import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import deleteApplicationService from '../services/deleteApplicationService';

const useDeleteApplicationReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    isLoadingDelete: false,
    errorMessage: '',
    successMessage: '',
    deleteApplicationData: null,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await deleteApplicationService.getData(params);
            const datas = data;
            set({
                deleteApplicationData: { data: datas?.data ?? [], total: datas?.total ?? 0 },
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
    deleteData: async (id, cb) => {
        try {
            set({ isLoadingDelete: true });
            const { data } = await deleteApplicationService.deleteData(id);
            const datas = data;
            set({
                deleteApplicationData: datas?.data,
                successMessage: data?.response?.data?.message ?? data?.message,
                isLoadingDelete: false,
            });
            cb && cb();
        } catch (err) {
            const { error } = useAlertReducer.getState();
            set({
                errorMessage: err?.response?.data?.message ?? err?.message,
                isLoadingDelete: false,
            });
            error(err?.response?.data?.message ?? err.message);
        }
    },
}));

export default useDeleteApplicationReducer;

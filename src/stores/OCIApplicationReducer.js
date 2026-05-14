import { create } from 'zustand';
import ociApplicationService from '../services/OCIApplicationService';
import useAlertReducer from './AlertReducer';

const useOCIApplicationReducer = create((set) => ({
    isCreateOCIApplicationLoading: false,
    isUpdateOCIApplicationLoading: false,
    isDeleteOCIApplicationLoading: false,

    editORviewOCIApplicationData: null, isLoadingEditOrViewOCIApplication: false,

    errorMessage: '',
    successMessage: '',
    ociApplicationsData: [],
    isLoadingGet: false,
    pagination: {},

    ociStatusList: [],
    isLoadingStatusList: false,

    createOCIApplication: async (payload, cb) => {
        try {
            set({ isCreateOCIApplicationLoading: true });
            const res = await ociApplicationService.createOCIApplication(payload);
            set({ isCreateOCIApplicationLoading: false });
            const { success } = useAlertReducer.getState();
            success(res?.data?.message || 'Created successfully');
            cb?.(res?.data);
        } catch (err) {
            set({ isCreateOCIApplicationLoading: false });
            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
        }
    },

    getOCIApplications: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await ociApplicationService.getOCIApplications(params);
            const ociApplicationsData = data?.data;
            set({
                ociApplicationsData,
                isLoadingGet: false,
                pagination: {
                    total_count: data?.pagination?.total_count,
                    page: data?.pagination?.page_no,
                    limit: data?.pagination?.limit,
                    total_pages: data?.pagination?.total_pages,
                }
            });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            set({
                isLoadingGet: false,
                ociApplicationsData: [],
                pagination: {},
            });
            error(err?.response?.data?.message ?? err.message);
        }
    },

    getOCIApplicationById: async (id) => {
        try {
            set({ isLoadingEditOrViewOCIApplication: true });

            const res = await ociApplicationService.getOCIApplicationById(id);

            set({
                editORviewOCIApplicationData: res?.data?.data || null,
                isLoadingEditOrViewOCIApplication: false,
            });

            return res?.data?.data;

        } catch (err) {
            set({ isLoadingEditOrViewOCIApplication: false });

            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
        }
    },

    updateOCIApplication: async (updatePayload,cb) => {
        try {
            set({ isUpdateOCIApplicationLoading: true });
            const { data } = await ociApplicationService.updateOCIApplication(updatePayload);
            const { success } = useAlertReducer.getState();
            success(data?.response?.data?.message ?? data?.message);
            set({
                successMessage: data?.response?.data?.message ?? data?.message,
                isUpdateOCIApplicationLoading: false,
            });
            cb?.(data);
        } catch (err) {
            const { error } = useAlertReducer.getState();
            set({
                errorMessage: err?.response?.data?.message ?? err?.message,
                isUpdateOCIApplicationLoading: false,
            });
            error(err?.response?.data?.message ?? err.message);
        }
    },
    deleteOCIApplication: async (payload, cb) => {
        try {
            set({ isDeleteOCIApplicationLoading: true });
            const res = await ociApplicationService.deleteOCIApplication(payload);
            const { success } = useAlertReducer.getState();
            success(res?.data?.status || 'Deleted successfully');
            set({ isDeleteOCIApplicationLoading: false });
            cb?.(res?.data);
        } catch (err) {
            set({ isDeleteOCIApplicationLoading: false });

            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
        }
    },

    getOCIStatusList: async () => {
        try {
            set({ isLoadingStatusList: true });

            const res = await ociApplicationService.getOCIStatusList();

            set({
                ociStatusList: res?.data?.data || [],
                isLoadingStatusList: false,
            });
        } catch (err) {
            set({ isLoadingStatusList: false });

            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
        }
    },
}));

export default useOCIApplicationReducer;

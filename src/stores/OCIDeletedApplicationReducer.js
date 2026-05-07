import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociDeletedApplicationService from '../services/ociDeletedApplicationService';

const useOCIDeletedApplicationReducer = create((set) => ({
  isLoading: false, isLoadingGet: false, isLoadingRestore: false,
  errorMessage: '', successMessage: '',
  deletedOCIApplicationData: { data: [], total: 0 },

  getData: async (payload) => {
    try {
      set({ isLoadingGet: true });

      const res =
        await ociDeletedApplicationService.getDeletedOCIApplications(payload);

      const apiData = res?.data;

      set({
        deletedOCIApplicationData: {
          data: apiData?.data || [],
          total: apiData?.pagination?.total_records || 0,
        },
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
      await ociDeletedApplicationService.restoreOCIApplication(payload);
      set({ isLoadingRestore: false });
      if (callback) callback();
    } catch (err) {
      set({ isLoadingRestore: false });

      const { error } = useAlertReducer.getState();
      error(err?.response?.data?.message ?? err.message);
    }
  },

}));

export default useOCIDeletedApplicationReducer;

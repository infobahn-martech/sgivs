import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociDeletedApplicationService from '../services/ociDeletedApplicationService';

const useOCIDeletedApplicationReducer = create((set) => ({
  isLoadingGet: false, 
  errorMessage: '', 
  successMessage: '',
  deletedOCIApplicationData: null,
  isLoadingRestore: false,

  getData: async (payload) => {
    try {
      set({ isLoadingGet: true });

      const res = await ociDeletedApplicationService.getDeletedOCIApplications(payload);

      const list = res?.data;

      set({
        deletedOCIApplicationData: list?.data ?? [],
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

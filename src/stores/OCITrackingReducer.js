import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociTrackingService from '../services/OCITrackingService';

const useOCITrackingReducer = create((set) => ({
  isLoadingGet: false,
  ociTrackingData: null,
  pagination: null,

  getData: async (payload) => {
    try {
      set({ isLoadingGet: true });
      const response = await ociTrackingService.getData(payload);
      const list = response?.data;
      set({
        ociTrackingData: list?.data ?? [],
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
}));

export default useOCITrackingReducer;

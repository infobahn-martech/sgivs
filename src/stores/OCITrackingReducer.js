import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import ociTrackingService from '../services/OCITrackingService';

const useOCITrackingReducer = create((set) => ({
  isLoadingGet: false,
  errorMessage: '',
  successMessage: '',
  ociTrackingData: null,

  getData: async (payload) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await ociTrackingService.getData(payload);
      set({
        ociTrackingData: data?.data,
        isLoadingGet: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
      set({ errorMessage: msg, isLoadingGet: false, ociTrackingData: null, });
      error(msg);
    }
  },
}));

export default useOCITrackingReducer;

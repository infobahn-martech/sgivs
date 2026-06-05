import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaTrackingService from '../services/VisaTrackingService';

const useVisaTrackingReducer = create((set) => ({
  isLoadingGet: false,
  errorMessage: '',
  successMessage: '',
  visaTrackingData: null,

  getData: async (payload) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await visaTrackingService.getData(payload);
      set({
        visaTrackingData: data?.data,
        isLoadingGet: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
      set({ errorMessage: msg, isLoadingGet: false, visaTrackingData: null, });
      error(msg);
    }
  },
}));

export default useVisaTrackingReducer;
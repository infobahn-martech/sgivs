import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import passportTrackingService from '../services/passportTrackingService';

const usePassportTrackingReducer = create((set) => ({

  isLoadingGet: false,
  errorMessage: '',
  successMessage: '',
  passportTrackingData: null,

  getData: async (payload) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await passportTrackingService.getData(payload);
      set({
        passportTrackingData: data?.data,
        isLoadingGet: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoadingGet: false,
        passportTrackingData: null,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
}));

export default usePassportTrackingReducer;

import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import attestationtrackingService from '../services/attestationtrackingService';

const useAttestationtrackingService = create((set) => ({
  isLoadingGet: false,
  errorMessage: '',
  successMessage: '',
  attestationTrackingData: null,

  getData: async (params) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await attestationtrackingService.getData(params);
      const datas = data;
      set({
        attestationTrackingData: datas?.data,
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
}));

export default useAttestationtrackingService;

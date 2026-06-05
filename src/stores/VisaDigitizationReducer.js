import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaDigitizationService from '../services/VisaDigitizationService';

const useVisaDigitizationReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  errorMessage: '',
  successMessage: '',
  visaDigitizationData: null,
  uploadResults: null,

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true, errorMessage: '', successMessage: '' });

      const { data } = await visaDigitizationService.postData(payload);
      const { success } = useAlertReducer.getState();

      const message = data?.message ?? 'Upload completed';

      // status can be "success" or "partial_success"
      if (data?.status === 'success') {
        success(message);
      } else {
        // partial success / failures -> surface as a warning/error toast
        error(message);
      }

      set({
        successMessage: message,
        uploadResults: data?.results ?? null,
        isLoading: false,
      });

      cb && cb(data);
    } catch (err) {
      const { error } = useAlertReducer.getState();
      const message = err?.response?.data?.message ?? err?.message;
      set({ errorMessage: message, isLoading: false });
      error(message);
    }
  },

  getData: async (params) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await visaDigitizationService.getData(params);
      debugger
      const datas = data;
      set({
        visaDigitizationData: datas?.data,
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

export default useVisaDigitizationReducer;

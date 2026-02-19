import { create } from 'zustand';
import passportApplicationService from '../services/PassportApplicationService';
import useAlertReducer from './AlertReducer';


const usePassportApplicationReducer = create((set) => ({
  isCreatePassportApplicationLoading: false,
  isUpdatePassportApplicationLoading: false,
  isDeletePassportApplicationLoading: false,
  errorMessage: '',
  successMessage: '',
  passportApplicationsData: [],
  isLoadingGet: false,
  pagination: {},
  paymentModeData: [],
  isLoadingPaymentMode: false,
  getDataPaymentMode: async () => {
    try {
      set({ isLoadingPaymentMode: true });
      const { data } = await passportApplicationService.paymentMode();
      set({ paymentModeData: data?.data, isLoadingPaymentMode: false });
      const { success } = useAlertReducer.getState();
      success(data?.message);
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoadingPaymentMode: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
  createPassportApplication: async (data) => {
    try {
      set({ isCreatePassportApplicationLoading: true });
      const { data } = await passportApplicationService.createPassportApplication(data);
      set({ isCreatePassportApplicationLoading: false });
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isCreatePassportApplicationLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
  updatePassportApplication: async (id, data) => {
    try {
      set({ isUpdatePassportApplicationLoading: true });
      const { data } = await passportApplicationService.updatePassportApplication(id, data);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isUpdatePassportApplicationLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isDeletePassportApplicationLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
  deletePassportApplication: async (id) => {
    try {
      set({ isDeletePassportApplicationLoading: true });
      const { data } = await passportApplicationService.deletePassportApplication(id);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isDeletePassportApplicationLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isDeletePassportApplicationLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  getPassportApplications: async (params) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await passportApplicationService.getPassportApplications(params);
      const passportApplicationsData = data?.data;
      set({ passportApplicationsData, isLoadingGet: false, pagination: data?.pagination });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        isLoadingGet: false,
        passportApplicationsData: [],
        pagination: {},
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },



}));

export default usePassportApplicationReducer;

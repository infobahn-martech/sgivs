import { create } from 'zustand';
import passportApplicationService from '../services/PassportApplicationService';
import useAlertReducer from './AlertReducer';


const usePassportApplicationReducer = create((set) => ({
  isCreatePassportApplicationLoading: false,
  isUpdatePassportApplicationLoading: false,
  isLoading: false,
  isDeletePassportApplicationLoading: false,
  isLoadingDelete: false,
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
  postData: async (payload, cb) => {
    try {
      set({ isCreatePassportApplicationLoading: true, isLoading: true });
      const { data } = await passportApplicationService.createFullApplication(payload);
      set({ isCreatePassportApplicationLoading: false, isLoading: false });
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message ?? 'Application created successfully');
      typeof cb === 'function' && cb();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isCreatePassportApplicationLoading: false,
        isLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
      typeof cb === 'function' && cb();
    }
  },
  patchData: async (payload, cb) => {
    try {
      set({ isUpdatePassportApplicationLoading: true, isLoading: true });
      const { data } = await passportApplicationService.updatePassportApplication(payload);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message ?? 'Application updated successfully');
      set({ isUpdatePassportApplicationLoading: false, isLoading: false });
      typeof cb === 'function' && cb();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isUpdatePassportApplicationLoading: false,
        isLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
      typeof cb === 'function' && cb();
    }
  },
  updatePassportApplication: async (payload) => {
    try {
      set({ isUpdatePassportApplicationLoading: true });
      const { data } = await passportApplicationService.updatePassportApplication(payload);
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
  deleteData: async (passport_app_id, cb) => {
    try {
      set({ isDeletePassportApplicationLoading: true, isLoadingDelete: true });
      const { data } = await passportApplicationService.deletePassportApplication(passport_app_id);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message ?? 'Deleted successfully');
      set({ isDeletePassportApplicationLoading: false, isLoadingDelete: false });
      typeof cb === 'function' && cb();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ isDeletePassportApplicationLoading: false, isLoadingDelete: false });
      error(err?.response?.data?.message ?? err.message);
      typeof cb === 'function' && cb();
    }
  },
  deletePassportApplication: async (id) => {
    try {
      set({ isDeletePassportApplicationLoading: true, isLoadingDelete: true });
      const { data } = await passportApplicationService.deletePassportApplication(id);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isDeletePassportApplicationLoading: false,
        isLoadingDelete: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isDeletePassportApplicationLoading: false,
        isLoadingDelete: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  addComment: async (passport_app_id, comment, cb) => {
    try {
      set({ isCreatePassportApplicationLoading: true });
      const { data } = await passportApplicationService.addComment(passport_app_id, comment);
      set({ isCreatePassportApplicationLoading: false });
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message ?? 'Comment added successfully');
      typeof cb === 'function' && cb();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isCreatePassportApplicationLoading: false,
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

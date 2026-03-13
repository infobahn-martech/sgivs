import { create } from 'zustand';
import visaApplicationService from '../services/VisaApplicationService';
import useAlertReducer from './AlertReducer';

const useVisaApplicationReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  errorMessage: '',
  successMessage: '',
  visaApplicationsData: [],
  pagination: {},

  postData: async (payload, callback) => {
    try {
      set({ isLoading: true, errorMessage: '' });

      const response = await visaApplicationService.createVisaApplication(payload);
      const responseData = response?.data;

      const { success } = useAlertReducer.getState();
      success(
        responseData?.response?.data?.message ??
        responseData?.message ??
        'Visa application created successfully'
      );

      set({
        isLoading: false,
        successMessage:
          responseData?.response?.data?.message ??
          responseData?.message ??
          'Visa application created successfully',
      });

      if (typeof callback === 'function') callback();
      return true;
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Something went wrong';
      const { error } = useAlertReducer.getState();

      set({
        isLoading: false,
        errorMessage: message,
      });

      error(message);
      return false;
    }
  },

  patchData: async (payload, callback) => {
    try {
      set({ isLoading: true, errorMessage: '' });

      const response = await visaApplicationService.updateVisaApplication(payload);
      const responseData = response?.data;

      const { success } = useAlertReducer.getState();
      success(
        responseData?.response?.data?.message ??
        responseData?.message ??
        'Visa application updated successfully'
      );

      set({
        isLoading: false,
        successMessage:
          responseData?.response?.data?.message ??
          responseData?.message ??
          'Visa application updated successfully',
      });

      if (typeof callback === 'function') callback();
      return true;
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Something went wrong';
      const { error } = useAlertReducer.getState();

      set({
        isLoading: false,
        errorMessage: message,
      });

      error(message);
      return false;
    }
  },

  deleteVisaApplication: async (id) => {
    try {
      set({ isLoading: true, errorMessage: '' });

      const response = await visaApplicationService.deleteVisaApplication(id);
      const responseData = response?.data;

      const { success } = useAlertReducer.getState();
      success(
        responseData?.response?.data?.message ??
        responseData?.message ??
        'Visa application deleted successfully'
      );

      set({
        isLoading: false,
        successMessage:
          responseData?.response?.data?.message ??
          responseData?.message ??
          'Visa application deleted successfully',
      });

      return true;
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Something went wrong';
      const { error } = useAlertReducer.getState();

      set({
        isLoading: false,
        errorMessage: message,
      });

      error(message);
      return false;
    }
  },

  getVisaApplications: async (params) => {
    try {
      set({ isLoadingGet: true });

      const response = await visaApplicationService.getVisaApplications(params);
      const responseData = response?.data;
      const visaApplicationsData = responseData?.data ?? [];

      set({
        visaApplicationsData,
        pagination: responseData?.pagination ?? {},
        isLoadingGet: false,
      });
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Something went wrong';
      const { error } = useAlertReducer.getState();

      set({
        isLoadingGet: false,
        visaApplicationsData: [],
        pagination: {},
      });

      error(message);
    }
  },
}));

export default useVisaApplicationReducer;
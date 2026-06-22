/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import designationService from '../services/designationService';

const useDesignationReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  errorMessage: '',
  successMessage: '',
  designationData: [],
  pagination: null,

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await designationService.postData(payload);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isLoading: false,
      });
      cb && cb();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  patchData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await designationService.patchData(payload); 
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isLoading: false,
      });
      cb && cb();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  getData: async (params) => {
    try {
      set({ isLoadingGet: true, successMessage: '' });
      const { data } = await designationService.getData(params);
      set({
        designationData: data?.data,
        // successMessage: data?.response?.data?.message ?? data?.message,
        pagination: data?.pagination ?? null,
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

  clearCounterData: () => {
    set({
      designationData: [],
      errorMessage: '',
      successMessage: '',
    });
  },

  deleteData: async (id, cb) => {
    try {
      set({ isLoadingDelete: true });
      const { data } = await designationService.deleteData(id);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const total = data?.total ?? list?.length ?? 0;
      set({
        designationData: { data: list, total },
        successMessage: data?.response?.data?.message ?? data?.message,
        isLoadingDelete: false,
      });
      cb && cb();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoadingDelete: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

}));

export default useDesignationReducer;

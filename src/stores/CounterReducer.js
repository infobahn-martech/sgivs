/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import counterService from '../services/counterService';

const useCounterReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  errorMessage: '',
  successMessage: '',
  counterData: null,
  centers: [],
  counters: [],

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await counterService.postData(payload);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isLoading: false,
      });
      cb & cb();
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

      const { data } = await counterService.patchData(payload); // Updated call

      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);

      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isLoading: false,
      });
      cb & cb();
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
      const { data } = await counterService.getData(params);
      const datas = data;
      set({
        counterData: datas?.data,
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
  getAllCenter: async () => {
    try {
      set({ isLoadingGet: true });
      const { data } = await counterService.getAllCenter();
      const datas = data;
      set({
        centers: datas?.data,
        isLoadingGet: false,
      });
    } catch (err) {
      set({
        isLoadingGet: false,
      });
    }
  },


  getAllCounter: async (id) => {
    try {
      set({ isLoadingGet: true });
      const {
        data: { data },
      } = await counterService.getAllCounter(id);
      set({
        counters: data,
        isLoadingGet: false,
      });
    } catch (err) {
      set({
        isLoadingGet: false,
      });
    }
  },
  clearCounterData: () => {
    set({
      counters: [],
      errorMessage: '',
      successMessage: '',
    });
  },
  deleteData: async (id, cb) => {
    try {
      set({ isLoadingDelete: true });
      const { data } = await counterService.deleteData(id);
      const datas = data;
      set({
        counterData: datas?.data,
        successMessage: data?.response?.data?.message ?? data?.message,
        isLoadingDelete: false,
      });
      cb & cb();
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

export default useCounterReducer;

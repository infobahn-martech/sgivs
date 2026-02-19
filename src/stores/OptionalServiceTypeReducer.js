/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import optionalServiceTypeService from '../services/optionalServiceTypeService';

const useOptionalServiceTypeReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  errorMessage: '',
  successMessage: '',
  optionalServiceTypeData: null,
  optionalServices: [],

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await optionalServiceTypeService.postData(payload);
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

      const { id, ...rest } = payload;
      const { data } = await optionalServiceTypeService.patchData(id, rest); // Updated call

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
      const { data } = await optionalServiceTypeService.getData(params);
      set({
        optionalServiceTypeData: data?.data,
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
      const { data } = await optionalServiceTypeService.getAllCenter();
      const datas = data;
      set({
        optionalServices: datas?.data?.data,
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
      } = await optionalServiceTypeService.getAllCounter(id);
      set({
        optionalServices: data?.data,
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
      optionalServices: [],
      errorMessage: '',
      successMessage: '',
    });
  },
  deleteData: async (id, cb) => {
    try {
      set({ isLoadingDelete: true });
      const { data } = await optionalServiceTypeService.deleteData(id);
      const datas = data;
      set({
        optionalServiceTypeData: datas?.data,
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

export default useOptionalServiceTypeReducer;

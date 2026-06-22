import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import roleService from '../services/roleService';

const useRoleRudcer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  errorMessage: '',
  successMessage: '',
  roleData: null,
  pagination: null,

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await roleService.postData(payload);
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
      const { data } = await roleService.patchData(payload);

      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      cb && cb();
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isLoading: false,
      });
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
      set({ isLoadingGet: true });
      const { data } = await roleService.getData(params);
      set({
        roleData: data?.data,
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

  deleteData: async (id, cb) => {
    try {
      set({ isLoadingDelete: true });
      const { data } = await roleService.deleteData(id);
      const datas = data;
      set({
        roleData: datas?.data,
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

export default useRoleRudcer;

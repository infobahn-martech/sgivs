import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import appointmentTypeService from '../services/appointmentTypeService';

const useAppointmentTypeReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  errorMessage: '',
  successMessage: '',
  appointmentTypeData: null,

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await appointmentTypeService.postData(payload);
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

      const { id, ...rest } = payload;
      const { data } = await appointmentTypeService.patchData(id, rest); // Updated call

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
      const { data } = await appointmentTypeService.getData(params);

      set({
        appointmentTypeData: data?.data,
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
  deleteData: async (id, cb) => {
    try {
      set({ isLoadingDelete: true });
      const { data } = await appointmentTypeService.deleteData(id);
      set({
        appointmentTypeData: data?.data,
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

export default useAppointmentTypeReducer;

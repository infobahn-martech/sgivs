import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import bookAppointmentService from '../services/bookAppointmentService';

const useBookAppointmentReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  errorMessage: '',
  successMessage: '',
  bookAppointmentData: null,

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await bookAppointmentService.postData(payload);
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
      // Payload: { center_id, country_id, mission_id, center_name }
      const { data } = await bookAppointmentService.patchData(payload);

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
      const { data } = await bookAppointmentService.getData(params);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const total = data?.total ?? list?.length ?? 0;
      set({
        bookAppointmentData: { data: list, total },
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
      const { data } = await bookAppointmentService.deleteData(id);
      const datas = data;
      set({
        bookAppointmentData: datas?.data,
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

export default useBookAppointmentReducer;

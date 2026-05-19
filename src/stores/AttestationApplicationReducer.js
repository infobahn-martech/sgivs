import { create } from 'zustand';
import attestationApplicationService from '../services/attestationApplicationService';
import useAlertReducer from './AlertReducer';


const useAttestationApplicationReducer = create((set) => ({
  isCreateAttestationApplicationLoading: false,
  isUpdateAttestationApplicationLoading: false,
  isDeleteAttestationApplicationLoading: false,

  editORviewAttestationApplicationData: null, isLoadingEditOrViewAttestationApplication: false,

  errorMessage: '',
  successMessage: '',
  attestationApplicationsData: [],
  isLoadingGet: false,
  pagination: null,

  createAttestationApplication: async (payload, callback) => {
    try {
      set({ isCreateAttestationApplicationLoading: true });

      const response = await attestationApplicationService.createAttestationApplication(payload);

      const resData = response?.data;

      set({ isCreateAttestationApplicationLoading: false });

      if (resData?.status === 'error') {
        useAlertReducer.getState().error(resData?.message);
        return;
      }

      useAlertReducer.getState().success(resData?.message);

      callback?.(resData);

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong';

      set({
        errorMessage: msg,
        isCreateAttestationApplicationLoading: false,
      });

      useAlertReducer.getState().error(msg);
    }
  },

  updateAttestationApplication: async (updatePayload, callback) => {
    try {
      set({ isUpdateAttestationApplicationLoading: true });
      const { data } = await attestationApplicationService.updateAttestationApplication(updatePayload);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isUpdateAttestationApplicationLoading: false,
      });
      if (typeof callback === 'function') callback();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isDeleteAttestationApplicationLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
  deleteAttestationApplication: async (id) => {
    try {
      set({ isDeleteAttestationApplicationLoading: true });
      const { data } = await attestationApplicationService.deleteAttestationApplication(id);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isDeleteAttestationApplicationLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isDeleteAttestationApplicationLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  getAttestationApplications: async (params) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await attestationApplicationService.getAttestationApplications(params);
      const attestationApplicationsData = data?.data;
      set({ attestationApplicationsData, isLoadingGet: false, pagination: data?.pagination });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        isLoadingGet: false,
        attestationApplicationsData: [],
        pagination: {},
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  getAttestationApplicationById: async (id) => {
    try {
      set({
        editORviewAttestationApplicationData: null, // clear old data
        isLoadingEditOrViewAttestationApplication: true,
      });

      const res = await attestationApplicationService.getAttestationApplicationById(id);

      set({
        editORviewAttestationApplicationData: res?.data?.data || null,
        isLoadingEditOrViewAttestationApplication: false,
      });

      return res?.data?.data;

    } catch (err) {
      set({ isLoadingEditOrViewAttestationApplication: false });

      const { error } = useAlertReducer.getState();
      error(err?.response?.data?.message ?? err.message);
    }
  },
}));

export default useAttestationApplicationReducer;

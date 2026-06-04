import { create } from 'zustand';
import visaApplicationService from '../services/VisaApplicationService';
import useAlertReducer from './AlertReducer';

const useVisaApplicationReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  isMetaLoading: false,
  errorMessage: '',
  successMessage: '',
  visaApplicationsData: [],
  pagination: {},

  visaDurationData: [],
  visaEntryData: [],
  nationalityData: [],
  visaStatusData: [],

  changeServiceDetails: null,
  isLoadingChangeService: false,

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

  deleteVisaApplication: async (id, cb) => {
    try {
      set({ isLoadingDelete: true });
      const res = await visaApplicationService.deleteVisaApplication(id);
      const { success } = useAlertReducer.getState();
      success(res?.data?.status || 'Deleted successfully');
      set({ isLoadingDelete: false });
      cb?.(res?.data);
    } catch (err) {
      set({ isLoadingDelete: false });

      const { error } = useAlertReducer.getState();
      error(err?.response?.data?.message ?? err.message);
    }
  },

  getVisaApplications: async (params) => {
    try {
      set({ isLoadingGet: true });

      const response = await visaApplicationService.getVisaApplications(params);
      const responseData = response?.data;
      set({
      visaApplicationsData: responseData?.data ?? [],
      pagination: {
        page: responseData?.page ?? 1,
        limit: responseData?.limit ?? 10,
        total_records: responseData?.total_records ?? 0,
        total_pages: responseData?.total_pages ?? 0,
      },
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

  getVisaDurations: async () => {
    try {
      set({ isMetaLoading: true });
      const response = await visaApplicationService.getVisaDurations();
      set({
        visaDurationData: response?.data?.data ?? [],
        isMetaLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ isMetaLoading: false, visaDurationData: [] });
      error(err?.response?.data?.message ?? err?.message ?? 'Failed to fetch visa durations');
    }
  },

  getVisaEntries: async () => {
    try {
      set({ isMetaLoading: true });
      const response = await visaApplicationService.getVisaEntries();
      set({
        visaEntryData: response?.data?.data ?? [],
        isMetaLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ isMetaLoading: false, visaEntryData: [] });
      error(err?.response?.data?.message ?? err?.message ?? 'Failed to fetch visa entries');
    }
  },

  getVisaNationalities: async () => {
    try {
      set({ isMetaLoading: true });
      const response = await visaApplicationService.getVisaNationalities();
      set({
        nationalityData: response?.data?.data ?? [],
        isMetaLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ isMetaLoading: false, nationalityData: [] });
      error(err?.response?.data?.message ?? err?.message ?? 'Failed to fetch nationalities');
    }
  },

  getVisaStatuses: async () => {
    try {
      set({ isMetaLoading: true });
      const response = await visaApplicationService.getVisaStatuses();
      set({
        visaStatusData: response?.data?.data ?? [],
        isMetaLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ isMetaLoading: false, visaStatusData: [] });
      error(err?.response?.data?.message ?? err?.message ?? 'Failed to fetch visa statuses');
    }
  },

  getVisaMetaData: async () => {
    try {
      set({ isMetaLoading: true });

      const [
        durationRes,
        entryRes,
        nationalityRes,
        statusRes,
      ] = await Promise.all([
        visaApplicationService.getVisaDurations(),
        visaApplicationService.getVisaEntries(),
        visaApplicationService.getVisaNationalities(),
        visaApplicationService.getVisaStatuses(),
      ]);

      set({
        visaDurationData: durationRes?.data?.data ?? [],
        visaEntryData: entryRes?.data?.data ?? [],
        nationalityData: nationalityRes?.data?.data ?? [],
        visaStatusData: statusRes?.data?.data ?? [],
        isMetaLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        isMetaLoading: false,
        visaDurationData: [],
        visaEntryData: [],
        nationalityData: [],
        visaStatusData: [],
      });
      error(err?.response?.data?.message ?? err?.message ?? 'Failed to fetch visa metadata');
    }
  },

  getChangeServiceDetails: async (visa_application_id, cb) => {
    try {
      set({ isLoadingChangeService: true });
      const response = await visaApplicationService.getChangeServiceDetails(visa_application_id);
      const responseData = response?.data;

      set({
        changeServiceDetails: responseData?.data ?? null,
        isLoadingChangeService: false,
      });

      cb?.(responseData?.data ?? null);
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Something went wrong';
      const { error } = useAlertReducer.getState();

      set({ isLoadingChangeService: false, changeServiceDetails: null });
      error(message);
    }
  },
}));

export default useVisaApplicationReducer;
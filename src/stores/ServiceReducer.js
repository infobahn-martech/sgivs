/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import counterService from '../services/counterService';
import serviceService from '../services/serviceService';

const useServiceReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  isLaodingServicesByType:false,

  errorMessage: '',
  successMessage: '',

  serviceData: null,
  pagination: null,

   // Service Types
  serviceTypes: [], isLoadingServiceTypes: false,

  // Services by service_type_id
  servicesByType: [],

  selectedService: null, isLoadingSelectedService: false, 

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await serviceService.postData(payload);
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
      const { data } = await serviceService.patchData(payload); // Updated call

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
      const { data } = await serviceService.getData(params);
      const datas = data;
      set({
        serviceData: datas?.data,
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

  getAllServiceType: async () => {
    try {
      set({ isLoadingServiceTypes: true });
      const {
        data: { data },
      } = await serviceService.getAllServiceType();
      set({
        serviceTypes: data,
        isLoadingServiceTypes: false,
      });
    } catch (err) {
      set({
        isLoadingServiceTypes: false,
      });
    }
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

  getServicesByServiceType: async (service_type_id) => {
    try {
      set({ isLaodingServicesByType: true });

      const {
        data: { data },
      } = await serviceService.getServicesByServiceType(service_type_id);

      set((state) => ({
        servicesByType: data || [],
        isLaodingServicesByType: false,
      }));
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLaodingServicesByType: false,
      });

      error(err?.response?.data?.message ?? err.message);
    }
  },

   getServiceById: async (service_id, cb) => {
    try {
      set({ isLoadingSelectedService: true });

      const { data } = await serviceService.getServiceById(service_id);

      set({
        selectedService: data?.data,
        isLoadingSelectedService: false,
      });

      cb?.(data?.data);
    } catch (err) {
      const { error } = useAlertReducer.getState();

      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoadingSelectedService: false,
      });

      error(err?.response?.data?.message ?? err.message);
    }
  },
}));

export default useServiceReducer;

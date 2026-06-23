import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import centerService from '../services/centerService';
import userService from '../services/userService';

const useCenterReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  isLoadingDelete: false,
  errorMessage: '',
  successMessage: '',
  centerData: null,
  countryList: [],
  missionList: [],
  isLoadingCountries: false,
  isLoadingMissions: false,
  pagination: null,

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await centerService.postData(payload);
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
      const { data } = await centerService.patchData(payload);
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
      const { data } = await centerService.getData(params);
      set({
        centerData: data?.data || [],
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
      const { data } = await centerService.deleteData(id);
      const datas = data;
      set({
        centerData: datas?.data,
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

  getCountries: async () => {
    try {
      set({ isLoadingCountries: true });
      const { data } = await userService.getCountries();
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      set({ countryList: list, isLoadingCountries: false });
      return list;
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ isLoadingCountries: false, countryList: [] });
      error(err?.response?.data?.message ?? err.message);
      return [];
    }
  },

  getMissionsByCountry: async (countryId) => {
    if (!countryId) {
      set({ missionList: [] });
      return [];
    }
    try {
      set({ isLoadingMissions: true });
      const { data } = await userService.getMissionsByCountry(countryId);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      set({ missionList: list, isLoadingMissions: false });
      return list;
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ missionList: [], isLoadingMissions: false });
      error(err?.response?.data?.message ?? err.message);
      return [];
    }
  },
}));

export default useCenterReducer;

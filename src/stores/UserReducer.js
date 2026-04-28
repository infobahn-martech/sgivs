import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import userService from '../services/userService';

const useUserReducer = create((set) => ({
  isLoading: false, isLoadingGet: false, isLoadingDelete: false,
  errorMessage: '', successMessage: '',
  countryList: [], missionList: [], centerList: [], isLoadingCountries: false, isLoadingMissions: false, isLoadingCenters: false,
  employeeList: [], employeeCount: 0, isLoadingEmployees: false,
  employeeData: null,
  isLoadingStatus: false,

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await userService.postData(payload);
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
      const { data } = await userService.patchData(payload);

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

  getEmployeeById: async (employee_id) => {
    set({ isLoadingGet: true });

    const { data } = await userService.getDataById(employee_id);

    set({
      employeeData: data?.data,
      isLoadingGet: false,
    });

    return data?.data;
  },

  getAllEmployees: async (params) => {
    try {
      set({ isLoadingEmployees: true });

      const { data } = await userService.getData(params);

      const employees = data?.data?.employees || [];
      const pagination = data?.data?.pagination || {};

      set({
        employeeList: employees,
        employeeCount: pagination?.total_records || 0,
        isLoadingEmployees: false,
      });

      return data;
    } catch (err) {
      const { error } = useAlertReducer.getState();

      set({
        isLoadingEmployees: false,
        employeeList: [],
        employeeCount: 0,
      });

      error(err?.response?.data?.message ?? err.message);
    }
  },

  changeEmployeeStatus: async (payload, cb) => {
    try {
      set({ isLoadingStatus: true });

      const { data } = await userService.changeStatus(payload);

      const { success } = useAlertReducer.getState();
      success(data?.message ?? 'Status updated successfully');

      set({
        isLoadingStatus: false,
      });

      cb && cb();
    } catch (err) {
      const { error } = useAlertReducer.getState();

      set({
        isLoadingStatus: false,
      });

      error(err?.response?.data?.message ?? err.message);
    }
  },

  // Dropdown APIs
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

  getCentersByMission: async (mission_id) => {
    if (!mission_id) {
      set({ centerList: [] });
      return [];
    }
    try {
      set({ isLoadingCenters: true });
      const { data } = await userService.getCentersByMission(mission_id);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      set({ centerList: list, isLoadingCenters: false });
      return list;
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ centerList: [], isLoadingCenters: false });
      error(err?.response?.data?.message ?? err.message);
      return [];
    }
  },
}));

export default useUserReducer;

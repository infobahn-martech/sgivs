import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import returnFromMissionService from '../services/returnFromMissionService';

const useReturnFromMissionReducer = create((set) => ({
  isLoading: false,
  isLoadingGet: false,
  returnFromMissionData: null,

  getData: async (params) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await returnFromMissionService.getData(params);
      set({
        returnFromMissionData: {
          data: data?.data?.records || [],
          total: data?.data?.total_count || 0,
          limit: data?.data?.limit,
          offset: data?.data?.offset,
        },
        isLoadingGet: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ isLoadingGet: false, });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  postData: async (payload, cb) => {
    try {
      set({ isLoading: true });
      const { data } = await returnFromMissionService.postData(payload);
      const { success } = useAlertReducer.getState();
      success(data?.message || 'Applications returned from mission successfully');
      cb?.();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      error(err?.response?.data?.message ?? err.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useReturnFromMissionReducer;

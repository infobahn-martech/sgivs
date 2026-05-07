import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import returnFromMissionService from '../services/returnFromMissionService';

const useReturnFromMissionReducer = create((set) => ({
  returnFromMissionData: null,
  isLoadingGet: false,

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

      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoadingGet: false,
      });

      error(err?.response?.data?.message ?? err.message);
    }
  },
}));

export default useReturnFromMissionReducer;

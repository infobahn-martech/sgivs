import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import misDailyUserReportService from '../services/MisDailyUserReportService';

const useMISDailyUserReportReducer = create((set, get) => ({
  isLoadingGet: false,
  reportData: null,

  getData: async (params) => {
    try {
      set({ isLoadingGet: true });
      const { data } = await misDailyUserReportService.getData(params);
      set({ reportData: data?.data, isLoadingGet: false });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      error(err?.response?.data?.message ?? err?.message);
      set({ isLoadingGet: false });
    }
  },
}));

export default useMISDailyUserReportReducer;
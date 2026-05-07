import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import dailyCashCollectionService from '../services/dailyCashCollectionService';

const useDailyCashCollectionReducer = create((set) => ({
    dailyCashCollectionData: null,
    isLoadingGet: false,

    getData: async (params) => {
        try {
            set({ isLoadingGet: true });
            const { data } = await dailyCashCollectionService.getData(params);
            set({
                dailyCashCollectionData: {
                    records: data?.data?.records ?? [],
                    total_count: data?.data?.total_count ?? 0,
                    limit: data?.data?.limit ?? 10,
                    offset: data?.data?.offset ?? 0,
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

export default useDailyCashCollectionReducer;

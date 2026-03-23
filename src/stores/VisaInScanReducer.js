import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaInScanService from '../services/VisaInScanService';

const useVisaInScanReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    visaInScanData: {
        total: 0,
        data: [],
    },

    getData: async (params = {}) => {
        try {
            set({ isLoadingGet: true, errorMessage: '' });

            const { data } = await visaInScanService.getData(params);

            const apiRows = data?.data ?? [];

            const normalizedRows = apiRows.map((item, index) => ({
                id: item?.id ?? `${item?.date || 'row'}-${index}`,
                date: item?.date ?? '',
                created_by: item?.created_by ?? '',
                total_application: item?.total_application ?? 0,
            }));

            const searchText = (params?.search || '').toLowerCase().trim();

            let filteredRows = normalizedRows;

            if (searchText) {
                filteredRows = normalizedRows.filter((item) => {
                    return (
                        String(item?.date || '').toLowerCase().includes(searchText) ||
                        String(item?.created_by || '').toLowerCase().includes(searchText) ||
                        String(item?.total_application || '').toLowerCase().includes(searchText)
                    );
                });
            }

            if (params?.fromDate) {
                filteredRows = filteredRows.filter((item) => item?.date && item.date >= params.fromDate);
            }

            if (params?.toDate) {
                filteredRows = filteredRows.filter((item) => item?.date && item.date <= params.toDate);
            }

            if (params?.sortBy) {
                const { sortBy, sortOrder = 'DESC' } = params;

                filteredRows = [...filteredRows].sort((a, b) => {
                    const aVal = a?.[sortBy];
                    const bVal = b?.[sortBy];

                    if (sortBy === 'date') {
                        const aTime = aVal ? new Date(aVal).getTime() : 0;
                        const bTime = bVal ? new Date(bVal).getTime() : 0;
                        return sortOrder === 'ASC' ? aTime - bTime : bTime - aTime;
                    }

                    if (typeof aVal === 'number' && typeof bVal === 'number') {
                        return sortOrder === 'ASC' ? aVal - bVal : bVal - aVal;
                    }

                    return sortOrder === 'ASC'
                        ? String(aVal || '').localeCompare(String(bVal || ''))
                        : String(bVal || '').localeCompare(String(aVal || ''));
                });
            }

            const page = Number(params?.page || 1);
            const limit = Number(params?.limit || 10);
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedRows = filteredRows.slice(startIndex, endIndex);

            set({
                visaInScanData: {
                    total: filteredRows.length,
                    data: paginatedRows,
                },
                isLoadingGet: false,
            });
        } catch (err) {
            const message = err?.response?.data?.message ?? err?.message ?? 'Something went wrong';
            const { error } = useAlertReducer.getState();

            set({
                errorMessage: message,
                isLoadingGet: false,
                visaInScanData: {
                    total: 0,
                    data: [],
                },
            });

            error(message);
        }
    },
}));

export default useVisaInScanReducer;
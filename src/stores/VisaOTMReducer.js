import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaOTMService from '../services/VisaOTMService';

const mapVisaOTMRow = (item) => ({
    id: item?.manifest_id,
    manifestId: item?.manifest_number ?? '-',
    date: item?.date ?? null,
    by: item?.employee_name ?? '-',
    totalApplication: item?.total_application ?? 0,
    raw: item,
});

const useVisaOTMReducer = create((set) => ({
    isLoading: false,
    isLoadingGet: false,
    errorMessage: '',
    successMessage: '',
    visaOTMData: {
        total: 0,
        data: [],
    },

    getData: async (params) => {
        try {
            set({
                isLoadingGet: true,
                errorMessage: '',
            });

            const payload = {
                from_date: params?.fromDate || null,
                to_date: params?.toDate || null,
                employee_id: params?.employeeId || null,
            };

            const { data } = await visaOTMService.getData(payload);

            const list = Array.isArray(data?.data) ? data.data : [];

            set({
                visaOTMData: {
                    total: list.length,
                    data: list.map(mapVisaOTMRow),
                },
                successMessage: data?.message ?? '',
                isLoadingGet: false,
            });
        } catch (err) {
            const { error } = useAlertReducer.getState();
            const message = err?.response?.data?.message ?? err?.message ?? 'Something went wrong';

            set({
                errorMessage: message,
                isLoadingGet: false,
            });

            error(message);
        }
    },
}));

export default useVisaOTMReducer;
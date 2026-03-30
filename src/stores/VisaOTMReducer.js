import { create } from 'zustand';
import useAlertReducer from './AlertReducer';
import visaOTMService from '../services/visaOTMService';
import { getItem } from '../helpers/localStorage';
import { OTM_STATUS_ID } from '../utils/helpers';

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

    postData: async ({ application_numbers }, cb) => {
        try {
            set({ isLoading: true });
            const employee_id_raw = getItem('employee_id');
            const employee_id = employee_id_raw ? Number(employee_id_raw) : null;
            if (!employee_id) {
                const { error } = useAlertReducer.getState();
                error('Employee ID not found in local storage');
                set({ isLoading: false });
                return;
            }
            await visaOTMService.bulkStatusChange({
                status_id: OTM_STATUS_ID,
                employee_id,
                application_numbers,
            });
            const { success } = useAlertReducer.getState();
            success('Visa Out Scan to Mission updated successfully');
            set({ isLoading: false });
            cb?.();
        } catch (err) {
            const { error } = useAlertReducer.getState();
            error(err?.response?.data?.message ?? err.message);
            set({ isLoading: false });
        }
    },
}));

export default useVisaOTMReducer;
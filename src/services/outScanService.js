import Gateway from '../config/gateway';

// // LIST (status = 2)
// const getData = (params) =>
//     Gateway.post('/passport/list', { ...params, status: 2 });

const getData = (params) => {
    const { date, center_id, employee_id, ...rest } = params || {};
    const queryParams = {
        ...rest,
        ...(date && { date }),           // YYYY-MM-DD
        ...(center_id && { center_id }),
        ...(employee_id && { employee_id }),
        status: 1,
    };
    return Gateway.post('/outscan/spoke_list', queryParams);
};

// BULK STATUS CHANGE (Out Scan -> status_id = 9)
const bulkStatusChange = ({ status_id, employee_id, application_numbers }) =>
    Gateway.post('/passport_scan/bulk_status_change', {
        status_id,
        employee_id,
        application_numbers, // "APPT001\nAPPT002"
    });

export default { getData, bulkStatusChange };
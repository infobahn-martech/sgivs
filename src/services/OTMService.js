import Gateway from '../config/gateway';

const getData = () => Gateway.post('passport/status_list', { status: 9 });


const bulkStatusChange = ({ status_id, employee_id, application_numbers }) =>
    Gateway.post('/passport_scan/bulk_status_change', {
        status_id,
        employee_id,
        application_numbers,
    });

export default { getData, bulkStatusChange };

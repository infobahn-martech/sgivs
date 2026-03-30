import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/visa/outscan_to_mission/list', payload);

const bulkStatusChange = ({ status_id, employee_id, application_numbers }) =>
    Gateway.post('/visa/scan/bulk_status_change', {
        status_id,
        employee_id,
        application_numbers,
    });

export default { getData, bulkStatusChange };
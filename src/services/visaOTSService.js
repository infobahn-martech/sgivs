import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/visa/outscan_to_spoke/list', payload );
const bulkStatusChange = (payload) => Gateway.post('/visa/scan/bulk_status_change', payload);

export default { getData, bulkStatusChange };

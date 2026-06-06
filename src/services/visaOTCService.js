import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('/visa/outscan_to_courier/list',  params );
const bulkStatusChange = (payload) => Gateway.post('/visa/scan/bulk_status_change', payload);

export default { getData, bulkStatusChange };

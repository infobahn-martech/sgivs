import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('/visa/counter_delivery/list',  params );
const bulkStatusChange = (payload) => Gateway.post('/visa/scan/bulk_status_change', payload);

export default { getData, bulkStatusChange };

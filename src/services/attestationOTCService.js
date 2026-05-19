import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/attestation/outscan_to_courier_list', payload);
const bulkOTC = (payload) => Gateway.post('/attestation/bulk-courier-dispatch', payload);

export default {
     getData, 
     bulkOTC,
 };
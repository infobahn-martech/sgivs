import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/oci/inscan-hub-list', payload);
const bulkInscan = (payload) => Gateway.post('/oci/bulk-inscan-hub', payload);

export default {
     getData,
     bulkInscan,
};

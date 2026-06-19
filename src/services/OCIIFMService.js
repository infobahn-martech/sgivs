import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/oci/inscan-from-mission-list', payload);
const bulkIFM = (payload) => Gateway.post('/oci/inscan-from-mission/bulk-update', payload);

export default {
     getData,
     bulkIFM,
};

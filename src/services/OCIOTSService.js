import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('oci/outscan-to-spoke/list', payload);
const bulkOTS = (payload) => Gateway.post('/oci/bulk-inscan-hub', payload);

export default {
    getData,
    bulkOTS,
};


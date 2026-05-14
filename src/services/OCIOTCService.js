import Gateway from '../config/gateway';

const getData = (payload) => Gateway.get('/oci/outscan-to-courier-list', payload);
const bulkOTC = (payload) => Gateway.post('/oci/bulk-outscan-to-courier', payload);

export default {
    getData,
    bulkOTC
};

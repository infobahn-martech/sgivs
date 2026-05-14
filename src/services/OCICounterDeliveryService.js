import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/oci/counter-delivery-list', payload);
const bulkCounterDelivery = (payload) => Gateway.post('/oci/bulk-counter-delivery', payload);

export default {
    getData,
    bulkCounterDelivery,
};

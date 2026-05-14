import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/attestation/counter_delivery_list', payload);
const bulkCounterDelivery = (payload) => Gateway.post('/attestation/bulk_counter_delivery', payload);

export default {
    getData,
    bulkCounterDelivery,
};

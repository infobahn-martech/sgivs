import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/attestation/inscan-hub-list',  payload );
const bulkInscan = (payload) => Gateway.post('/attestation/bulk-inscan-hub', payload);

export default { 
    getData, 
    bulkInscan,
};

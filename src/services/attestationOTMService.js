import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/attestation/outscan-to-mission-list', payload);
const bulkOTM = (payload) => Gateway.post('/attestation/bulk-outscan-to-mission', payload);

export default { 
    getData,
    bulkOTM,
 };

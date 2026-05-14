import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/attestation/outscan-to-spoke-list', payload);
const bulkOTS = (payload) => Gateway.post('/attestation/bulk-outscan-to-spoke', payload);

export default { 
    getData,
    bulkOTS,
 };

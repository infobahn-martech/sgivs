import Gateway from '../config/gateway';

const getData = (payload) => Gateway.get('/attestation/inscan-from-mission-list', payload);
const bulkIFM = (payload) => Gateway.post('/attestation/bulk_inscan_from_mission', payload);

export default { 
    getData,
    bulkIFM,
 };

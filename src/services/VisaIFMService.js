import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('visa/inscan_from_mission/list', payload);
const bulkIFM = (payload) => Gateway.post('/visa/inscan_from_mission/bulk_update', payload);

export default { 
    getData,
    bulkIFM
 };

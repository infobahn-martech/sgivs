import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/oci/outscan_to_mission/list', payload);
const bulkOutscanToMission = (payload) => Gateway.post('/oci/bulk-outscan-mission', payload);

export default {
    getData,
    bulkOutscanToMission,
};
